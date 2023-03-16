const fs = require("node:fs/promises");
const { createReadStream, readdirSync } = require("node:fs");
const { readdir } = require("node:fs/promises");
const path = require("node:path");
const sourceFile = "nums.txt";
const SplitTransform = require("./classes/splitTransform");
const { SortStreamController } = require("./classes/sortStreamController");
const numsDirectory = "nums";
const allNumsSortedFilename = "all_nums_sorted.txt";
const destFilesCount = 10;

const execArgv = require("minimist")(process.execArgv);
let limit_mb = 50;
if (execArgv["max-old-space-size"] && execArgv["max-old-space-size"] > 20) {
  limit_mb = execArgv["max-old-space-size"]; //not using it yet...
}
console.log("Process started!!!Splitting large file");
splitNsort(sourceFile, numsDirectory, limit_mb)
  .then(() => console.log("Split finished"))
  .then(() =>
    sortFromFiles(
      path.join(__dirname, numsDirectory),
      allNumsSortedFilename,
      limit_mb
    )
  )
  .then(() => console.log("Finished ALL"))
  .catch((err) => console.log(`Semeting wet wrong. Error:${err}`));

async function sortFromFiles(dir, allNumsSortedFilename, limit_mb) {
  const ssc = new SortStreamController();
  const addStreamPromises = [];
  try {
    const files = await readdir(dir);
    for (const f of files) {
      // console.log("Adding_stream");
      addStreamPromises.push(ssc.addStream(path.join(dir, f)));
    }
    await Promise.all(addStreamPromises);
    console.log(`RSS: ${process.memoryUsage().rss / 1024 / 1024}`);
    // console.log('All Promises resolved')
    await ssc.sort(allNumsSortedFilename);
  } catch (err) {
    console.error(err);
  }
  return;
}

//Split sourceFile to `destFilesCount` files, sort numbers in each file in asc order and save them to an emptied `numsDirectory`
async function splitNsort(sourceFile, numsDirectory, limit_mb) {
  await fs.mkdir(numsDirectory, { recursive: true });
  for (const file of await fs.readdir(numsDirectory)) {
    await fs.unlink(path.join(numsDirectory, file));
  }

  //todo: add check (file exists)
  const fileSize = (await fs.stat(sourceFile)).size;
  const reader = createReadStream(sourceFile, {
    encoding: "utf8",
    highWaterMark: 64 * 1024, //64*1024 is the default value
  });
  const splitter = new SplitTransform(fileSize / destFilesCount, {
    highWaterMark: 16 * 1024, //16384 is the default value
    encoding: "utf8",
  });

  //console.log(`filesize:${fileSize}`);
  reader.pipe(splitter);
  await new Promise((resolve, reject) => {
    reader.on("close", () => {
      resolve();
    });
  });
  // reader.destroy();
  // splitter.destroy();
  return;
}
