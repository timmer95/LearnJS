import { EventBus } from "./EventBus";

export class EventSubscription {
  constructor(
    public readonly eventType: string,
    public readonly id: number,
    public readonly eventBus: EventBus) { }

  public unsubscribe(): void {
    this.eventBus.unsubscribe(this.eventType, this.id);
  }
}

export class EventSubscriptionGroup {
  private readonly _subscriptions = new Array<EventSubscription>();

  public add(subscription: EventSubscription) : void {
    this._subscriptions.push(subscription);
  }

  public unsubscribe() : void {
    for (const subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }
}