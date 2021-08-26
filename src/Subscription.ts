export class Subscription {
  _unSubscribeCallback: CallBack = () => {};
  isUnsubscribed = false;

  constructor(unSubscribeCallback: CallBack | void) {
    if (unSubscribeCallback) this._unSubscribeCallback = unSubscribeCallback;
  }

  unsubscribe() {
    if (this.isUnsubscribed) {
      return;
    }
    this._unSubscribeCallback();
    this.isUnsubscribed = true;
  }
}
