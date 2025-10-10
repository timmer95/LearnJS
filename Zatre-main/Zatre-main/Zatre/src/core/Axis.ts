import { Point } from "./Point";

export class Axis {
  public static readonly HORIZONTAL = new Axis(Point.LEFT, Point.RIGHT);
  public static readonly VERTICAL = new Axis(Point.UP, Point.DOWN);

  private constructor(
    public readonly startDirection: Point,
    public readonly endDirection: Point
  ) { }
}
