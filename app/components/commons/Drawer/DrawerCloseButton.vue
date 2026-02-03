<template>
  <div class="drawer-close-wrapper">
    <AnimatedHamburger
      :is-open="isActive"
      :white="white"
      @toggle="$emit('close')"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import AnimatedHamburger from "~/components/commons/AnimatedHamburger.vue";

defineProps({
  white: {
    type: Boolean,
    default: false,
  },
});

const isActive = ref(false);

onMounted(() => {
  // Small delay to ensure the drawer transition has started
  setTimeout(() => {
    isActive.value = true;
  }, 100);
});

defineEmits(["close"]);
</script>

<style scoped lang="sass">
@use "sass:color"
@use "~/assets/sass/shared/_colors.sass" as *

.drawer-close-wrapper
  display: flex
  align-items: center
  justify-content: center

  :deep(.hamburger-btn)
    border-radius: 8px
    color: #8D3FD0
    @include hover-darken-effect(#f0f3ff, 5%)

    &.is-white
      background-color: #f0f3ff
      color: #8D3FD0

    &:hover
      background-color: color.adjust(#f0f3ff, $lightness: -5%)
      color: #8D3FD0
</style>
