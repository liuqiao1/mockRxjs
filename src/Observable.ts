import { Subscriber } from "./Subscriber";

export class Observable<T> {
  private _subscribe;
  constructor(subscribe: (subscriber: Subscriber<T>) => void) {
    this._subscribe = subscribe;
  }

  subscribe(subscriber: Subscriber<T>) {
    this._subscribe(subscriber);
  }
}
