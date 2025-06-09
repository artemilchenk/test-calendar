<script setup lang="ts">
import AppSidebar from "./app-sidebar.vue";
import Header from "@/components/app-header/header.vue";
import AppContent from "@/components/app-content.vue";
</script>

<template>
  <div class="app-layout">
    <div class="title">IMPEKABLE</div>
    <AppSidebar class="grid-sidebar" />
    <Header class="grid-header" />
    <AppContent class="grid-content" />
  </div>
</template>

<style scoped lang="scss">
.app-layout {
  font-family: SourceSans3Light, sans-serif;
  height: 100vh;
  display: grid;
  grid-template-columns: 260px 1fr;
  grid-template-rows: 70px 1fr;

  .title {
    @include flexBox(row, start, center);
    @include text("SourceSans3Bold", 15px, 400, 126%);
    letter-spacing: 3px;
    background-color: $c-dark-black;
    padding: 25px 20px;
    color: white;
  }

  .grid-header {
    grid-column: 2;
    grid-row: 1;
  }

  .grid-sidebar {
    grid-row: 2;
    grid-column: 1;
  }

  .grid-content {
    grid-row: 2;
    grid-column: 2;
  }
}
</style>
