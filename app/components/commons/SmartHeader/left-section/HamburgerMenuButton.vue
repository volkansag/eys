<template>
  <div class="menu-btn-wrapper">
    <AnimatedHamburger
      :is-open="layoutStore.isDrawerOpen"
      @toggle="layoutStore.toggleDrawer"
    />
  </div>
</template>

<script setup lang="ts">
import AnimatedHamburger from "~/components/commons/AnimatedHamburger.vue";

const layoutStore = useLayoutStore();
</script>

<style scoped lang="sass">
@use "sass:color"
@use "~/assets/sass/shared/_colors.sass" as *

.menu-btn-wrapper
  display: flex
  align-items: center
  justify-content: center

  :deep(.hamburger-btn)
    border-radius: 8px
    color: #8D3FD0
    @include hover-darken-effect(#f0f3ff, 5%)

    &:hover
      background-color: color.adjust(#f0f3ff, $lightness: -5%)
      color: #8D3FD0
</style>
