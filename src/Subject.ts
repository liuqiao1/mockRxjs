import { Subscriber } from "./Subscriber";
import { Subscription } from "./Subscription";

export class Subject<T> {
  subscribers: Subscriber<T>[] = [];
  constructor() {}

  next(params: any) {
    this.subscribers.forEach((subscriber) => subscriber.next(params));
  }

  error(params?: any) {
    this.subscribers.forEach((subscriber) => subscriber.error(params));
  }

  complete() {
    this.subscribers.forEach((subscriber) => subscriber.complete());
  }

  subscribe(subscriber: Subscriber<T>) {
    if (this.subscribers.includes(subscriber)) {
      return;
    }

    this.subscribers.push(subscriber);
    return new Subscription();
  }
}
