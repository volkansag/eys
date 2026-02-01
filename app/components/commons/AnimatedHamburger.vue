<template>
  <button
    class="hamburger-btn"
    :class="{ open: isOpen, 'is-white': white }"
    @click="$emit('toggle')"
    aria-label="Menu"
  >
    <div class="icon-container">
      <!-- Menu Icon (Hamburger) -->
      <svg class="icon menu-icon" viewBox="0 0 512 512" fill="currentColor">
        <path
          d="M448,128c0-17.673-14.327-32-32-32H96c-17.673,0-32,14.327-32,32s14.327,32,32,32h320C433.673,160,448,145.673,448,128z"
        />
        <path
          d="M448,256c0-17.673-14.327-32-32-32H96c-17.673,0-32,14.327-32,32s14.327,32,32,32h320C433.673,288,448,273.673,448,256z"
        />
        <path
          d="M448,384c0-17.673-14.327-32-32-32H96c-17.673,0-32,14.327-32,32s14.327,32,32,32h320C433.673,416,448,401.673,448,384z"
        />
      </svg>

      <!-- Back Arrow Icon -->
      <svg class="icon arrow-icon" viewBox="0 0 512 512" fill="currentColor">
        <path
          d="M448 224H154.06l113.37-113.37c12.5-12.5 12.5-32.76 0-45.26s-32.76-12.5-45.26 0l-168 168c-12.5 12.5-12.5 32.76 0 45.26l168 168c12.5 12.5 32.76 12.5 45.26 0s12.5-32.76 0-45.26L154.06 288H448c17.67 0 32-14.33 32-32s-14.33-32-32-32z"
        />
      </svg>
    </div>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean;
  white?: boolean;
}>();

defineEmits(["toggle"]);
</script>

<style scoped lang="sass">
@use "sass:math"
@use "~/assets/sass/shared/_colors.sass" as *

.hamburger-btn
  background: rgba($light-primary, 0.08)
  border: none
  cursor: pointer
  padding: 0
  display: flex
  align-items: center
  justify-content: center
  border-radius: 50%
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) // Elastic transition
  color: $light-primary
  position: relative
  width: 38px
  height: 38px
  z-index: 5

  &.is-white
    background: rgba(255, 255, 255, 0.2)
    color: white

    &:hover
      background: white
      color: $light-primary

  &:not(.is-white):hover
    background: $light-primary
    color: #fff

.icon-container
  position: relative
  width: 20px
  height: 20px
  display: grid
  place-items: center

.icon
  grid-area: 1 / 1
  width: 100%
  height: 100%
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) // Snappier elastic
  pointer-events: none
  display: block

.menu-icon
  opacity: 1
  transform: rotate(0deg) scale(1)

.arrow-icon
  opacity: 0
  transform: rotate(-180deg) scale(0.7) // Start from behind and smaller

.hamburger-btn.open
  .menu-icon
    opacity: 0
    transform: rotate(180deg) scale(0.7) // Spin away and shrink

  .arrow-icon
    opacity: 1
    transform: rotate(0deg) scale(1) // Pop into place
</style>
