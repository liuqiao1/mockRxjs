import { Subscriber } from "./Subscriber";
import { Subscription } from "./Subscription";

export class Observable<T> {
  private _subscribe: (subscriber: Subscriber<T>) => void | CallBack;

  private subscription: Subscription | undefined;

  constructor(subscribe: (subscriber: Subscriber<T>) => void | CallBack) {
    this._subscribe = subscribe;
  }

  subscribe(subscriber: Subscriber<T>): Subscription {
    if (
      typeof this._subscribe !== "function" ||
      this.subscription?.isUnsubscribed
    ) {
      return new Subscription();
    }

    const unSubscribeCallback = this._subscribe(subscriber);
    this.subscription = new Subscription(unSubscribeCallback);
    return this.subscription;
  }
}
