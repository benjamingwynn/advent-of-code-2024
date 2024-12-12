import fsp from "node:fs/promises";

//
// day 2
//

function diff(a: number, b: number) {
  return Math.max(a, b) - Math.min(a, b);
}

function isSafeDistance(a: number, b: number) {
  const d = diff(a, b);
  return d >= 1 && d <= 3;
  // > safe if any two adjacent levels differ by at least one and at most three.
}

function isReportSafe(report: number[], allowRecursion = true): boolean {
  let direction: null | "bigger" | "smaller" = null;
  for (let i = 0; i < report.length - 1; i++) {
    const here = report[i];
    const next = report[i + 1];

    const again = () => {
      const withoutMe = [...report.slice(0, i), ...report.slice(i + 1)];
      return isReportSafe(withoutMe, false);
    };

    // > The levels are either all increasing or all decreasing.
    if (direction === null) {
      direction = next > here ? "bigger" : "smaller";
    } else if (direction === "bigger") {
      if (next < here) {
        if (allowRecursion) {
          return again();
        } else {
          return false;
        }
      }
    } else if (direction === "smaller") {
      if (here < next) {
        if (allowRecursion) {
          return again();
        } else {
          return false;
        }
      }
    }

    if (!isSafeDistance(here, next)) {
      if (allowRecursion) {
        return again();
      } else {
        return false;
      }
    }
  }
  return true;
}

/** pass in a row like '1 2 3', get numbers back like [1,2,3] */
function rowToNumbers(row: string): number[] {
  const strings: string[] = [];
  const chars = row.split("");
  let i = 0;
  for (const char of chars) {
    if (!char.trim()) {
      if (strings[i]) i++; // if got space and filled char, fill out next char
      continue;
    }
    if (!strings[i]) strings[i] = "";
    strings[i] += char;
  }
  // convert strings to numbers
  return strings.map((x) => +x);
}

// load stuff
const data = (await fsp.readFile("day2.txt")).toString();

const reports = data.split("\n").filter((x) => x.trim());
// console.log(reports);

const parsedReports = reports.map((row) => rowToNumbers(row));
// console.log(parsedReports);

const safeReports = parsedReports.filter((report) => isReportSafe(report));

console.log(safeReports.length);
// 627 is too high!
// 608 is too low!
// 604 is too low!

// for (const report of parsedReports) {
//   if (isReportSafe(report)) {
//     console.log(report, "is safe");
//   } else {
//     console.log(report, "is not safe");
//   }
// }
