<script setup lang="ts">
import WelcomeUser from "./WelcomeUser.vue";
import LogoutButton from "./LogoutButton.vue";
</script>

<template>
  <div class="right-section">
    <WelcomeUser />
    <LogoutButton />
  </div>
</template>

<style scoped lang="sass">
@use "~/assets/sass/shared/_colors.sass" as *

.right-section
  display: flex
  align-items: center
  justify-content: flex-end
  gap: 20px
  flex: 1
</style>
