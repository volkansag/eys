<script setup lang="ts">
import { useSmartHeader } from '~/composables/useSmartHeader'
import { useDrawerState } from '~/composables/useDrawerState'
import AnimatedLogo from '~/components/ui/AnimatedLogo.vue'
import AnimatedHamburger from '~/components/ui/AnimatedHamburger.vue'

const { classes, state, vSmartHeader } = useSmartHeader({
  offset: 15,
  tolerance: {
    down: 5,
    up: 5
  }
})

const isDrawerOpen = useDrawerState()
const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value
}
</script>

<template>
  <header 
    v-smart-header 
    :class="['site-header', {
      [classes.initial]: state.initial,
      [classes.pinned]: state.pinned,
      [classes.unpinned]: state.unpinned,
      [classes.top]: state.top,
      [classes.notTop]: state.notTop,
      [classes.bottom]: state.bottom,
      [classes.notBottom]: state.notBottom,
      [classes.frozen]: state.frozen
    }]"
  >
    <div class="ribbon-container">
      <div class="top-bar">
        <div class="left-section">
          <div class="menu-btn-wrapper">
             <AnimatedHamburger :is-open="isDrawerOpen" @toggle="toggleDrawer" />
          </div>
          <div class="logo">
            <AnimatedLogo />
            <span class="app-title">aSc k12 Bilişim Ders Planlama 2025</span>
          </div>
        </div>
        <div class="window-controls">
           <!-- Placeholder for window controls if needed -->
        </div>
      </div>
      
    </div>
  </header>
</template>

<style scoped lang="sass">
@use "~/assets/sass/shared/_colors.sass" as *

.site-header
  position: fixed
  top: 0
  left: 0
  right: 0
  z-index: 100
  background: $dark-surface
  box-shadow: 0 2px 10px rgba(0,0,0,0.3)
  border-bottom: 1px solid $dark-border
  transition: transform 300ms ease
  will-change: transform
  transform: translateY(0)

  &.sh-unpinned
    transform: translateY(-100%)

.ribbon-container
  display: flex
  flex-direction: column

.top-bar
  display: flex
  align-items: center
  justify-content: space-between
  padding: 4px 16px
  border-bottom: 1px solid $dark-border
  height: 40px

.left-section
  display: flex
  align-items: center
  gap: 12px

.logo
  display: flex
  align-items: center
  gap: 12px
  font-size: 14px
  color: $dark-text-primary
  font-weight: 500

.app-title
  font-size: 13px
  color: $dark-text-muted
</style>
