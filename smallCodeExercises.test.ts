import assert from "assert";
import { join } from "path";
import { containsDigit, listCSVFiles, listCSVFilesSync, transformArrayToNumbersAndStrings } from "./smallCodeExercises";

async function test() {
  try {
    assert.deepEqual(transformArrayToNumbersAndStrings(["super", "20.5", "test", "23"]), ["super", 20.5, "test", 23]);
    assert.deepEqual(transformArrayToNumbersAndStrings(["super", "20.51", "super", "56"]), ["super", 20.51, "super", 56]);

    assert.deepEqual(listCSVFilesSync("files"), ["export.csv", "import.csv"]);
    assert.deepEqual(listCSVFilesSync(join(__dirname, "files")), ["export.csv", "import.csv"]);
    assert.deepEqual(listCSVFilesSync("notExisting"), undefined);

    assert.deepEqual(await listCSVFiles("files"), ["export.csv", "import.csv"]);
    assert.deepEqual(await listCSVFiles(join(__dirname, "files")), ["export.csv", "import.csv"]);
    assert.deepEqual(await listCSVFiles("notExisting"), undefined);

    assert.deepEqual(containsDigit("test-string"), false);
    assert.deepEqual(containsDigit("test-string1"), true);
    assert.deepEqual(containsDigit("2test-string"), true);
    assert.deepEqual(containsDigit("test-3string"), true);
  } catch (e) {
    console.log(e);
  }

  console.log("done!!");
}

test();
