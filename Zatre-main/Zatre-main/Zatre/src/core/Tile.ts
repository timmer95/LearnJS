export class Tile {
  public readonly value: number;

  private constructor(value: number) {
    this.value = value;
  }

  public static readonly ONE = new Tile(1);
  public static readonly TWO = new Tile(2);
  public static readonly THREE = new Tile(3);
  public static readonly FOUR = new Tile(4);
  public static readonly FIVE = new Tile(5);
  public static readonly SIX = new Tile(6);
}