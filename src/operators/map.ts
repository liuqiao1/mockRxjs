import { Observable } from "../Observable";
import { Subscriber } from "../Subscriber";

type Iterator = (v: any) => any;

export const map = (iterator: Iterator) => {
  return (observable: Observable<any>) => {
    return new Observable((subscriber) => {
      const next = (value: any) => {
        subscriber.next(iterator(value));
      };
      const error = subscriber.error;
      const complete = subscriber.complete;
      observable.subscribe(new Subscriber(next, error, complete));
    });
  };
};
