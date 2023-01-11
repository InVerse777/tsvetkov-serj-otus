const argv = require("minimist")(process.argv.slice(2));
const fs = require("fs");
const path = require("path");

let depth = undefined;
if ((argv._.length = 1) && fs.existsSync(argv._[0])) {
  if ("d" in argv && !isNaN(parseInt(argv.d))) depth = parseInt(argv.d);
  if ("depth" in argv && !isNaN(parseInt(argv.d))) depth = parseInt(argv.depth);
  drawDirStructure(argv._[0], 0, depth, "");
} else {
  console.log("There are some errors with input arguments!");
}

function drawDirStructure(dirPath, depth, maxDepth, treeStr) {
  let filenames = fs.readdirSync(dirPath);
  let isLast = false;
  const listLen = filenames.length;
  for (let i = 0; i < listLen; i++) {
    file = filenames[i];
    isLast = i === listLen - 1;
    absPath = path.resolve(dirPath, file);
    const isDir = fs.statSync(absPath).isDirectory();
    const dirStrStr = directoryStructString(
      depth,
      isLast,
      file,
      isDir,
      treeStr
    );
    console.log(dirStrStr.resString);
    if (isDir && (typeof maxDepth === "undefined" || depth + 1 < maxDepth)) {
      drawDirStructure(absPath, depth + 1, maxDepth, dirStrStr.treeStrNext);
    }
  }
}
function directoryStructString(curDepth, isLast, name, isDirectory, treeStr) {
  let resString, treeStrNext;
  resString = treeStrNext = treeStr;
  if (curDepth > 0) {
    treeStrNext = isLast ? treeStr + "  " : treeStr + "│ ";
    resString += isLast ? "└── " : "├── ";
  }
  resString += isDirectory ? name + "[D]" : name;

  return {
    resString: resString,
    treeStrNext: treeStrNext,
  };
}
