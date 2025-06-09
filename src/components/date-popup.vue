<script setup lang="ts">
import { type Ref, ref, toRefs } from "vue";
import { watchOutsideCalendarClick } from "@/event-utils.ts";
import { CgCloseO } from "@kalimahapps/vue-icons";
import type { THour } from "@/types/calendar.ts";

type TProps = {
  isVisible: boolean;
  top: string;
  left: string;
  info: Ref<any>;
  hours: THour[];
};

const props = defineProps<TProps>();
const { isVisible, top, left, info, hours } = toRefs(props);

const emit = defineEmits(["onClosePopup", "onAddEvent"]);

export type TFormData = {
  name: string;
  time: string;
};

const defaultFormData = {
  name: "",
  time: "",
};

const eventData = ref<TFormData>(defaultFormData);

const onClosePopupHandler = () => {
  emit("onClosePopup");
  eventData.value.name = "";
  eventData.value.time = "";
};

const onAddEventHandler = () => {
  emit("onAddEvent", eventData.value);
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
      v-model="eventData.name"
      placeholder="Event title"
      class="mt-2 border p-1 w-full"
    />
    <input disabled type="date" :value="info.startStr" id="date" />

    <div>
      <label for="hourSelect">Hour:</label>

      <select required v-model="eventData.time" id="hourSelect" name="hour">
        <option v-for="item in hours" :key="item.id" :disabled="item.booked">
          {{ item.value }}
        </option>
      </select>
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
