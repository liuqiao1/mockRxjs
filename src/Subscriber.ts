export class Subscriber<T> {
  next: (v?: T) => void;
  error: (err?: any) => void = () => {};
  complete: () => void = () => {};

  constructor(
    next: (v?: T) => void,
    error?: (err?: any) => void,
    complete?: () => void
  ) {
    this.next = next;
    if (error) this.error = error;
    if (complete) this.complete = complete;
  }
}
