import { Player } from "../../core/Player";
import { Tile } from "../../core/Tile";

export class TileDrawnEvent {
  constructor (
    public readonly tile : Tile,
    public readonly player : Player,
    public readonly positionInTray : number) {}
}