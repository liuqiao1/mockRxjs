export class Subscriber<T> {
  private next: (v?: T) => void;
  private error: (err?: any) => void = () => {};
  private complete: () => void = () => {};

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
