import { Observable } from "./Observable";
import { Subscriber } from "./Subscriber";

test("v1", (done) => {
  let output: string[] = [];

  const next = (lightColor?: string) => {
    if (lightColor === "green") {
      console.log("go");
      output.push("go");
    } else {
      console.log("stop");
      output.push("stop");
    }
  };
  const error = (err?: any) => {
    console.error("wait");
    output.push("wait");
  };
  const complete = () => {
    console.log("done");
    output.push("done");
  };
  const passerBy = new Subscriber<string>(next, error, complete);

  const streetLamp = new Observable<string>(
    (subscriber: Subscriber<string>) => {
      subscriber.next("red");
      setTimeout(() => {
        subscriber.next("green");
        subscriber.complete();
        expect(output).toEqual(["stop", "go", "done"]);
        done();
      }, 2000);
    }
  );

  streetLamp.subscribe(passerBy);
});
