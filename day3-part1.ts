import fsp from "node:fs/promises";

const regex = /mul\([\d,]+\)/g;
const data = (await fsp.readFile("day3.txt")).toString();
const matched = data.matchAll(regex);
const muls = [...matched].map((m) => m[0]);
const mul = (a: number, b: number) => a * b;

const mulResults = muls.map((str) => {
  const [[_, a, b]] = str.matchAll(/(\d+),(\d+)/g);
  if (a === undefined) throw new Error("parse error");
  if (b === undefined) throw new Error("parse error");
  return mul(+a, +b);
});

const added = mulResults.reduce((prev, cur) => prev + cur, 0);
console.log(added);
