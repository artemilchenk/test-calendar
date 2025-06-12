import { type EventInput } from "@fullcalendar/core";

export type THour = {
  id: number;
  name: string;
  value: string;
  booked: boolean;
};

export type TFormData = {
  name: string;
  time: string;
};

export type TEventDto = {
  name: string;
  timeStart: Date | string;
  timeEnd: Date | string;
};

export type TPopup = {
  visible: boolean;
  top: number;
  left: number;
  date: string;
};

export interface IEvent extends EventInput {
  startStr: string;
  endStr: string;
}
