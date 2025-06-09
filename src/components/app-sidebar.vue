<script setup lang="ts">
import Item from "@/components/app-header/item.vue";
import { sideBarItems } from "@/mocks/side-bar.ts";
</script>

<template>
  <aside>
    <Item
      v-for="item in sideBarItems"
      :key="item.id"
      :title="item.title"
      :icon-src="item.icon"
      :is-active="item.isActive"
    />
  </aside>
</template>

<style scoped>
aside {
  display: flex;
  flex-direction: column;
  gap: 6px;
  background-color: #2c3e50;
  color: white;
}
</style>
