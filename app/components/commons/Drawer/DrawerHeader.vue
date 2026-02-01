<template>
  <div class="drawer-header" :class="{ 'is-transparent': transparent }">
    <div class="header-left">
      <DrawerCloseButton :white="transparent" @close="$emit('close')" />

      <div v-if="title" class="title-wrapper">
        <div class="title-indicator"></div>
        <h2 class="drawer-title">{{ title }}</h2>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DrawerCloseButton from "./DrawerCloseButton.vue";

defineProps({
  title: {
    type: String,
    default: "",
  },
  transparent: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["close"]);
</script>

<style scoped lang="sass">
@use "sass:color"
@use "~/assets/sass/shared/_colors.sass" as *

.drawer-header
  padding: 0 24px
  display: flex
  align-items: center
  justify-content: space-between
  border-bottom: 1px solid rgba($light-border, 0.6)
  height: 64px
  background: white
  position: relative
  z-index: 10
  transition: all 0.3s ease

  &.is-transparent
    background: transparent
    border-bottom: none
    padding-top: 10px // Extra breathing room for mobile-style header

    .drawer-title
      color: white

    .title-indicator
      background: white
      box-shadow: 0 2px 4px rgba(255, 255, 255, 0.2)

.header-left
  display: flex
  align-items: center
  gap: 12px

.title-wrapper
  display: flex
  align-items: center
  gap: 12px
  padding-left: 4px

.title-indicator
  width: 3px
  height: 16px
  background: linear-gradient(to bottom, $light-primary, color.adjust($light-primary, $lightness: 15%))
  border-radius: 44px
  box-shadow: 0 2px 4px rgba($light-primary, 0.2)
  transition: all 0.3s ease

.drawer-title
  font-size: 1rem
  font-weight: 700
  color: $light-text-primary
  margin: 0
  letter-spacing: -0.01em
  text-transform: capitalize
  transition: color 0.3s ease
</style>
