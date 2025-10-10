import { Square, SquareType, } from "./Square";
import { Line } from "./Line";
import { Tile } from "./Tile";

export class Scoreboard {
  private readonly _multipliers = new ScoreColumn();
  private readonly _tens = new ScoreColumn();
  private readonly _elevens = new ScoreColumn();
  private readonly _twelves = new ScoreColumn();

  public addScore(square: Square, line: Line) : Array<number> {
    const changedScores = new Array<number>();

    if (square.type === SquareType.Multiplier) {
      this._multipliers.increment();
      changedScores[0] = this._multipliers.index;
    }

    const value = line.value;
    if (value === 10) {
      this._tens.increment();
      changedScores[1] = this._tens.index;
    } else if (value === 11) {
      this._elevens.increment();
      changedScores[2] = this._elevens.index;
    } else if (value === 12) {
      this._twelves.increment();
      changedScores[3] = this._twelves.index;
    }

    return changedScores;
  }

  public getTurn(turn: number) : Array<number> {
    return [
      this._multipliers.get(turn),
      this._tens.get(turn),
      this._elevens.get(turn),
      this._twelves.get(turn),
    ];
  }

  public finishTurn() : void {
    this._multipliers.finishTurn();
    this._tens.finishTurn();
    this._elevens.finishTurn();
    this._twelves.finishTurn();
  }

  private getBonus(turn: number) {
    return Math.ceil(turn / 4) + 2;
  }

  public calculateFinalScore(leftoverTiles : ReadonlyArray<Tile>) : number {
    let finalScore = 0;
    
    const maxTurn = Math.max(this._tens.index, this._elevens.index, this._twelves.index, this._multipliers.index);

    for (let turn = 0; turn <= maxTurn; turn++) {
      const tens = this._tens.get(turn);
      const elevens = this._elevens.get(turn) * 2;
      const twelves = this._twelves.get(turn) * 4;

      let bonus = 0;
      if (tens > 0 && elevens > 0 && twelves > 0) {
        bonus = this.getBonus(turn);
      }
    
      let score = tens + elevens + twelves + bonus;
      const multipliers = this._multipliers.get(turn);
      for (let m = 0; m < multipliers; m++) {
        score *= 2;
      }
    
      finalScore += score;
    }

    for (const tile of leftoverTiles) {
      finalScore -= tile.value;
    }

    return finalScore;
  }
}

class ScoreColumn {
  public index = 0;
  public readonly scores = [0]

  public finishTurn() {
    if (this.scores[this.index] !== 0) {
      this.index += 1;
      this.scores[this.index] = 0;
    }
  }

  public get(turn: number) : number {
    return this.scores[turn] ?? 0;
  }

  public increment() {
    this.scores[this.index] += 1;
  }
}