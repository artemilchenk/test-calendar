import type { DateSelectArg, EventClickArg } from "@fullcalendar/core";

export function isSelectInfo(obj: unknown): obj is DateSelectArg {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof (obj as any).event === "undefined"
  );
}

export function isClickInfo(obj: unknown): obj is EventClickArg {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof (obj as any).event === "object"
  );
}
