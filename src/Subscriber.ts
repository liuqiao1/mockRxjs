import { Subscription } from "./Subscription";

export class Subscriber<T> extends Subscription {
  _next: (v?: T) => void;
  error: (err?: any) => void = () => {};
  _complete: () => void = () => {};

  isComplete = false;

  constructor(
    next: (v?: T) => void,
    error?: (err?: any) => void,
    complete?: () => void
  ) {
    super();
    this._next = next;
    if (error) this.error = error;
    if (complete) this._complete = complete;
  }

  unsubscribe() {
    if (this.isComplete) return;
    try {
      super.unsubscribe();
    } catch (e) {
      console.error(e);
    }
  }

  next(params: any) {
    if (this.isComplete) return;
    this._next(params);
  }

  complete() {
    if (this.isComplete) return;
    {
      this._complete();
      this.isComplete = true;
    }
  }
}
