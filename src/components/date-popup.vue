<script setup lang="ts">
import { reactive, type Ref, ref, toRefs, watch } from "vue";
import { formatToYYYYMMDD } from "@/event-utils.ts";
import { CgCloseO } from "@kalimahapps/vue-icons";
import type {
  ISelectInfo,
  TFormData,
  TFormDto,
  THour,
  TPopup,
} from "@/types/calendar.ts";

type TPopupProps = {
  info: Ref<ISelectInfo>;
  hours: THour[];
  popup: TPopup;
};

const props = defineProps<TPopupProps>();
const { info, hours, popup } = toRefs(props);

const emit = defineEmits<{
  (e: "onSubmit", arg: TFormDto): void;
  (e: "onClosePopup"): void;
}>();

const defaultFormData = {
  name: "",
  time: "",
};

let formData = ref<TFormData>(defaultFormData);

const resetPopupForm = () => {
  formData.value.time = "";
  formData.value.name = "";
};

const onClosePopupHandler = () => {
  resetPopupForm();
  emit("onClosePopup");
};

const onSubmitHandler = () => {
  const allDayStart = new Date(info.value.startStr);
  allDayStart.setHours(formData.value.time.split(":")[0]);

  const allDayEnd = new Date(info.value.startStr);
  allDayEnd.setHours(+formData.value.time.split(":")[0] + 2);

  emit("onSubmit", {
    name: formData.value.name,
    timeStart: info.value.allDay ? allDayStart : info.value.startStr,
    timeEnd: info.value.allDay ? allDayEnd : info.value.endStr,
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
