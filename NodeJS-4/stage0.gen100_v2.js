const fs = require("node:fs");
const path = require("node:path");
const { Readable } = require("node:stream");
const fileName = "nums.txt";
const maxRange = 99999999;
const sizeInBytes = 100 * 1024 * 1024; //100Mb

// По какой-то причине Maximum resident set size (kbytes): 917624 a у stage0.gen100.js 104628?????

function* generateRandomNumbers(sizeInBytes, maxRange) {
  let totalBytesSent = 0;
  while (totalBytesSent <= sizeInBytes) {
    // console.log(`${totalBytesSent} of ${sizeInBytes}`);
    const newNumber = Math.floor(Math.random() * maxRange);
    totalBytesSent += yield newNumber;
  }
}

class generatorReader extends Readable {
  constructor(generatorFunction, opt) {
    super(opt);
    this.genRandNum = generatorFunction;
  }
  _read() {
    let next = this.genRandNum.next();
    let buf;
    while (!next.done) {
      buf = Buffer.from(next.value + "\n", "utf8");
      this.push(buf);
      next = this.genRandNum.next(buf.length);
    }
    this.push(null);
    console.log("Finished generating numbers!");
  }
}

const writer = fs.createWriteStream(fileName, {
  highWaterMark: 16384, //16384 is the default value
  encoding: "utf8",
});
const readerGenerator = new generatorReader(
  generateRandomNumbers(sizeInBytes, maxRange),
  {
    highWaterMark: 64 * 1024,
    encoding: "utf8",
  }
);

console.log("Generating numbers and writing with streams...");
readerGenerator.pipe(writer);
readerGenerator.read();
