<script setup lang="ts">
import { type Ref, ref, toRefs, watch } from "vue";
import { formatHHMM, formatToYYYYMMDD } from "@/event-utils.ts";
import { CgCloseO } from "@kalimahapps/vue-icons";
import type {
  TFormData,
  TEventDto,
  THour,
  TPopup,
  IEvent,
} from "@/types/calendar.ts";
import { type DateSelectArg, type EventClickArg } from "@fullcalendar/core";
import { isClickInfo } from "@/guards/calendar.ts";

type TPopupProps = {
  lastInfo: Ref<DateSelectArg | EventClickArg>;
  hours: THour[];
  popup: TPopup;
  activeEvent: Ref<IEvent>;
  isAllDay: Ref<boolean>;
};

const props = defineProps<TPopupProps>();
const { lastInfo, hours, popup, activeEvent, isAllDay } = toRefs(props);

const emit = defineEmits<{
  (e: "onSubmit", arg: TEventDto): void;
  (e: "onClosePopup"): void;
}>();

let formData = ref<TFormData>({
  name: "",
  time: "",
});

watch(activeEvent, (value) => {
  formData.value.name = value?.title || "";
  formData.value.time = formatHHMM(value?.startStr || "");
});

const resetPopupForm = () => {
  formData.value.time = "";
  formData.value.name = "";
};

const onClosePopupHandler = () => {
  resetPopupForm();
  emit("onClosePopup");
};

const onSubmitHandler = () => {
  const lastInfoStartStr = isClickInfo(lastInfo.value)
    ? lastInfo.value.event.startStr
    : lastInfo.value.startStr;

  const lastInfoStartEnd = isClickInfo(lastInfo.value)
    ? isAllDay.value
      ? lastInfo.value.event.startStr
      : lastInfo.value.event.endStr
    : isAllDay.value
      ? lastInfo.value.startStr
      : lastInfo.value.endStr;

  const allDayStart = new Date(lastInfoStartStr);
  allDayStart.setHours(+formData.value.time.split(":")[0]);

  const allDayEnd = new Date(lastInfoStartEnd);
  allDayEnd.setHours(+formData.value.time.split(":")[0] + 2);

  emit("onSubmit", {
    name: formData.value.name,
    timeStart: isAllDay.value ? allDayStart : lastInfoStartStr,
    timeEnd: isAllDay.value ? allDayEnd : lastInfoStartEnd,
  });

  resetPopupForm();
};
</script>

<template>
  <div
    v-if="popup.visible"
    class="popup"
    :style="{
      position: 'absolute',
      top: popup.top + 'px',
      left: popup.left + 'px',
      zIndex: 1000,
    }"
    @click.stop
  >
    <div class="flex justify-between items-center">
      <CgCloseO class="close" @click="onClosePopupHandler" />
    </div>

    <input
      required
      type="text"
      v-model="formData.name"
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

        <select required v-model="formData.time" id="hourSelect" name="hour">
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
