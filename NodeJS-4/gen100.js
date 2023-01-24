const fs = require("node:fs");
const path = require("node:path");
const { Readable } = require("node:stream");
const fileName = "nums.txt";
const maxRange = 99999999;
const sizeInBytes = 100 * 1024 * 1024; //100Mb

class generatorReader extends Readable {
  constructor(writer, maxRange, sizeInBytes, opt) {
    super(opt);

    this._maxRange = maxRange;
    this._sizeInBytes = sizeInBytes;
    this.writer = writer;
  }

  _read() {
    if (writer.bytesWritten >= this._sizeInBytes) {
      this.push(null);
    } else {
      const newNumber = Math.floor(Math.random() * this._maxRange);
      this.push(Buffer.from(newNumber + "\n", "utf8"));
    }
  }
}
const writer = fs.createWriteStream(fileName, {
  highWaterMark: 16384,
  encoding: "utf8",
});
const readerGenerator = new generatorReader(writer, maxRange, sizeInBytes);
console.log("Generating file...");
readerGenerator.on("end", () => {
  console.log("Finished generating file!!!");
});
readerGenerator.pipe(writer);
readerGenerator.read();
