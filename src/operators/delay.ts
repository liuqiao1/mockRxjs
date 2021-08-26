import { Observable } from "../Observable";

export const delay = (seconds: number) => {
  return (observable: Observable<any>) => {
    return new Observable((subscriber) => {
      const clock = setTimeout(() => {
        observable.subscribe(subscriber);
      }, seconds);

      return () => {
        clearTimeout(clock);
      };
    });
  };
};
