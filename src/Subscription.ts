import { TeardownLogic, Unsubscribable } from "./types";
import { isFunction } from "./utils";

export class Subscription {
  _unSubscribeCallback: TeardownLogic;
  isUnsubscribed = false;
  private _teardowns: Exclude<TeardownLogic, void>[] | null = null;
  private _parentage: Subscription[] | Subscription | null = null;

  constructor(unSubscribeCallback: TeardownLogic) {
    if (unSubscribeCallback) this._unSubscribeCallback = unSubscribeCallback;
  }

  unsubscribe() {
    if (this.isUnsubscribed) {
      return;
    }
    if (isFunction(this._unSubscribeCallback)) {
      this._unSubscribeCallback();
    }
    this.isUnsubscribed = true;

    if (Array.isArray(this._teardowns)) {
      this._teardowns.forEach((teardown) => {
        execTeardown(teardown);
      });
    }
  }

  add(teardown: TeardownLogic) {
    if (!teardown || teardown === this) return this;

    if (isSubscription(teardown)) {
      teardown._addParent(this);
    }
    (this._teardowns = this._teardowns ?? []).push(teardown);
    return this;
  }

  remove(subscription: Subscription) {}

  private _addParent(parent: Subscription) {
    const { _parentage } = this;
    this._parentage = Array.isArray(_parentage)
      ? (_parentage.push(parent), _parentage)
      : _parentage
      ? [_parentage, parent]
      : parent;
  }
}

export function isSubscription(value: any): value is Subscription {
  return (
    value instanceof Subscription ||
    (value &&
      "isUnsubscribed" in value &&
      isFunction(value.remove) &&
      isFunction(value.add) &&
      isFunction(value.unsubscribe))
  );
}

function execTeardown(teardown: Unsubscribable | (() => void)) {
  if (isFunction(teardown)) {
    teardown();
  } else {
    teardown.unsubscribe();
  }
}
