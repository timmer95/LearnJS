import { GameState } from "../../core/Game";

export class GameStateChangedEvent {
  constructor(public readonly state : GameState) { }
}
