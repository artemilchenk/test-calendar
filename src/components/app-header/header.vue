<script setup lang="ts">
import NotificationIcon from "@/components/app-header/notification-icon.vue";
import DialogIcon from "@/components/app-header/dialog-icon.vue";
import SupportIcon from "@/components/app-header/support-icon.vue";
import SerchIcon from "@/components/app-header/serch-icon.vue";
import UserImg from "@/components/ui/avatar.vue";
import ArrowDown from "@/components/app-header/arrow-down-icon.vue";
import Avatar from "@/components/ui/avatar.vue";
</script>

<template>
  <header>
    <div class="search-bar">
      <SerchIcon />
      <span class="search-text"> Search transactions, invoices or help </span>
    </div>

    <div class="user">
      <nav>
        <ul>
          <li><SupportIcon /></li>
          <li><DialogIcon /></li>
          <li><NotificationIcon /></li>
        </ul>
      </nav>

      <hr />

      <div class="user-actions">
        <div class="user-name">John Doe</div>
        <div class="user-arrow">
          <ArrowDown />
        </div>
        <Avatar radius="19" />
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
header {
  @include flexBox(row, space-between);
  @include textWithoutFName(13px, 300);
  padding: 0 20px;
}

.search-bar {
  display: flex;
  gap: 10px;
}

.user {
  @include flexBox(row, center, center);
  gap: 20px;
  height: 22px;
  padding-left: 20px;

  &-actions {
    @include flexBox(row, center, center);
    gap: 12px;
  }

  &-arrow {
    padding-left: 5px;
  }

  hr {
    border: none;
    width: 1px;
    height: 100%;
    background-color: $c-dim-gray;
  }
}

nav {
  ul {
    @include flexBox(row, center, center);
    list-style: none;
    gap: 30px;
    margin: 0;
    padding: 0;
  }
}
</style>
