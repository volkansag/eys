<template>
  <div class="logo">
    <AnimatedLogo />
  </div>
</template>

<script setup lang="ts">
import AnimatedLogo from "./AnimatedLogo.vue";
</script>

<style scoped lang="sass">
@use "~/assets/sass/shared/_colors.sass" as *

.logo
  display: flex
  align-items: center
  gap: 14px
  font-size: 16px
  color: $light-text-primary
  font-weight: 600

.app-title
  font-size: 15px
  color: $light-text-secondary
</style>
