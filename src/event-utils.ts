import { onMounted, onUnmounted } from "vue";
import type { ISelectInfo, THour } from "./types/calendar.ts";
import { hours } from "./mocks/hour-select.ts";

let eventGuid = 0;
export const formatToYYYYMMDD = (isoDate: string) =>
  new Date(isoDate).toISOString().replace(/T.*$/, "");

export const INITIAL_EVENTS = [];
export function createEventId() {
  return String(eventGuid++);
}

export const getActiveElement = (data: string) => {
  return document.querySelector(`[data-date="${data}"]`);
};

export const resetActiveElement = () => {
  document.querySelectorAll(`.active`).forEach((el) => {
    el.classList.remove("active");
  });
};

export const setActiveCell = (data: string) => {
  resetActiveElement();

  const activeElement = getActiveElement(data);

  if (activeElement) activeElement.classList.add("active");

  return activeElement;
};

export const watchOutsideCalendarClick = (callback: () => void) => {
  function handleClickOutside(event: any) {
    const el = document.querySelector(".fc-scrollgrid");
    if (el && !el.contains(event.target)) {
      callback();
    }
  }

  onMounted(() => {
    document.addEventListener("click", handleClickOutside);
  });

  onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
  });
};

export const adjustSlots = (selectInfo: ISelectInfo) => {
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
