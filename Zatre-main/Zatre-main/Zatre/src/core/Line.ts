import { SquareWithTile } from "./Square";

/*
* Represents a line of consecutive squares known to contain tiles.
* This is an immutable representation of a moment in time.
*/
export class Line {
  public readonly squares: ReadonlyArray<SquareWithTile>;
  public readonly value: number;

  constructor(squares : ReadonlyArray<SquareWithTile>) {
    this.squares = squares;
    this.value = this.squares.reduce((x, y) => x + y.tile!.value, 0);
  }

  public getStart() : SquareWithTile {
    return this.squares[0];
  }
  public getEnd() : SquareWithTile {
    return this.squares[this.squares.length - 1];
  }

}