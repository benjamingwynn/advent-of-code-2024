import fsp from "node:fs/promises";

/** returns the largest number in the array that's less than the number specified */
function findLargestLessThan(arr: number[], target: number): number | null {
  const validNumbers = arr.filter((num) => num < target);
  if (validNumbers.length === 0) return null;
  return Math.max(...validNumbers);
}

/** returns whether array B closer to the number than A? */
function closestArray(number: number, a: number[], b: number[]): boolean {
  const largestA = findLargestLessThan(a, number);
  const largestB = findLargestLessThan(b, number);

  if (largestA === null && largestB === null) throw new Error("impossible");
  if (largestA === null) return true;
  if (largestB === null) return false;

  return number - largestB < number - largestA;
}

const regex = /mul\([\d,]+\)/g; // select operations
const data = (await fsp.readFile("day3.txt")).toString();
const dos = [...data.matchAll(/do\(\)/g)].map((d) => d.index);
const donts = [...data.matchAll(/don't\(\)/g)].map((d) => d.index);
const matched = data.matchAll(regex);

/** returns whether to run the operation or not depending on its index */
const doOrDont = (index: number): boolean => {
  const firstDo = dos[0];
  if (index < firstDo) return true;

  return closestArray(index, donts, dos);
};

// only do the operations that have do() in front of them, not don't()
const operations = [...matched].map((m) => (doOrDont(m.index) ? m[0] : null));

// the operations we can process go here
const mul = (a: string, b: string) => +a * +b;

// process the operations into their results
const processed = operations.map((str) => {
  if (str === null) {
    return 0;
  }
  const [matched] = str.matchAll(/(\d+),(\d+)/g); // only parses two args
  const [, a, b] = matched;
  if (a === undefined) throw new Error("parse error");
  if (b === undefined) throw new Error("parse error");
  return mul(a, b);
});

// spec says to add up all processed items to make the result
const result = processed.reduce((prev, number) => prev + number, 0);
console.log(result);
