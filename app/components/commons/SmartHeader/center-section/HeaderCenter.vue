<script setup lang="ts"></script>

<template>
  <div class="center-section">
    <slot />
  </div>
</template>

<style scoped lang="sass">
@use "~/assets/sass/shared/_colors.sass" as *

.center-section
  display: flex
  align-items: center
  justify-content: center
  flex: 1
</style>
