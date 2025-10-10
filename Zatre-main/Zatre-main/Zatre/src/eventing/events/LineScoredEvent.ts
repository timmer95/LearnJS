import { Player } from "../../core/Player";

export class LineScoredEvent {
  constructor(
    public readonly player: Player,
    public readonly changedScores: Array<number>
  ) {}
}
