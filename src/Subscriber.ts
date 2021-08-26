export class Subscriber<T> {
  _next: (v?: T) => void;
  error: (err?: any) => void = () => {};
  _complete: () => void = () => {};

  isComplete = false;

  constructor(
    next: (v?: T) => void,
    error?: (err?: any) => void,
    complete?: () => void
  ) {
    this._next = next;
    if (error) this.error = error;
    if (complete) this._complete = complete;
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
