import { SquareType, Square, SquareWithTile } from "./Square";
import { Point } from "./Point";
import { Tile } from "./Tile";
import { Axis } from "./Axis";
import { Board } from "./Board";
import { Player } from "./Player";

export class PlacementCalculator {
  private readonly _board: Board;
  private readonly _emptyNeighbours = new Set<Square>();
  private readonly _placedThisTurn = new Set<Square>();

  private _turn = 0;

  constructor(board: Board) {
    this._board = board;

    const startSquare = this._board.getStartSquare();
    this._emptyNeighbours.add(startSquare);
  }

  public updateAfterPlayerTurn() {    
    if (this._turn !== 0) {
      for (const square of this._placedThisTurn) {
        this.addEmptyNeighbours(square);
      }
    }

    this._placedThisTurn.clear();
    this._turn++;
  }

  public updateAfterTilePlaced(squareWithTile: SquareWithTile, player: Player) : void {
    this._emptyNeighbours.delete(squareWithTile.square);
    this._placedThisTurn.add(squareWithTile.square);

    if (this._turn === 0) {
      this.addEmptyNeighbours(squareWithTile.square);
    }
  }

  private addEmptyNeighbours(square: Square) : void {
    // For each neighbouring point..
    for (const direction of [Point.LEFT, Point.UP, Point.RIGHT, Point.DOWN]) {
      const neighbourPoint = square.point.shift(direction);
      
      // That's within bounds..
      if (this._board.isWithinBounds(neighbourPoint)) {
        const neighbour = this._board.getSquareWithTile(neighbourPoint);

        // That's not a void tile..
        if (neighbour.square.type !== SquareType.Void) {

          // And does not contain a tile..
          if (neighbour.tile === null) {

            // Add it to the set of empty neighbours.
            this._emptyNeighbours.add(neighbour.square);
          }
        }
      }
    }
  }

  public calculatePossiblePlacements(tile: Tile): Array<Square> {
    const possiblePlacements = new Array<Square>();

    // For each empty neighbour..
    for (const square of this._emptyNeighbours) {

      // Calculate how the line would look after placing the specified tile..
      var horizontalLine = this._board.findLineAlongAxis(new SquareWithTile(square, tile), Axis.HORIZONTAL);
      var verticalLine = this._board.findLineAlongAxis(new SquareWithTile(square, tile), Axis.VERTICAL);

      // If the horizontal or vertical line would be 13 or higher, then the square isn't suitable.
      if (horizontalLine.value >= 13 || verticalLine.value >= 13)
        continue;

      // Otherwise, if the square is a standard or starter square, then it's automatically a valid square.
      if (square.type === SquareType.Standard || square.type === SquareType.Starter) {
        possiblePlacements.push(square);
        continue;
      }

      // Finally, if the square is a multiplier square and the line would score, then it's a valid square.
      if (square.type === SquareType.Multiplier && (horizontalLine.value >= 10 || verticalLine.value >= 10)) {
        possiblePlacements.push(square);
        continue;
      }
    }

    return possiblePlacements;
  }

  public canPlaceAtLeastOne(tiles: Array<Tile>) : boolean {
    // We sort the tiles ascending to reduce the number of loops.
    // (A tile with a lower value can be placed more easily)
    const sortedTiles = tiles.sort((a, b) => a.value - b.value);
    const placeableTile = sortedTiles.find(tile => this.calculatePossiblePlacements(tile).length > 0);
    return placeableTile !== undefined;
  }
  
  public isValidPlacement(point: Point, tile: Tile) : boolean {
    const possiblePlacements = this.calculatePossiblePlacements(tile);
    const match = possiblePlacements.find(x => x.point.equals(point));
    return match !== undefined;
  }
}