import { ViewApi } from "@fullcalendar/core";

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

export type TFormDto = {
  name: string;
  timeStart: Date;
  timeEnd: Date;
};

export interface ISelectInfo {
  start: Date;
  end: Date;
  startStr: string;
  endStr: string;
  allDay: boolean;
  view: ViewApi;
}

export type TPopup = {
  visible: boolean;
  top: number;
  left: number;
  date: string;
};
