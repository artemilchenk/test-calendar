<script setup lang="ts"></script>

<template>
  <div class="dialog-icon">
    <img class="main" src="@/assets/icons/dialog/1.svg" alt="Dialog Icon" />
    <img
      class="secondary"
      src="@/assets/icons/dialog/2.svg"
      alt="Dialog Icon"
    />
  </div>
</template>

<style scoped lang="scss">
.dialog-icon {
  position: relative;
}

.secondary {
  position: absolute;
  z-index: 1;
  left: 45%;
  top: 55%;
}
</style>
