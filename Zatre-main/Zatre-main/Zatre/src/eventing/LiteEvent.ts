export class LiteEvent<TArgs> {
  private readonly _handlers = new Map<number, (args: TArgs) => void>();
  private _nextHandlerId = 0;

  public on(handler: (args: TArgs) => void): number {
    const handlerId = this._nextHandlerId++;
    this._handlers.set(handlerId, handler);
    return handlerId;
  }

  public off(handlerId: number): void {
    this._handlers.delete(handlerId);
  }

  public invoke(args: TArgs): void {
    this._handlers.forEach(x => x(args));
  }
}
