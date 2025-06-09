<script setup lang="ts">
import { toRefs } from "vue";

type TProps = {
  radius: number;
};

const props = defineProps<TProps>();
const { radius } = toRefs(props);
</script>

<template>
  <img
    :width="radius * 2"
    :height="radius * 2"
    src="@/assets/images/avatar.png"
    alt="Avatar Image"
  />
</template>

<style scoped lang="scss"></style>
