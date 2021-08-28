import { Subscriber } from "./Subscriber";
import { Subscription } from "./Subscription";
import { TeardownLogic } from "./types";

type operate = (observable: Observable<any>) => Observable<any>;
export class Observable<T> {
  private _subscribe: (subscriber: Subscriber<T>) => TeardownLogic;

  private _subscriber: Subscriber<T> | undefined;

  constructor(subscribe: (subscriber: Subscriber<T>) => TeardownLogic) {
    this._subscribe = subscribe;
  }

  subscribe(subscriber: Subscriber<T>): Subscription {
    if (this._subscriber?.isUnsubscribed) {
      return subscriber;
    }

    this._subscriber = subscriber;
    subscriber.add(this._subscribe(subscriber));
    return subscriber;
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
