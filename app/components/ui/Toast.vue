<script setup lang="ts">
import { useToast } from "~/composables/useToast";
import UiToastItem from "~/components/ui/ToastItem.vue"; // Explicit import

const { toasts } = useToast();
</script>

<template>
  <div class="toast-container">
    <transition-group name="toast">
      <UiToastItem
        v-for="(toast, index) in toasts"
        :key="toast.id"
        :toast="toast"
        :index="index"
        :total="toasts.length"
      />
    </transition-group>
  </div>
</template>

<style scoped lang="sass">
@use "~/assets/sass/shared/_animations.sass" as *

.toast-container
  position: fixed
  z-index: 10000
  pointer-events: none // Allow clicks through container

// List Transitions - Using centralized mixins
.toast-enter-active
  +popup-enter-active

.toast-leave-active
  +popup-leave-active

.toast-enter-from
  +popup-enter-from

.toast-leave-to
  +popup-leave-to
</style>
