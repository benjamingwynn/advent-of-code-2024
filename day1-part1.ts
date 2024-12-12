import fsp from "node:fs/promises";

/** returns the distance between numbers in two arrays of equal length */
function diff(a: number[], b: number[]) {
  if (a.length !== b.length)
    throw new Error("can't diff buckets of different lengths");
  const n = a.length;
  const rtn: number[] = [];
  for (let i = 0; i < n; i++) {
    const big = Math.max(a[i], b[i]);
    const small = Math.min(a[i], b[i]);
    rtn.push(big - small);
  }
  return rtn;
}

/** sum everything in the array */
function sum(array: number[]) {
  return array.reduce((prev, cur) => prev + cur, 0);
}

//
// day 1
//

// load stuff
const data = (await fsp.readFile("day1.txt")).toString();

// this is how i want the data to look
const buckets = [[] as number[], [] as number[]];

// parse `data` to `buckets`
for (const line of data.split("\n")) {
  // ignore empties
  if (!line) {
    continue;
  }

  // match only the numbers
  const matched = line.matchAll(/(\d+) +(\d+)/g);
  const m = [...matched][0];
  const chars = [m[1], m[2]];

  // loop through the chars, parsing as numbers and adding them to the same bucket
  for (let i = 0; i < chars.length; i++) {
    const bucket = buckets[i];
    if (!bucket) {
      console.log(">>", chars);
      throw new Error("Expected bucket for column " + i);
    }
    const char = chars[i];
    bucket.push(parseInt(char));
  }
}
// sort each bucket
const sorted = buckets.map((numbers) => numbers.sort());

const distances = diff(sorted[0], sorted[1]);
const total = sum(distances);
console.log(total);
