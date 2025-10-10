export class Point {
  public static readonly UP = new Point(0, -1);
  public static readonly DOWN = new Point(0, +1);
  public static readonly LEFT = new Point(-1, 0);
  public static readonly RIGHT = new Point(+1, 0);

  public readonly x: number;
  public readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public shift(direction: Point) : Point {
    return new Point(this.x + direction.x, this.y + direction.y);
  }

  public equals(other: Point) : boolean {
    return other.x === this.x && other.y === this.y;
  }
}