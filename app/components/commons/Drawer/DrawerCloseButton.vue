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
.drawer-close-wrapper
  display: flex
  align-items: center
  justify-content: center
</style>
