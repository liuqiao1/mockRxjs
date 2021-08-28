import { Subscription } from ".";

export type CallBack = (params?: any) => void;

export interface Unsubscribable {
  unsubscribe(): void;
}

export type TeardownLogic = Subscription | Unsubscribable | (() => void) | void;
