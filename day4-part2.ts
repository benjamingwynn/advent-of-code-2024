import fsp from "node:fs/promises";

const input = (await fsp.readFile("day4.txt")).toString();
const grid = input
  .trim()
  .split("\n")
  .map((ln) => ln.split(""));

/** returns the letter at this position in the grid */
function atPosition(x: number, y: number) {
  const row = grid[y];
  if (row) return row[x] ?? null;
  return null;
}

/** a node that travels in any direction */
class Node {
  /** for debugging */
  private _char: string;

  constructor(
    /** current column position */
    public readonly x: number,
    /** current row position */
    public readonly y: number,
    // the chain of nodes so far
    public readonly chain: Node[] = []
  ) {
    const char = atPosition(x, y);
    if (!char) throw new Error("invalid x,y for Node");
    this._char = char;
  }

  public asString() {
    return `Node x: ${this.x}, y: ${this.y}, val=${atPosition(this.x, this.y)}`;
  }

  public isValidCross(): boolean {
    const topLeft = atPosition(this.x - 1, this.y - 1);
    const topRight = atPosition(this.x + 1, this.y - 1);
    const bottomLeft = atPosition(this.x - 1, this.y + 1);
    const bottomRight = atPosition(this.x + 1, this.y + 1);

    // M.S
    // .A.
    // M.S
    if (
      topLeft === "M" &&
      topRight === "S" &&
      bottomLeft === "M" &&
      bottomRight === "S"
    ) {
      return true;
    }

    // S.S
    // .A.
    // M.M
    if (
      topLeft === "S" &&
      topRight === "S" &&
      bottomLeft === "M" &&
      bottomRight === "M"
    ) {
      return true;
    }

    // S.M
    // .A.
    // S.M
    if (
      topLeft === "S" &&
      topRight === "M" &&
      bottomLeft === "S" &&
      bottomRight === "M"
    ) {
      return true;
    }

    // M.M
    // .A.
    // S.S
    if (
      topLeft === "M" &&
      topRight === "M" &&
      bottomLeft === "S" &&
      bottomRight === "S"
    ) {
      return true;
    }

    return false;
  }
}

const startOfWord = "A";
const out: Node[] = [];
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    if (atPosition(x, y) === startOfWord) {
      const node = new Node(x, y);
      if (node.isValidCross()) out.push(node);
    }
  }
}

console.log("** found **", out.length);
