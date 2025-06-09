<script setup lang="ts">
import { type Ref, ref, toRefs, watch } from "vue";
import { formatToYYYYMMDD, watchOutsideCalendarClick } from "@/event-utils.ts";
import { CgCloseO } from "@kalimahapps/vue-icons";
import type {
  ISelectInfo,
  TFormData,
  TFormDto,
  THour,
} from "@/types/calendar.ts";

type TProps = {
  isVisible: boolean;
  top: string;
  left: string;
  info: Ref<ISelectInfo>;
  hours: THour[];
};

const props = defineProps<TProps>();
const { isVisible, top, left, info, hours } = toRefs(props);

const emit = defineEmits<{
  (e: "onAddEvent", arg: TFormDto): void;
  (e: "onClosePopup"): void;
}>();

const defaultFormData = {
  name: "",
  time: "",
};

const formData = ref<TFormData>(defaultFormData);

const onClosePopupHandler = () => {
  emit("onClosePopup");
  formData.value.name = "";
  formData.value.time = "";
};

const onAddEventHandler = () => {
  console.log(
    new Date(
      new Date(info.value.startStr).setHours(
        new Date(info.value.startStr).getHours() + 2,
      ),
    ),
  );

  emit("onAddEvent", {
    name: formData.value.name,
    timeStart: info.value.allDay
      ? new Date(info.value.startStr).setHours(
          formData.value.time.split(":")[0],
        )
      : new Date(info.value.startStr),
    timeEnd: info.value.allDay
      ? new Date(info.value.startStr).setHours(
          +formData.value.time.split(":")[0] + 2,
        )
      : new Date(info.value.endStr),
  });

  onClosePopupHandler();
};

watchOutsideCalendarClick(() => {
  onClosePopupHandler();
});
</script>

<template>
  <div
    v-if="isVisible"
    class="popup"
    :style="{
      position: 'absolute',
      top: top + 'px',
      left: left + 'px',
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
      :value="formatToYYYYMMDD(info.startStr)"
      id="date"
    />

    <div v-if="info.allDay">
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
      @click="onAddEventHandler"
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
