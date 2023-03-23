const mm = require("minimist");
const fs = require("fs");
const path = require("path");

let depth = undefined; //default value
let dirPath = null; //default value

function init() {
  const argv = mm(process.argv.slice(2));
  console.log(argv);
  if ((argv._.length = 1) && fs.existsSync(argv._[0])) {
    if ("d" in argv && !isNaN(parseInt(argv.d)) && argv.d >= 1)
      this.depth = parseInt(argv.d);
    if ("depth" in argv && !isNaN(parseInt(argv.depth)) && argv.depth >= 1)
      this.depth = parseInt(argv.depth);
    if (typeof this.depth === "undefined") {
      console.log(
        "Depth not defined or does not meet requirements. Using default value 2. P.S. Depth should be >=1"
      );
      this.depth = 2;
    }
    return true;
  } else {
    console.log(
      "Dir not set or does not exist. Example: node start.js /home/user/testdir -d 3"
    );
    return false;
  }
}

function getDirStructure(dirPath, depth, maxDepth, treeStr) {
  const resDirStr = [];
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
    resDirStr.push(dirStrStr.resString);
    if (isDir && (typeof maxDepth === "undefined" || depth + 1 < maxDepth)) {
      resDirStr.push(
        ...getDirStructure(
          absPath,
          depth + 1,
          maxDepth,
          dirStrStr.treeStrNext
        ).split("\n")
      );
    }
  }
  return resDirStr.join("\n");
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
module.exports = { init, getDirStructure, directoryStructString, depth };
