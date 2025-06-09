<script setup lang="ts"></script>

<template>
  <div class="dialog-icon">
    <img
      class="main"
      src="@/assets/icons/notification/bell.svg"
      alt="Dialog Icon"
    />
    <img
      class="secondary"
      src="@/assets/icons/notification/notification.svg"
      alt="Dialog Icon"
    />
  </div>
</template>

<style scoped lang="scss">
.dialog-icon {
  display: flex;
  width: max-content;
  position: relative;
}

.secondary {
  position: absolute;
  z-index: 1;
  left: 55%;
  bottom: 55%;
}
</style>
