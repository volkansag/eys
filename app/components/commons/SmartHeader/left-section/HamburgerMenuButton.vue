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
.menu-btn-wrapper
  display: flex
  align-items: center
  justify-content: center
</style>
