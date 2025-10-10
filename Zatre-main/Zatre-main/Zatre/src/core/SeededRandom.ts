import * as seedrandom from "seedrandom";

export class SeededRandom {
  private readonly _seed: string;
  private readonly _rng: seedrandom.PRNG;

  constructor(seed: string) {
    this._seed = seed;
    this._rng = seedrandom.default(this._seed);
  }

  public next(inclusiveMin: number, inclusiveMax: number): number {
    return Math.floor(this._rng() * (inclusiveMax - inclusiveMin + 1) + inclusiveMin);
  }  

  public shuffle<T>(array: Array<T>) : Array<T> {
    const shuffledArray = new Array<T>();

    const indexes = array.map((_, index) => index);
    while(indexes.length > 0) {
      const random = this.next(0, indexes.length - 1);
      const index = indexes.splice(random, 1)[0];
      shuffledArray.push(array[index]);
    }

    return shuffledArray;
  }
}