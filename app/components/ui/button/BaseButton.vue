<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'text' | 'tonal'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  block?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'lg',
  disabled: false,
  loading: false,
  block: false,
  type: 'button'
})

const { ripples, addRipple } = useRipple()

const handleClick = (e: MouseEvent) => {
  if (props.disabled || props.loading) return
  addRipple(e)
}

const classes = computed(() => {
  return [
    'btn',
    `btn--${props.variant}`,
    `btn--${props.size}`,
    { 
      'btn--block': props.block,
      'btn--disabled': props.disabled,
      'btn--loading': props.loading
    }
  ]
})
</script>

<template>
  <button :class="classes" :type="type" @click="handleClick" :disabled="disabled || loading">
    <transition name="fade-scale">
      <span v-if="loading" class="btn__loader">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </span>
    </transition>
    <span class="btn__content" :class="{ 'btn__content--hidden': loading }">
      <slot></slot>
    </span>
    <span v-for="ripple in ripples" 
          :key="ripple.id" 
          class="ripple" 
          :style="{ 
            left: `${ripple.x}px`, 
            top: `${ripple.y}px`, 
            width: `${ripple.size}px`, 
            height: `${ripple.size}px` 
          }">
    </span>
  </button>
</template>

<style lang="sass" scoped>
@use 'sass:color'
@use '~/assets/sass/shared/_colors.sass' as *

.btn
  position: relative
  display: inline-flex
  align-items: center
  justify-content: center
  border: none
  border-radius: 9999px
  font-family: 'Inter', sans-serif
  font-weight: 500
  letter-spacing: 0.5px
  cursor: pointer
  overflow: hidden
  transition: background-color .2s ease-out, box-shadow .2s ease-out
  user-select: none
  outline: none
  text-decoration: none
  vertical-align: middle
  -webkit-tap-highlight-color: transparent

  &:focus-visible
    background-color: color.adjust($btn-primary-bg, $lightness: 5%)
  
  // Sizes
  &--sm
    padding: 0 16px
    font-size: 13px
    height: 32px
    line-height: 32px

  &--md
    padding: 0 16px
    font-size: 14px
    height: 36px
    line-height: 36px

  &--lg
    padding: 0 28px
    font-size: 15px
    height: 54px
    line-height: 54px

  // Variants
  &--primary
    background-color: $btn-primary-bg
    color: $btn-primary-text
    box-shadow: none
    
    &:hover:not(.btn--disabled)
      background-color: color.adjust($btn-primary-bg, $lightness: 5%)
      box-shadow: none
    
    &:active:not(.btn--disabled)
      background-color: color.adjust($btn-primary-bg, $lightness: -5%)

  &--secondary
    background-color: $btn-secondary-bg
    color: $btn-secondary-text
    box-shadow: none
    
    &:hover:not(.btn--disabled)
      background-color: color.adjust($btn-secondary-bg, $lightness: 5%)
      box-shadow: none
    
    &:active:not(.btn--disabled)
      background-color: color.adjust($btn-secondary-bg, $lightness: -5%)

  &--text
    background-color: transparent
    color: $light-primary
    box-shadow: none
    &:hover:not(.btn--disabled)
      background-color: rgba(255,255,255,0.1)
      box-shadow: none
  
  &--tonal
    background-color: rgba($light-primary, 0.1)
    color: $light-primary
    box-shadow: none
    &:hover:not(.btn--disabled)
      background-color: rgba($light-primary, 0.2)
    &:active:not(.btn--disabled)
      background-color: rgba($light-primary, 0.3)

  &--disabled
    opacity: 0.5
    cursor: not-allowed
    box-shadow: none !important
    transform: none !important

  &--loading
    cursor: wait
    pointer-events: none
    opacity: 0.9

  &--block
    width: 100%
    display: flex

.ripple
  position: absolute
  border-radius: 50%
  background-color: rgba(255, 255, 255, 0.4)
  transform: scale(0)
  animation: ripple 700ms ease-out forwards
  pointer-events: none

.btn__loader
  position: absolute
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
  display: flex
  align-items: center
  gap: 4px

.btn__content
  display: flex
  align-items: center
  justify-content: center
  gap: 8px
  transition: opacity 0.3s ease, transform 0.3s ease
  
  &--hidden
    opacity: 0
    transform: scale(0.8)

.dot
  width: 8px
  height: 8px
  background-color: currentColor
  border-radius: 50%
  animation: dot-wave 1.4s infinite ease-in-out both
  
  &:nth-child(1)
    animation-delay: -0.32s
  &:nth-child(2)
    animation-delay: -0.16s
  &:nth-child(3)
    animation-delay: 0s

@keyframes dot-wave
  0%, 80%, 100%
    transform: scale(0)
  40%
    transform: scale(1)

@keyframes ripple
  to
    transform: scale(4)
    opacity: 0

// Loader transition
.fade-scale-enter-active,
.fade-scale-leave-active
  transition: opacity 0.3s ease, transform 0.3s ease

.fade-scale-enter-from,
.fade-scale-leave-to
  opacity: 0
  transform: translate(-50%, -50%) scale(0.8)
</style>
