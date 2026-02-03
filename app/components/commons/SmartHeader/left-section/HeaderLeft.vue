<script setup lang="ts">
import HamburgerMenuButton from "./HamburgerMenuButton.vue";
import HeaderLogo from "./HeaderLogo/HeaderLogo.vue";
import HeaderSearch from "./HeaderSearch.vue";
</script>

<template>
  <div class="left-section">
    <HamburgerMenuButton />
    <HeaderLogo />
    <HeaderSearch />
  </div>
</template>

<style scoped lang="sass">
.left-section
  display: flex
  align-items: center
  gap: 16px
  flex: 1
</style>
