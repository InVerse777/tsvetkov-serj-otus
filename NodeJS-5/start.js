const minimist = require("minimist");
const tree = require(".//tree");
const argv = require("minimist")(process.argv.slice(2));
if (tree.init())
  console.log(tree.getDirStructure(argv._[0], 0, tree.depth, ""));
