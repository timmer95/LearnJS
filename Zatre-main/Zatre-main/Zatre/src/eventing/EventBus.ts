import { EventSubscription } from "./EventSubscription";

export class EventBus {
  private readonly _handlers = new Map<string, Map<number, (args: any) => void>>();
  private _nextSubscriptionId = 0;

  public subscribe<TEvent>(eventType: string, handler: (eventArgs: TEvent) => void): EventSubscription {
    const subscription = new EventSubscription(eventType, this._nextSubscriptionId++, this);

    if (!this._handlers.has(eventType))
      this._handlers.set(eventType, new Map<number, (args: TEvent) => void>());

    const typedHandlers = this._handlers.get(eventType) as Map<number, (args: TEvent) => void>;
    typedHandlers.set(subscription.id, handler);

    return subscription;
  }

  public unsubscribe(eventType: string, subscriptionId: number) {
    this._handlers.get(eventType)!.delete(subscriptionId);
  }

  public publish<TEvent>(eventType: string, event: TEvent) {
    console.log(event);
    if (this._handlers.has(eventType)) {
      const handlers = this._handlers.get(eventType);
      handlers!.forEach(x => {
        x(event);
      });
    }
  }
}