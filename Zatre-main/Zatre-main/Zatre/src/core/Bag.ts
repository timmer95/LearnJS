import * as _ from "lodash";
import { SeededRandom } from "./SeededRandom";
import { Tile } from "./Tile";

export class Bag {
  private readonly _seededRandom: SeededRandom;
  private readonly _tiles: Array<Tile>;

  constructor(seededRandom: SeededRandom) {
    this._seededRandom = seededRandom;
    this._tiles = this.generateAvailableTiles();
  }

  public isEmpty(): boolean {
    return this._tiles.length === 0;
  }

  public count(): number {
    return this._tiles.length;
  }

  public takeTile(): Tile {
    if (this.isEmpty()) {
      throw new Error("Cannot take a tile from an empty bag.");
    }

    return this._tiles.pop()!;
  }

  private generateAvailableTiles(): Array<Tile> {
    const tiles = new Array<Tile>();

    // Add 20 tiles of each value.
    for (let i = 0; i < 20; i++) {
      tiles.push(Tile.ONE);
      tiles.push(Tile.TWO);
      tiles.push(Tile.THREE);
      tiles.push(Tile.FOUR);
      tiles.push(Tile.FIVE);
      tiles.push(Tile.SIX);
    }

    // Plus one additional tile of value 1.
    tiles.push(Tile.ONE);

    // And don't forget to randomize the list.
    return this._seededRandom.shuffle(tiles);
  }
}
