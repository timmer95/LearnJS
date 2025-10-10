import { Point } from "./Point";
import { Tile } from "./Tile";

/**
 * Represents the specific type of a square.
 */
export class SquareType {
  public static readonly Void = new SquareType("void");
  public static readonly Standard = new SquareType("standard");
  public static readonly Multiplier = new SquareType("multiplier");
  public static readonly Starter = new SquareType("starter");

  private constructor(public readonly name: string) { }

  public static FromNumber(number: number) : SquareType {
    switch(number) {
      case 0: return this.Void;
      case 1: return this.Standard;
      case 2: return this.Multiplier;
      case 3: return this.Starter;
      default:
        throw new Error(`A SquareType cannot be determined from number '${number}'`);
    }
  }
}

/**
 * Represents a single immutable square located somewhere on a board.
 */
export class Square {
  public readonly type: SquareType;
  public readonly point: Point;

  constructor(type: SquareType, point: Point) {
    this.type = type;
    this.point = point;
  }
}

/**
 * Represents a combination of a square with the tile placed on it.
 * This is an immutable representation of a moment in time.
 */
export class SquareWithTile {
  public readonly square: Square;
  public readonly tile: Tile | null;

  constructor(square: Square, tile: Tile | null) {
    this.square = square;
    this.tile = tile;
  }
}