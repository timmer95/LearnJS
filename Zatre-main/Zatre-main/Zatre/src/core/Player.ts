import { Scoreboard } from "./Scoreboard";
import { Tile } from "./Tile";

export class Player {
  private readonly _tiles : Array<Tile | null> = [ null, null, null, null, null ];
  public readonly scoreboard = new Scoreboard();
  
  constructor(
    public readonly id : number, 
    public readonly name : string,
    public readonly color : string) { }

    public addTile(tile : Tile) : number {
      for (let i = 0; i < this._tiles.length; i++) {
        if (!this._tiles[i]) {
          this._tiles[i] = tile;
          return i;
        }
      }

      throw new Error("Can't add anymore tiles to the player.");
    }

    public removeTile(positionInTray: number) : Tile {
      const tile = this._tiles[positionInTray]!;
      this._tiles[positionInTray] = null;
      return tile;
    }

    public getTile(positionInTray: number) : Tile {
      return this._tiles[positionInTray]!;
    }

    public getTiles() : Array<TileInTray> {
      const tilesInTray = new Array<TileInTray>();

      for (let i = 0; i < this._tiles.length; i++) {
        const tile = this._tiles[i];
        if (tile) {
          tilesInTray.push(new TileInTray(i, tile));
        }
      }

      return tilesInTray;
    }
}

export class TileInTray {
  constructor(
    public readonly positionInTray: number,
    public readonly tile: Tile
  ) {}
}