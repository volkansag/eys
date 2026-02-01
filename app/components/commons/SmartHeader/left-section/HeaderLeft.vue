<script setup lang="ts">
import HamburgerMenuButton from "./HamburgerMenuButton.vue";
import HeaderLogo from "./HeaderLogo.vue";
</script>

<template>
  <div class="left-section">
    <HamburgerMenuButton />
    <HeaderLogo />
  </div>
</template>

<style scoped lang="sass">
.left-section
  display: flex
  align-items: center
  gap: 16px
  flex: 1
</style>
