export class Subscription {
  _unSubscribeCallback: CallBack = () => {};
  isUnsubscribed = false;
  children: Subscription[] = [];

  constructor(unSubscribeCallback: CallBack | void) {
    if (unSubscribeCallback) this._unSubscribeCallback = unSubscribeCallback;
  }

  unsubscribe() {
    if (this.isUnsubscribed) {
      return;
    }
    this._unSubscribeCallback();
    this.isUnsubscribed = true;

    this.children.forEach((element) => {
      element.unsubscribe();
    });
  }

  add(subscription: Subscription) {
    if (this.children.includes(subscription)) {
      return this;
    }

    this.children.push(subscription);
    return this;
  }

  remove(subscription: Subscription) {}
}
