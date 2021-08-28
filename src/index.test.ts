import { Observable } from "./Observable";
import { delay } from "./operators/delay";
import { map } from "./operators/map";
import { Subject } from "./Subject";
import { Subscriber } from "./Subscriber";

describe("V1: Observable & Subscriber", () => {
  test("should watch lamp", (done) => {
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
          subscriber.next("yellow");
          expect(output).toEqual(["stop", "go", "done"]);
          done();
        }, 2000);
      }
    );

    streetLamp.subscribe(passerBy);
  });
});

fdescribe("V2:Subscription", () => {
  test("basic", (done) => {
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
        const clock = setTimeout(() => {
          subscriber.next("green");
          subscriber.complete();
          subscriber.next("yellow");
          expect(output).toEqual(["stop", "go", "done"]);
          done();
        }, 8000);

        return () => {
          output.push("Do not watch streetlamp anymore");
          clearTimeout(clock);
        };
      }
    );

    streetLamp.subscribe(passerBy).unsubscribe();
    expect(output).toEqual(["stop", "Do not watch streetlamp anymore"]);
    streetLamp.subscribe(passerBy);
    expect(output).toEqual(["stop", "Do not watch streetlamp anymore"]);
    done();
  });

  test("add", () => {
    let output: string[] = [];
    const me = new Subscriber((color) => {
      output.push(`I see ${color}`);
    });
    const myFriendJane = new Subscriber((color) => {
      output.push(`Jane see ${color}`);
    });
    const myFriendTom = new Subscriber((color) => {
      output.push(`Tom see ${color}`);
    });

    const streeyLamp = new Observable((subscriber) => {
      subscriber.next("red");

      return () => {
        // subscriber has no indetification?
        output.push(`unsubscribe`);
      };
    });

    streeyLamp
      .subscribe(me)
      .add(streeyLamp.subscribe(myFriendJane))
      .add(streeyLamp.subscribe(myFriendTom))
      .unsubscribe();

    expect(output).toEqual([
      "I see red",
      "Jane see red",
      "Tom see red",
      "unsubscribe",
      "unsubscribe",
      "unsubscribe",
    ]);

    streeyLamp.subscribe(myFriendJane);
    expect(output.filter((o) => o === "Jane see red").length).toEqual(1);
  });
});

describe("V3: Subject", () => {
  test("basic", (done) => {
    let output: string[] = [];
    const next = (lightColor?: string) => {
      if (lightColor === "green") {
        output.push("go");
      } else {
        output.push("stop");
      }
    };

    const me = new Subscriber(next);
    const you = new Subscriber(next);
    const she = new Subscriber(next);

    const streetLamp = new Subject<string>();

    streetLamp.subscribe(me);
    streetLamp.subscribe(you);
    streetLamp.subscribe(she);

    streetLamp.next("red");
    setTimeout(() => {
      streetLamp.next("green");
      expect(output).toEqual(["stop", "stop", "stop", "go", "go", "go"]);
      done();
    }, 3000);
  });
});

describe("V4: Operators", () => {
  test("basic", (done) => {
    const streetLamp = new Observable((subscriber: Subscriber<string>) => {
      console.info("send", new Date().toLocaleString());
      subscriber.next("red");
    });

    const cautiousMan = new Subscriber<string>((color: string | undefined) => {
      console.info("recieve", new Date().toLocaleString());

      expect(color).toEqual("green");
      done();
    });

    streetLamp
      .pipe(
        delay(2000),
        map((color: string) => {
          if (color === "red") return "green";
          if (color === "green") return "red";
          return color;
        })
      )
      .subscribe(cautiousMan);
  });
});

describe("V5: Subscriber extends Subscription", () => {
  let output: string[] = [];
  let passerBy: Subscriber<string>;
  let streetLamp: Observable<string>;
  beforeEach(() => {
    output = [];
    passerBy = new Subscriber<string>((v) => {
      if (v) output.push(v);
    });

    streetLamp = new Observable<string>((subscriber) => {
      subscriber.next("red");
    });
  });
  test("basic", () => {
    streetLamp.subscribe(passerBy);

    expect(output).toEqual(["red"]);
    passerBy.unsubscribe();
    streetLamp.subscribe(passerBy);
    expect(output).toEqual(["red"]);
  });
});
