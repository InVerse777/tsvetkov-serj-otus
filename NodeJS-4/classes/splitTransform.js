const { Transform, Readable } = require("node:stream");
const path = require("node:path");
const { createWriteStream } = require("node:fs");
class SplitTransform extends Transform {
  constructor(splitSize, numOfOutFiles, opt) {
    super(opt);
    this.splitSize = splitSize;
    this.numOfOutFiles = numOfOutFiles;
    this.currentOutFile = 0;
    this.stopLimit = splitSize;
    this.numArray = [];
    this.bufferStr = "";
    this.bytesRead = 0;
    this.outStream = null;
  }
  _transform(data, encoding, cb) {
    this._parseArray(data, cb);
  }
  async _parseArray(chunk, cb) {
    this.bytesRead += chunk.length;
    this.bufferStr += chunk;
    if (this.bufferStr && this.bufferStr.length) {
      let bufferArr = this.bufferStr.split("\n");
      this.numArray = this.numArray.concat(
        bufferArr.slice(0, bufferArr.length - 2).map(Number)
      );
      this.bufferStr = bufferArr.at(-1);
    }
    if (this.bytesRead >= Math.round(this.stopLimit)) {
      console.log(`${this.bytesRead} of ${this.stopLimit}`);

      this.numArray.sort(function (a, b) {
        return a - b;
      });
      await this._writeFileWithStream(this.numArray, this.currentOutFile);
      this.stopLimit += this.splitSize;
      this.currentOutFile += 1;
      this.numArray = [];
    }
    cb();
  }

  async _writeFileWithStream(numArray, currentOutFile) {
    const rs = new Readable({
      read() {
        console.log(`Started export of ${currentOutFile}`);
        try {
          rs.push(numArray.join("\n"));
        } catch (err) {
          console.log(`err ${err}`);
        }
        console.log("written");
        this.push(null);
      },
    });
    const ws = createWriteStream(path.join("nums", `nums_${currentOutFile}.txt`), {
      highWaterMark: 1024 * 1,
    });

    rs.pipe(ws);
    rs.read();
    return;
  }
}

module.exports = SplitTransform;
