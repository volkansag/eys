<script setup lang="ts">
import { useSmartHeader } from "~/composables/useSmartHeader";
import HeaderLeft from "./left-section/HeaderLeft.vue";
import HeaderCenter from "./center-section/HeaderCenter.vue";
import HeaderRight from "./right-section/HeaderRight.vue";

const layoutStore = useLayoutStore();

const { classes, state, vSmartHeader } = useSmartHeader({
  offset: 15,
  tolerance: {
    down: 5,
    up: 5,
  },
});
</script>

<template>
  <header
    v-smart-header
    :class="[
      'site-header',
      {
        [classes.initial]: state.initial,
        [classes.pinned]: state.pinned,
        [classes.unpinned]: state.unpinned,
        [classes.top]: state.top,
        [classes.notTop]: state.notTop,
        [classes.bottom]: state.bottom,
        [classes.notBottom]: state.notBottom,
        [classes.frozen]: state.frozen,
      },
    ]"
  >
    <div class="ribbon-container">
      <div class="top-bar">
        <HeaderLeft />
        <HeaderCenter>
          <!-- Center content slot -->
        </HeaderCenter>
        <HeaderRight />
      </div>
    </div>
  </header>
</template>

<style scoped lang="sass">
@use "~/assets/sass/shared/_colors.sass" as *

.site-header
  position: fixed
  top: 0
  left: 0
  right: 0
  z-index: 100
  background: $light-surface
  box-shadow: 0 2px 10px rgba(0,0,0,0.08)
  border-bottom: 1px solid $light-border
  transition: transform 300ms ease
  will-change: transform
  transform: translateY(0)

  &.sh-unpinned
    transform: translateY(-100%)

.ribbon-container
  display: flex
  flex-direction: column

.top-bar
  display: flex
  align-items: center
  justify-content: space-between
  padding: 0 24px
  border-bottom: 1px solid $light-border
  height: 64px
</style>
