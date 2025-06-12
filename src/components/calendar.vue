<script setup lang="ts">
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import {
  adjustSlots,
  createEventId,
  formatToYYYYMMDD,
  INITIAL_EVENTS,
  setActiveCell,
} from "../event-utils.ts";
import { onMounted, onUnmounted, ref } from "vue";
import type { IEvent, TEventDto, TPopup } from "@/types/calendar.ts";
import DatePopup from "@/components/date-popup.vue";
import {
  type CalendarOptions,
  type DateSelectArg,
  type EventClickArg,
} from "@fullcalendar/core";

const defPopupState = {
  visible: false,
  top: 0,
  left: 0,
  date: "",
};

const calendarRef = ref();
const lastInfo = ref();
const currentEvents = ref();
const slots = ref();
const activeCell = ref<Element | null>(null);
const popup = ref<TPopup>(defPopupState);
const activeEvent = ref();
const isAllDay = ref();

const handleDateSelect = async (selectInfo: DateSelectArg) => {
  lastInfo.value = selectInfo;
  isAllDay.value = selectInfo.allDay;

  if (selectInfo.allDay) {
    const updatedSlots = adjustSlots(selectInfo);
    slots.value = [...updatedSlots];
  }

  if (selectInfo.allDay) {
    const dateShort = formatToYYYYMMDD(selectInfo.startStr);
    activeCell.value = setActiveCell(dateShort);
  }

  if (!selectInfo.jsEvent) return;

  const date = new Date(selectInfo.start);

  popup.value = {
    visible: true,
    top: selectInfo.jsEvent.screenY - 200,
    left: selectInfo?.jsEvent?.screenX - 200,
    date: date.toISOString(),
  };
};

const closePopup = () => {
  activeCell.value?.classList.remove("active");
  activeCell.value = null;
  activeEvent.value = null;
  popup.value.visible = false;
};

const onClosePopup = () => {
  closePopup();
};

const addEvent = (eventDto: TEventDto) => {
  let calendarApi = lastInfo.value.view.calendar;

  calendarApi.addEvent({
    id: createEventId(),
    title: eventDto.name,
    start: new Date(eventDto.timeStart).toISOString(),
    end: new Date(eventDto.timeEnd).toISOString(),
    allDay: false,
  });

  closePopup();
};

const updateEvent = (eventBody: TEventDto) => {
  if (!activeEvent?.value) return;

  activeEvent.value.setProp("title", eventBody.name);
  activeEvent.value.setStart(new Date(eventBody.timeStart).toISOString());
  activeEvent.value.setEnd(new Date(eventBody.timeEnd).toISOString());
};

const onSubmit = (formDataDto: TEventDto) => {
  if (activeEvent.value) {
    updateEvent(formDataDto);
    closePopup();
  } else {
    addEvent(formDataDto);
  }
};

const handleEvents = (events: IEvent) => {
  currentEvents.value = events;
  console.log({ events });
};

const handleEventClick = (clickInfo: EventClickArg) => {
  lastInfo.value = clickInfo;

  activeEvent.value = currentEvents.value.find(
    (event: IEvent) => event.id === clickInfo.event.id,
  );

  const date = new Date(clickInfo.event.startStr);

  popup.value = {
    visible: true,
    top: clickInfo.jsEvent.screenY - 200,
    left: clickInfo.jsEvent.screenX - 200,
    date: date.toISOString(),
  };
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
  updateEvent: updateEvent,
};

function handleClickOutside(event: any) {
  const el = document.querySelector(".popup");

  if (el && !el.contains(event.target)) {
    closePopup();
  }
}

onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});
</script>

<template>
  <div
    ref="calendarWrapperRef"
    class="calendar-wrapper"
    style="position: relative"
  >
    <FullCalendar
      ref="calendarRef"
      :options="calendarOptions as unknown as CalendarOptions"
    >
    </FullCalendar>
    <DatePopup
      :is-all-day="isAllDay"
      :activeEvent="activeEvent"
      :last-info="lastInfo"
      :hours="slots"
      :popup="popup"
      @onClosePopup="onClosePopup"
      :closePopup="closePopup"
      @onSubmit="onSubmit"
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
