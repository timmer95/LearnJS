import _ from "lodash";
import { SquareType, Square, SquareWithTile } from "./Square";
import { Line } from "./Line";
import { Point } from "./Point";
import { Tile } from "./Tile";
import { Axis } from "./Axis";
import { EventBus } from "../eventing/EventBus";
import { EventSubscription } from "../eventing/EventSubscription";
import { TilePlacedEvent } from "../eventing/events/TilePlacedEvent";

export class Board {
  private readonly _squares: ReadonlyArray<ReadonlyArray<Square>>;
  private readonly _tiles: Array<Array<Tile | null>>;
  public readonly width: number;
  public readonly height: number;

  constructor() {
    this._squares = this.generateSquares();
    this._tiles = this.generateTiles();
    
    this.width = this._squares[0].length;
    this.height = this._squares.length;
  }

  private generateSquares(): ReadonlyArray<ReadonlyArray<Square>> {
    // Use a 2D Array as easy and visual template to generate the board.
    const template: number[][] = [
      [0, 0, 0, 0, 1, 1, 2, 0, 2, 1, 1, 0, 0, 0, 0],
      [0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0],
      [0, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 0],
      [0, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 0],
      [1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
      [2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2],
      [0, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 0],
      [2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2],
      [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1],
      [0, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 0],
      [0, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 0],
      [0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0],
      [0, 0, 0, 0, 1, 1, 2, 0, 2, 1, 1, 0, 0, 0, 0],
    ];

    // Then, we can loop through the template 
    // to generate the actual typed representation.
    const board = new Array<Array<Square>>();
    for (let y = 0; y < template.length; y++) {
      const templateRow = template[y];
      const row = new Array<Square>();

      for (let x = 0; x < templateRow.length; x++) {
        const squareType = SquareType.FromNumber(templateRow[x]);
        const point = new Point(x, y);
        row.push(new Square(squareType, point));
      }

      board.push(row);
    }

    return board;
  }

  private generateTiles() : Array<Array<Tile | null>> {
    const tiles = new Array<Array<Tile | null>>();

    // Generate a grid matching the bounds of the squares to contain the tiles.
    for (const squareRow of this._squares) {
      const tileRow = new Array<Tile | null>();
      for (const _ of squareRow) {
        tileRow.push(null);
      }
      tiles.push(tileRow);
    }

    return tiles;
  }

  public getStartSquare() : Square {
    return this.getSquare(new Point(7, 7));
  }

  public getSquareWithTile(point: Point): SquareWithTile {
    const square = this.getSquare(point);
    const tile = this.getTile(point);
    return new SquareWithTile(square, tile);
  }

  private getSquare(point: Point) : Square {
    return this._squares[point.y][point.x]
  }

  private getTile(point: Point) : Tile | null {
    return this._tiles[point.y][point.x]
  }

  public isWithinBounds(point: Point): boolean {
    return point.x >= 0 
      && point.x < this.width
      && point.y >= 0
      && point.y < this.height;
  }

  public findLineAlongAxis(squareWithTile: SquareWithTile, axis: Axis) : Line {

    const startPoint = squareWithTile.square.point.shift(axis.startDirection);
    const startLine = this.findLineInDirection(startPoint, axis.startDirection);
    
    const endPoint = squareWithTile.square.point.shift(axis.endDirection);
    const endLine = this.findLineInDirection(endPoint, axis.endDirection);
    
    return new Line([..._.reverse(startLine.squares), squareWithTile, ...endLine.squares]);
  }

  private findLineInDirection(origin: Point, direction: Point) : Line {
    const squaresWithTiles = new Array<SquareWithTile>();

    let squareWithTile = this.getSquareWithTile(origin);
    while (squareWithTile.tile !== null)
    {
      squaresWithTiles.push(squareWithTile);
      const nextPoint = squareWithTile.square.point.shift(direction);
      squareWithTile = this.getSquareWithTile(nextPoint);
    }

    return new Line(squaresWithTiles);
  }

  /* Important! This will not assert any preconditions. */
  public placeTile(point: Point, tile: Tile) : void {
    this._tiles[point.y][point.x] = tile;
  }
}

