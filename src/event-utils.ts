import type { ISelectInfoCustom, TEventBody, THour } from "./types/calendar.ts";
import { hours } from "./mocks/hour-select.ts";
import { type DateSelectArg } from "@fullcalendar/core";

let eventGuid = 0;
export const formatToYYYYMMDD = (isoDate: string) =>
  new Date(isoDate).toISOString().replace(/T.*$/, "");

export const formatToHHMM = (dateArg: Date | string) => {
  const date = new Date(dateArg);
  const hours = date.getHours();
  let minutes: string | number = date.getMinutes();

  if (`${minutes}`.length < 2) {
    minutes = "0" + minutes;
  }

  return `${hours}:${minutes}`;
};

export const fromHHMMToIsoDate = (time: string, data: Date | string) => {
  const formatedDate = new Date(data);

  formatedDate.setHours(+time.split(":")[0]);
  formatedDate.setMinutes(+time.split(":")[1]);

  return formatedDate.toISOString();
};

export const INITIAL_EVENTS = [];
export function createEventId() {
  return String(eventGuid++);
}

export const getActiveElement = (data: string) => {
  return document.querySelector(`[data-date="${data}"]`);
};

export const setActiveCell = (data: string) => {
  const activeElement = getActiveElement(data);

  if (activeElement) activeElement.classList.add("active");

  return activeElement;
};

export const adjustSlots = (selectInfo: DateSelectArg) => {
  let calendarApi = selectInfo.view.calendar;
  const allEvents = calendarApi.getEvents();

  const eventsForDate = allEvents.filter((event: any) => {
    return event.startStr.slice(0, 10) === selectInfo.startStr;
  });

  hours.forEach((hour: THour) => (hour.booked = false));

  eventsForDate.forEach((event: any) => {
    const effectedSlots = hours.filter((slot: THour) => {
      let [slotHours] = slot.value.split(":");

      const slotHourStart = new Date();
      slotHourStart.setHours(+slotHours);
      const slotHourEnd = new Date();
      slotHourEnd.setHours(+slotHours + 2);

      const eventHourStart = new Date();
      eventHourStart.setHours(new Date(event.startStr).getHours());
      const eventHourEnd = new Date();
      eventHourEnd.setHours(new Date(event.endStr).getHours());

      return !(slotHourEnd <= eventHourStart || slotHourStart >= eventHourEnd);
    });

    effectedSlots.forEach((effectedSlot: THour) => {
      const slotIndex = hours.findIndex(
        (hour: THour) => hour.id === effectedSlot.id,
      );
      if (slotIndex > -1) hours[slotIndex].booked = true;
    });
  });

  return hours;
};

export const setSelectCustomInfo = (
  selectInfo: DateSelectArg,
  body: Partial<TEventBody>,
): ISelectInfoCustom | undefined => {
  const startDate = new Date(body.startIsoCustom || new Date());
  let endDate = new Date(body.endIsoCustom || new Date());

  return {
    ...selectInfo,
    eventBody: {
      startIsoCustom: startDate.toISOString(),
      endIsoCustom: endDate.toISOString(),
      name: body.name || "",
    },
  };
};
