<script setup lang="ts">
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  createEventId,
  getActiveElement,
  getIsoDate,
  getTimeFromIso,
  INITIAL_EVENTS,
  setActiveCell,
} from "../event-utils.ts";
import { nextTick, ref, watch } from "vue";
import DatePopup, { type TFormData } from "@/components/date-popup.vue";
import { hours } from "@/mocks/hour-select.ts";
import type { THour } from "@/types/calendar.ts";

type TPopup = {
  visible: boolean;
  top: number;
  left: number;
  date: string;
  cellElement: Element | null;
};

const defPopupState = {
  visible: false,
  top: 0,
  left: 0,
  date: "",
  cellElement: null,
};

const calendarRef = ref();
const lastSelectInfo = ref();
const currentEvents = ref();
const filteredHours = ref<THour[] | null>(null);

const popup = ref<TPopup>(defPopupState);

const handleDateSelect = async (selectInfo: any) => {
  await nextTick();
  let calendarApi = selectInfo.view.calendar;

  //adjust hours start
  const allEvents = calendarApi.getEvents();

  const eventsForDate = allEvents.filter((event: any) => {
    return event.startStr.slice(0, 10) === selectInfo.startStr;
  });

  hours.forEach((hour: THour) => (hour.booked = false));

  eventsForDate.forEach((event: any) => {
    const effectedSlots = hours.filter((slot: THour) => {
      let [slotHours] = slot.value.split(":");

      const slotHourStart = new Date();
      slotHourStart.setHours(slotHours);
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

  filteredHours.value = [...hours];
  //adjust hours end

  if (!selectInfo.allDay) {
    const name = prompt("Enter event name");

    calendarApi.addEvent({
      id: createEventId(),
      title: name,
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay,
    });

    return;
  }

  lastSelectInfo.value = selectInfo;

  const activeCell = setActiveCell(selectInfo.startStr);

  if (activeCell) {
    const rect = activeCell.getBoundingClientRect();
    const containerRect = document
      .querySelector(".calendar-wrapper")
      ?.getBoundingClientRect();

    if (containerRect) {
      popup.value = {
        visible: true,
        top: rect.top,
        left: rect.left - containerRect.left + rect.width / 2,
        date: selectInfo.dateStr,
        cellElement: getActiveElement(selectInfo.startStr),
      };
    }
  }
};

const onClosePopupHandler = () => {
  popup.value.cellElement?.classList.remove("active");
  popup.value = defPopupState;
};

const addEventHandler = (formData: TFormData) => {
  const selectInfo = lastSelectInfo.value;

  const startTimeIso = getIsoDate(selectInfo.startStr, formData.time);

  const date = new Date(startTimeIso);
  date.setHours(date.getHours() + 2);
  const endTimeIso = date.toISOString();

  if (selectInfo) {
    let calendarApi = selectInfo.view.calendar;

    calendarApi.addEvent({
      id: createEventId(),
      title: formData.name,
      start: startTimeIso,
      end: endTimeIso,
      allDay: false,
    });

    onClosePopupHandler();
  }
};

const handleEventClick = (clickInfo: any) => {
  if (
    confirm(
      `Are you sure you want to delete the event '${clickInfo.event.title}'`,
    )
  ) {
    clickInfo.event.remove();
  }
};

const handleEvents = (events: any) => {
  currentEvents.value = events;
};

const calendarOptions = {
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  headerToolbar: {
    left: "today,prev,next",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay,Agenda",
  },
  customButtons: {
    Agenda: {
      text: "Agenda",
    },
  },
  buttonText: {
    next: "Next",
    prev: "Back",
    today: "Today",
  },
  initialView: "dayGridMonth",
  slotDuration: "02:00:00",
  initialEvents: INITIAL_EVENTS,
  editable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  select: handleDateSelect,
  eventClick: handleEventClick,
  eventsSet: handleEvents,
  /*eventAdd:
  eventChange:
  eventRemove:*/
};
</script>

<template>
  <div
    ref="calendarWrapperRef"
    class="calendar-wrapper"
    style="position: relative"
  >
    <FullCalendar ref="calendarRef" :options="calendarOptions"> </FullCalendar>
    <DatePopup
      v-if="lastSelectInfo && filteredHours"
      :info="lastSelectInfo"
      :hours="filteredHours"
      :is-visible="popup.visible"
      :top="popup.top"
      :left="popup.left"
      @onClosePopup="onClosePopupHandler"
      @onAddEvent="addEventHandler"
    />
  </div>
</template>

<style scoped lang="scss">
ul {
  margin: 0;
  padding: 0 0 0 1.5em;
}

li {
  margin: 1.5em 0;
  padding: 0;
}

b {
  margin-right: 3px;
}

.demo-app {
  display: flex;
  min-height: 100%;
  font-family:
    Arial,
    Helvetica Neue,
    Helvetica,
    sans-serif;
  font-size: 14px;
}

.demo-app-main {
  flex-grow: 1;
  padding: 3em;
}

.fc {
  max-width: 1100px;
  margin: 0 auto;
}

:deep(.fc-button) {
  background: $c-white !important;
  color: $c-black !important;
  padding: 8px 18px !important;
}

:deep(.fc-button:focus) {
  outline: none !important;
  box-shadow: none !important;
  color: $c-dark-blue !important;
}

:deep(.fc-button:disabled) {
  color: $c-dark-blue !important;
}

:deep(.fc-prev-button:focus) {
  color: $c-black !important;
}

:deep(.fc-next-button:focus) {
  color: $c-black !important;
}

:deep(.fc-col-header) {
  height: 45px !important;
}

:deep(.fc-scrollgrid-sync-inner) {
  height: 100% !important;
}

:deep(.fc-col-header-cell-cushion) {
  @include flexBox(row, center, center);
  height: 100% !important;
}

:deep(.fc-col-header-cell) {
  font-family: SourceSans3Mid, sans-serif;
  font-size: 11px;
  border: none !important;
  border-bottom: 1px solid $c-dim-gray !important;
  background: $c-light-gray;
  color: $c-hard-gray !important;
  text-transform: uppercase;
}

::v-deep(.fc-scrollgrid) {
  border-color: $c-dim-gray;
}

::v-deep(.fc-scrollgrid td),
::v-deep(.fc-scrollgrid th) {
  border-color: $c-dim-gray;
}

::v-deep(.fc-daygrid-day-number) {
  padding: 17px 14px;
}

::v-deep(.fc-event) {
  background: $c-dark-blue !important;
  padding-left: 14px;
}

::v-deep(.fc-timeGridDay-view) {
  .fc-event {
    padding-left: 0;
  }

  .fc-event {
    @include flexBox(row, center, center);
  }

  .fc-event-title-container {
    display: grid;
    align-items: center;
  }
}

::v-deep(.fc-event-time) {
  display: none;
}

::v-deep(.fc-daygrid-event-dot) {
  display: none;
}

::v-deep(.fc-day-today) {
  background-color: $c-light-gray !important;
}

::v-deep(.fc-timegrid-slot-label) {
  height: 49px !important;

  .fc-timegrid-slot-label-frame {
    @include flexBox(row, center, center);
  }
}

::v-deep(.fc-timegrid-axis-cushion) {
  display: grid;
  align-items: center;
}

.popup {
  position: absolute;
  z-index: 50;
  left: 50%;
  top: 50%;
  transform: translate(-50%, 10%);
  background: $c-white;
  border-radius: 12px;
  padding: 25px;
  width: 200px;
  height: 275px;
  box-shadow: 0px 3px 18px #00000029;
}

::v-deep(.active) {
  position: relative;
  background: $c-hard-gray !important;
}

::v-deep(.fc-highlight) {
  background: none;
}
</style>
