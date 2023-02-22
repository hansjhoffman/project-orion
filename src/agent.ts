import { constVoid } from "fp-ts/function";
import { match, P } from "ts-pattern";

import { EventDomain, EventTopic } from "./codecs";

interface FlatfileEvent {
  domain: EventDomain;
  topic: EventTopic;
  context: unknown;
}

export const routeEvent = async (event: FlatfileEvent) => {
  match(event.domain)
    .with("workbook", () => {
      match(event.topic)
        .with(P.union("records:created", "records.updated"), () => {
          console.log("event:", JSON.stringify(event, null, 2));
        })
        // .when(
        //   (topic) => topic === "records:created" || topic === "records:updated",
        //   () => {
        //     console.log(event);
        //   },
        // )
        .run();
    })
    .with("space", constVoid)
    .with("job", constVoid)
    .with("file", constVoid)
    .exhaustive();
};
