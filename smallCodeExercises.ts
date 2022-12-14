import { readdirSync } from "fs";
import { isAbsolute, join } from "path";
import { readdir } from "fs/promises";

/** Checks if the value is number or not
 * @param  {any} val?
 * @returns {boolean}
 */
function isNumber(val?: any): boolean {
  return !isNaN(Number(val));
}

/** Transforms array to containing number and strings
 * @param  {string[]=[]} arr
 * @returns {(string|number)[]}
 */
export function transformArrayToNumbersAndStrings(arr: string[] = []): (string | number)[] {
  return arr.map(element => (!isNumber(element) ? element : Number(element)));
}

/** Checks if the fileName ends with .csv
 * @param  {string} fileName
 * @returns {boolean}
 */
function isCSV(fileName: string): boolean {
  //   return fileName.toLowerCase().endsWith(".csv"); // uncomment this line to use non regex solution
  return new RegExp(/.+\.csv$/i).test(fileName);
}

/** Gets array of all .csv files in folder synchronously
 * @param  {string} dir
 * @returns {string[] | undefined}
 */
export function listCSVFilesSync(dir: string): string[] | undefined {
  try {
    if (!isAbsolute(dir)) dir = join(__dirname, dir); // add current directory if it is not an absolute path
    const files = readdirSync(dir);
    return files.filter(isCSV);
  } catch (err) {
    console.log("Unable to scan directory: " + dir);
    // throw new Error("Unable to scan directory"); // uncomment this to throw error
  }
}

/** Gets array of all .csv files in folder synchronously
 * @param  {string} dir
 * @returns {string[] | undefined}
 */
export async function listCSVFiles(dir: string): Promise<string[] | undefined> {
  try {
    if (!isAbsolute(dir)) dir = join(__dirname, dir); // add current directory if it is not an absolute path
    const files = await readdir(dir);
    return files.filter(isCSV);
  } catch (err) {
    console.log("Unable to scan directory: " + dir);
    // throw new Error("Unable to scan directory"); // uncomment this to throw error
  }
}

/** Checks if the text contains digit
 * @param  {string=""} txt
 * @returns {boolean}
 */
export function containsDigit(txt: string = ""): boolean {
  let len = txt.length;
  while (len--) {
    if (isNumber(txt[len])) return true;
  }
  return false;
}
