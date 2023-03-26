const mock = require("mock-fs");
const tree = require("./tree.js");

memFs = {
  testdir: {
    "test_file1_level_2.txt": "test_file1_content/n1/n2/n3",
    test_directory_level2: {
      "test_file1_level_3.txt": "test_file1_level_3.txt content",
      "test_file2_level_3.txt": "test_file2_level_3.txt content",
      "test_file3_level_3.txt": "test_file3_level_3.txt content",
      test_directory_level3: {
        "test_file1_level_4.txt": "test_file1_level_4.txt content",
      },
    },
    "test_file1_level2.txt": "test_file1_level2.txt content",
    "some.png": Buffer.from([8, 6, 7, 5, 3, 0, 9]),
  },
};

describe("testing init parameters", () => {
  beforeEach(() => {
    tree.depth = undefined;
  });

  test("runs app with no arguments", () => {
    process.argv = ["node", "start.js"];
    expect(tree.init()).toBeFalsy();
    expect(tree.depth).toBeUndefined();
  });
  test("runs app with directory argument", () => {
    process.argv = ["node", "start.js", "./"];
    tree.init();
    expect(tree.depth).toEqual(2);
  });
  test("runs app with wrong directory argument", () => {
    process.argv = ["node", "start.js", "ggd"];
    expect(tree.init()).toBeFalsy();
  });
  test("runs app with -d depth parameter", () => {
    process.argv = ["node", "start.js", "./", "-d", "4"];
    tree.init();
    expect(tree.depth).toEqual(4);
  });
  test("runs app with --depth depth parameter", () => {
    process.argv = ["node", "start.js", "./", "--depth", "7"];
    tree.init();
    expect(tree.depth).toEqual(7);
  });

  test("runs app with --depth depth parameter", () => {
    process.argv = ["node", "start.js", "./", "--depth", "7"];
    tree.init();
    expect(tree.depth).toEqual(7);
  });
  test("runs app with non numerical --depth ", () => {
    process.argv = ["node", "start.js", "./", "--depth", "0"];
    tree.init();
    expect(tree.depth).toEqual(2);
  });
  test("runs app with --depth -2 ", () => {
    process.argv = ["node", "start.js", "./", "--depth", "'-2'"];
    tree.init();
    expect(tree.depth).toEqual(2);
  });
});

describe("testing forming of directory structuring strings", () => {
  test("formatting for file in root", () => {
    const curDepth = 0;
    const isLast = false;
    const filename = "1.txt";
    const isDirectory = false;
    const treeStr = "";
    res = tree.directoryStructString(
      curDepth,
      isLast,
      filename,
      isDirectory,
      treeStr
    );
    expect(res.resString).toEqual(filename);
    expect(res.treeStrNext).toEqual("");
  });
  test("formatting for directory in root", () => {
    const curDepth = 0;
    const isLast = false;
    const filename = "someDirectory";
    const isDirectory = true;
    const treeStr = "";
    res = tree.directoryStructString(
      curDepth,
      isLast,
      filename,
      isDirectory,
      treeStr
    );
    expect(res.resString).toEqual(filename + "[D]");
    expect(res.treeStrNext).toEqual("");
  });
  test("formatting for file with curDepth 1", () => {
    const curDepth = 1;
    const isLast = false;
    const filename = "someFile.txt";
    const isDirectory = false;
    const treeStr = "";
    res = tree.directoryStructString(
      curDepth,
      isLast,
      filename,
      isDirectory,
      treeStr
    );
    expect(res.resString).toEqual("├── " + filename);
    expect(res.treeStrNext).toEqual("│ ");
  });
  test("formatting for last file with curDepth 1", () => {
    const curDepth = 1;
    const isLast = true;
    const filename = "someFile.txt";
    const isDirectory = false;
    const treeStr = "";
    res = tree.directoryStructString(
      curDepth,
      isLast,
      filename,
      isDirectory,
      treeStr
    );
    expect(res.resString).toEqual("└── " + filename);
    expect(res.treeStrNext).toEqual("  ");
  });
  test("formatting for file on level 2 and higher with treeStr!=''", () => {
    const curDepth = 1;
    const isLast = false;
    const filename = "someFile.txt";
    const isDirectory = false;
    const treeStr = "│ ";
    res = tree.directoryStructString(
      curDepth,
      isLast,
      filename,
      isDirectory,
      treeStr
    );
    expect(res.resString).toEqual(treeStr + "├── " + filename);
    expect(res.treeStrNext).toEqual(treeStr + "│ ");
  });
});

describe("work with fs and tree strings aggregation", () => {
  test("tree strings aggregation", () => {
    mock(memFs);
    dirPath = "./";
    depth = 0;
    maxDepth = 4;
    treeStr = "";
    res = tree.getDirStructure(dirPath, depth, maxDepth, treeStr);

    expectedResult = `testdir[D]
├── some.png
├── test_directory_level2[D]
│ ├── test_directory_level3[D]
│ │ └── test_file1_level_4.txt
│ ├── test_file1_level_3.txt
│ ├── test_file2_level_3.txt
│ └── test_file3_level_3.txt
├── test_file1_level2.txt
└── test_file1_level_2.txt`;
    mock.restore();
    expect(res).toEqual(expectedResult);
  });
  test("maxDepth nesting  parameter", () => {
    mock(memFs);
    dirPath = "./";
    depth = 0;
    treeStr = "";
    resDS3 = tree.getDirStructure(dirPath, depth, 3, treeStr);
    resDS2 = tree.getDirStructure(dirPath, depth, 2, treeStr);
    resDS1 = tree.getDirStructure(dirPath, depth, 1, treeStr);
    mock.restore();
    expect(resDS3.split("\n").length).toEqual(9);
    expect(resDS2.split("\n").length).toEqual(5);
    expect(resDS1.split("\n").length).toEqual(1);
  });
});
