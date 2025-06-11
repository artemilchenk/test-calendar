import { ViewApi } from "@fullcalendar/core";
import { EventInput } from "@fullcalendar/core";

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
  timeStart: Date;
  timeEnd: Date;
};

export type TEventUpdateDto = {
  title: string;
  timeStart: Date;
  timeEnd: Date;
  startStr: string;
  endStr: string;
};

export interface ISelectInfo {
  start: Date;
  end: Date;
  startStr: string;
  endStr: string;
  allDay: boolean;
  view: ViewApi;
}

export interface IClickInfo extends ISelectInfo {
  id: string;
}

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
