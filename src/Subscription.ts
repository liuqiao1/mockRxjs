import { TeardownLogic, Unsubscribable } from "./types";
import { arrRemove, isFunction } from "./utils";

export class Subscription {
  isUnsubscribed = false;
  private _teardowns: Exclude<TeardownLogic, void>[] | null = null;
  private _parentage: Subscription[] | Subscription | null = null;

  constructor() {}

  unsubscribe() {
    if (this.isUnsubscribed) {
      return;
    }
    this.isUnsubscribed = true;

    if (Array.isArray(this._parentage)) {
      for (const parent of this._parentage) {
        parent.remove(this);
      }
    } else if (isSubscription(this._parentage)) {
      this._parentage.remove(this);
    }

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

  remove(teardown: Exclude<TeardownLogic, void>): void {
    const { _teardowns } = this;
    _teardowns && arrRemove(_teardowns, teardown);

    if (teardown instanceof Subscription) {
      teardown._removeParent(this);
    }
  }

  private _removeParent(parent: Subscription) {
    const { _parentage } = this;
    if (_parentage === parent) {
      this._parentage = null;
    } else if (Array.isArray(_parentage)) {
      arrRemove(_parentage, parent);
    }
  }

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
