import { onMounted, onUnmounted } from "vue";

export const getIsoDate = (dateStr: string, timeStr: string) => {
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hour, minute] = timeStr.split(":").map(Number);
  const date = new Date(year, month - 1, day, hour, minute);

  return date.toISOString();
};

let eventGuid = 0;
let todayStr = new Date().toISOString().replace(/T.*$/, ""); // YYYY-MM-DD of today

export const INITIAL_EVENTS = [];
export function createEventId() {
  return String(eventGuid++);
}

export const getTimeFromIso = (dateIso: string) => {
  const date = new Date(dateIso);
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${hours}:${minutes.toString().padStart(2, "0")}`;
};

export const getActiveElement = (data: string) => {
  return document.querySelector(`.fc-daygrid-day[data-date="${data}"]`);
};

export const resetActiveElement = () => {
  document.querySelectorAll(`.fc-daygrid-day`).forEach((el) => {
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
