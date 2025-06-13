<script setup lang="ts">
import { type Ref, toRefs, watchEffect } from "vue";
import {
  formatToHHMM,
  formatToYYYYMMDD,
  fromHHMMToIsoDate,
} from "@/event-utils.ts";
import { CgCloseO } from "@kalimahapps/vue-icons";
import type {
  TEventDto,
  THour,
  TPopup,
  IEvent,
  ISelectInfoCustom,
} from "@/types/calendar.ts";
import { type DateSelectArg, type EventClickArg } from "@fullcalendar/core";
import { isClickInfo } from "@/guards/calendar.ts";

type TPopupProps = {
  lastInfo: Ref<DateSelectArg | EventClickArg>;
  hours: THour[];
  popup: TPopup;
  activeEvent: IEvent | null;
  selectInfoCustom: ISelectInfoCustom;
  isAllDay: boolean;
};

const props = defineProps<TPopupProps>();
const { lastInfo, hours, popup, isAllDay, selectInfoCustom, activeEvent } =
  toRefs(props);

const emit = defineEmits<{
  (e: "onSubmit", arg: TEventDto): void;
  (e: "onClosePopup"): void;
}>();

const resetEventBody = () => {
  selectInfoCustom.value.eventBody.startIsoCustom = "";
  selectInfoCustom.value.eventBody.endIsoCustom = "";
  selectInfoCustom.value.eventBody.name = "";
};

watchEffect(() => {
  if (activeEvent.value && popup.value.visible) {
    selectInfoCustom.value.eventBody.name = activeEvent.value.title || "";
    selectInfoCustom.value.eventBody.startIsoCustom =
      activeEvent.value.startStr;
    selectInfoCustom.value.eventBody.endIsoCustom = activeEvent.value.endStr;
  }
});

const onClosePopupHandler = () => {
  emit("onClosePopup");
  resetEventBody();
};

const onSubmitHandler = () => {
  activeEvent.value = null;

  emit("onSubmit", {
    name: selectInfoCustom.value.eventBody.name,
    timeStart: selectInfoCustom.value.eventBody.startIsoCustom,
    timeEnd: selectInfoCustom.value.eventBody.endIsoCustom,
  });

  resetEventBody();
};

function onTimeSelectChange(event: Event) {
  const target = event.target as HTMLSelectElement;

  const [hours, minutes] = target.value.split(":");

  selectInfoCustom.value.eventBody.startIsoCustom = fromHHMMToIsoDate(
    target.value,
    selectInfoCustom.value.eventBody.startIsoCustom,
  );

  selectInfoCustom.value.eventBody.endIsoCustom = fromHHMMToIsoDate(
    `${+hours + 2}:${minutes}`,
    selectInfoCustom.value.eventBody.startIsoCustom,
  );
}

function onTimeInputChange(event: Event) {
  const target = event.target as HTMLInputElement;
  selectInfoCustom.value.eventBody.name = target.value;
}
</script>

<template>
  <div
    @click.stop
    v-if="popup.visible"
    class="popup"
    :style="{
      position: 'absolute',
      top: popup.top + 'px',
      left: popup.left + 'px',
      zIndex: 1000,
    }"
  >
    <div class="flex justify-between items-center">
      <CgCloseO class="close" @click="onClosePopupHandler" />
    </div>

    <input
      required
      type="text"
      @change="onTimeInputChange"
      :value="selectInfoCustom.eventBody.name"
      placeholder="Event title"
      class="mt-2 border p-1 w-full"
    />

    <input
      disabled
      type="date"
      :value="
        formatToYYYYMMDD(
          isClickInfo(lastInfo) ? lastInfo.event.startStr : lastInfo.startStr,
        )
      "
      id="date"
    />

    <div v-if="isAllDay">
      <div>
        <label for="hourSelect">Hour:</label>

        <select
          required
          @change="onTimeSelectChange"
          :value="formatToHHMM(selectInfoCustom.eventBody.startIsoCustom)"
          id="hourSelect"
          name="hour"
        >
          <option v-for="item in hours" :key="item.id" :disabled="item.booked">
            {{ item.value }}
          </option>
        </select>
      </div>
    </div>

    <button
      class="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
      @click="onSubmitHandler"
    >
      Save
    </button>
  </div>
</template>

<style scoped lang="scss">
.popup {
  border: 1px solid $c-black;
}

.close {
  @include circle(20px);

  position: absolute;
  color: $c-hard-gray;
  right: 6px;
  top: 6px;
}
</style>
