import { Subscriber } from "./Subscriber";
import { Subscription } from "./Subscription";

export class Subject<T> {
  isCompleted: boolean = false;
  isUnsubscribed: boolean = false;
  subscribers: Subscriber<T>[] = [];
  constructor() {}

  protected _throwIfCompletedOrUnsubscribed() {
    if (this.isCompleted) {
      throw new Error("completed");
    }
    if (this.isUnsubscribed) {
      throw new Error("unsubscribed");
    }
  }

  next(params: any) {
    this._throwIfCompletedOrUnsubscribed();
    this.subscribers.forEach((subscriber) => subscriber.next(params));
  }

  error(params?: any) {
    this._throwIfCompletedOrUnsubscribed();
    this.subscribers.forEach((subscriber) => subscriber.error(params));
  }

  complete() {
    if (this.isCompleted) {
      return;
    }

    this.isCompleted = true;
    this.subscribers.forEach((subscriber) => subscriber.complete());
  }

  subscribe(subscriber: Subscriber<T>) {
    this._throwIfCompletedOrUnsubscribed();

    if (this.subscribers.includes(subscriber)) {
      return;
    }

    this.subscribers.push(subscriber);
  }

  unsubscribe() {
    this.isUnsubscribed = true;
  }
}
