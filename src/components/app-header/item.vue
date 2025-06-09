<script setup lang="ts">
import { toRefs } from "vue";

type TProps = {
  iconSrc: string;
  title: string;
  isActive: boolean;
};

const props = defineProps<TProps>();
const { iconSrc, title } = toRefs(props);
</script>

<template>
  <div :class="{ item: true, active: isActive }">
    <div class="item-icon">
      <img :src="iconSrc" alt="Item Icon" />
    </div>
    <div class="item-title">{{ title }}</div>
  </div>
</template>

<style scoped lang="scss">
.item {
  @include flexBox(row, start, center);
  gap: 11px;
  height: 53px;
  padding-left: 25px;
}

.item.active {
  border-left: $c-light-blue 5px solid;
  background-color: $c-dark-black;
}
</style>
