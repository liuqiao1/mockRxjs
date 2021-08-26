import { Subscriber } from "./Subscriber";
import { Subscription } from "./Subscription";

type operate = (observable: Observable<any>) => Observable<any>;
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

  /**
   * pipe(
   *   delay(1000),
   *   map(x => x*2)
   * ).subscribe(v => {})
   */
  pipe(...operates: operate[]): Observable<T> {
    if (operates.length === 0) return this;

    return this.compose(...operates)(this);
  }

  compose(...operates: operate[]): operate {
    return function (observable: Observable<any>) {
      return operates.reduce(function (init, current) {
        return current(init);
      }, observable);
    };
  }
}
