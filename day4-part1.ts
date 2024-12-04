import fsp from "node:fs/promises";

/** the 8 possible cardinal directions you can travel across a grid */
type Direction =
  | "up"
  | "down"
  | "left"
  | "right"
  | "up-left"
  | "up-right"
  | "down-left"
  | "down-right";

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

function directionToDelta(direction: Direction): { dx: number; dy: number } {
  switch (direction) {
    case "up":
      return { dx: 0, dy: -1 };
    case "down":
      return { dx: 0, dy: +1 };
    case "left":
      return { dx: -1, dy: 0 };
    case "right":
      return { dx: +1, dy: 0 };
    case "up-left":
      return { dx: -1, dy: -1 };
    case "up-right":
      return { dx: +1, dy: -1 };
    case "down-left":
      return { dx: -1, dy: +1 };
    case "down-right":
      return { dx: +1, dy: +1 };
    default:
      throw new Error("wtf");
  }
}

/** a node that travels in any direction */
class Node {
  /** for debugging */
  private _char: string;

  constructor(
    /** the rest of the word to find, e.g. ['m','a','s'] */
    protected readonly remaining: string[],
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

  public isDone() {
    return this.remaining.length === 0;
  }

  public next(): DirectionalNode[] {
    if (!this.remaining.length) throw new Error("oops");

    return [
      ...this.nextInDirection("up"),
      ...this.nextInDirection("down"),
      ...this.nextInDirection("left"),
      ...this.nextInDirection("right"),
      ...this.nextInDirection("up-left"),
      ...this.nextInDirection("up-right"),
      ...this.nextInDirection("down-left"),
      ...this.nextInDirection("down-right"),
    ];
  }

  /** what is the next character we should be looking for? */
  protected getNextChar() {
    return this.remaining[0];
  }
  protected createDirectionalNode(direction: Direction) {
    const { dx, dy } = directionToDelta(direction);
    return new DirectionalNode(
      this.remaining.slice(1),
      this.x + dx,
      this.y + dy,
      direction,
      [...this.chain, this]
    );
  }

  /** returns a [DirectionalNode] for the character matching in this direction,or an empty array if there is no character matching in this direction */
  protected nextInDirection(direction: Direction) {
    if (this.isDone()) {
      throw new Error("cannot next() a done node");
    }

    const { dx, dy } = directionToDelta(direction);
    const next = atPosition(this.x + dx, this.y + dy);
    // console.log("check direction", direction);
    const isNext = next === this.getNextChar();
    // console.log("next:", next, this.getNextChar(), isNext);
    return isNext ? [this.createDirectionalNode(direction)] : [];
  }

  public asString() {
    return `Node x: ${this.x}, y: ${this.y}, val=${atPosition(this.x, this.y)}`;
  }
}

/** a node travelling in a direction */
class DirectionalNode extends Node {
  /** @inheritdoc */
  constructor(
    remaining: string[],
    x: number,
    y: number,
    private direction: Direction,
    chain: Node[]
  ) {
    super(remaining, x, y, chain);
  }

  /** @inheritdoc */
  public next() {
    return this.nextInDirection(this.direction);
  }
}

// config
const FIND_WORD = "XMAS";

// traverse
const restOfWord = FIND_WORD.substring(1).split(""); // split XMAS to ['M','A','S']
const startOfWord = FIND_WORD.substring(0, 1);
const found: Node[] = [];
function traverseNode(node: Node) {
  if (node.isDone()) {
    found.push(node);
    return;
  }

  const nextNodes = node.next();

  nextNodes.forEach((nextNode, index) => {
    traverseNode(nextNode);
  });
}

for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    if (atPosition(x, y) === startOfWord) {
      traverseNode(new Node(restOfWord, x, y));
    }
  }
}

console.log("** found **", found.length);
