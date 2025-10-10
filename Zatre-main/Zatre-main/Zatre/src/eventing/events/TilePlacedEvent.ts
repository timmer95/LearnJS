import { Player } from "../../core/Player";
import { Point } from "../../core/Point";
import { Tile } from "../../core/Tile";

export class TilePlacedEvent {
  constructor (
    public readonly point: Point,
    public readonly tile: Tile,
    public readonly player: Player,
    public readonly positionInTray: number) {}
}

