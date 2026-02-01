<template>
  <div class="landing-layout">
    <slot />
  </div>
</template>

<style scoped lang="sass">
@use "sass:color"
@use "~/assets/sass/shared/_colors.sass" as *

.landing-layout
  min-height: 100vh
  width: 100%
  background: $light-bg
  color: $light-text-primary
  position: relative
  overflow: hidden
  
  // Decorative circle background (subtle purple)
  &::before
    content: ''
    position: absolute
    top: -20%
    right: -10%
    width: 800px
    height: 800px
    background: radial-gradient(circle, rgba($light-secondary, 0.08) 0%, rgba(255,255,255,0) 70%)
    border-radius: 50%
    z-index: 0
  
  // Secondary decorative blob (green)
  &::after
    content: ''
    position: absolute
    bottom: -10%
    left: -10%
    width: 600px
    height: 600px
    background: radial-gradient(circle, rgba($light-primary, 0.05) 0%, rgba(255,255,255,0) 70%)
    border-radius: 50%
    z-index: 0
</style>
