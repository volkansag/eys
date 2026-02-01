<script setup lang="ts">
import { useSlots, computed } from 'vue'

interface Props {
  modelValue: string | number
  label?: string
  type?: string
  placeholder?: string
  error?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: '',
  type: 'text',
  placeholder: '',
  error: '',
  disabled: false
})

const emit = defineEmits(['update:modelValue'])

const { localValue, isFocused, handleFocus, handleBlur } = useInput(props, emit)
const { ripples, addRipple } = useRipple()

const showPassword = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const slots = useSlots()
const hasPrepend = computed(() => !!slots.prepend)

const handleContainerClick = (e: MouseEvent) => {
  if(!props.disabled) addRipple(e)
}
</script>

<template>
  <div class="input-wrapper" :class="{ 'input-wrapper--focused': isFocused, 'input-wrapper--error': !!error, 'input-wrapper--disabled': disabled, 'input-wrapper--has-icon': hasPrepend }">
    <div class="input-container" @mousedown="handleContainerClick">
      <div v-if="hasPrepend" class="input-prepend">
        <slot name="prepend" />
      </div>
      
      <input
        :type="type === 'password' && showPassword ? 'text' : type"
        class="input-field"
        :value="localValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @focus="handleFocus"
        @blur="handleBlur"
        :disabled="disabled"
        :placeholder="placeholder"
      />
      
      <button v-if="type === 'password'" type="button" class="password-toggle" @click="togglePassword" @mousedown.prevent.stop>
         <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
           <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
           <line x1="1" y1="1" x2="23" y2="23"></line>
         </svg>
         <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
           <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
           <circle cx="12" cy="12" r="3"></circle>
         </svg>
      </button>

      <div class="ripple-host">
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
      </div>
    </div>
    <div v-if="error" class="input-error">
      {{ error }}
    </div>
  </div>
</template>

<style lang="sass" scoped>
@use "~/assets/sass/shared/_colors.sass" as *

.input-wrapper
  position: relative
  margin-bottom: 1.5rem
  font-family: 'Inter', sans-serif
  display: flex
  flex-direction: column

  &--focused
    .input-container
      background-color: $light-surface
      border-color: $light-primary
      box-shadow: 0 0 0 3px rgba($light-primary, 0.1)
    .ripple-host::after
      transform: scaleX(1)
    .input-field::placeholder
      color: $light-primary

  &--error
    .input-container
      background-color: rgba($color-error, 0.05)
      border-color: $color-error
    .ripple-host::after
      background-color: $color-error
      transform: scaleX(1)
    .input-field::placeholder
      color: $color-error

  &--disabled
    opacity: 0.6
    pointer-events: none
    .input-container
      background-color: $light-surface-alt

  &--has-icon
    .input-field
      padding-left: 44px
    .input-prepend
      color: $light-text-muted

.input-container
  position: relative
  height: 56px
  background-color: $light-surface
  border: 1px solid $light-border
  border-radius: 0.5rem
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1)
  display: flex
  align-items: center
  
  &:hover:not(.input-wrapper--disabled .input-container)
    border-color: $light-text-muted

.input-field
  width: 100%
  height: 100%
  border: none
  background: transparent
  padding: 0 16px
  font-size: 1rem
  color: $light-text-primary
  outline: none
  font-family: inherit
  
  &::placeholder
    color: $light-text-muted
    transition: color 200ms cubic-bezier(0.4, 0, 0.2, 1)

  &:-webkit-autofill
    -webkit-box-shadow: 0 0 0 100px $light-surface inset
    -webkit-text-fill-color: $light-text-primary
    caret-color: $light-text-primary

.ripple-host
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
  overflow: hidden
  border-radius: inherit
  pointer-events: none
  z-index: 0

  &::after
    content: ''
    position: absolute
    bottom: 0
    left: 0
    width: 100%
    height: 2px
    background-color: $light-primary
    transform: scaleX(0)
    transform-origin: center
    transition: transform 200ms ease

.password-toggle
  background: none
  border: none
  margin-right: 4px
  padding: 8px
  cursor: pointer
  color: $light-text-muted
  display: flex
  align-items: center
  justify-content: center
  border-radius: 50%
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1)
  outline: none
  
  &:hover
    color: $light-primary
    background-color: rgba($light-primary, 0.1)

  svg
    width: 20px
    height: 20px

.input-error
  position: absolute
  left: 4px
  top: 100%
  margin-top: 4px
  font-size: 0.75rem
  color: $color-error
  animation: slide-up 0.2s ease-out

.ripple
  position: absolute
  border-radius: 50%
  background-color: rgba($light-primary, 0.1)
  transform: scale(0)
  animation: ripple 700ms ease-out forwards
  pointer-events: none

.input-prepend
  position: absolute
  left: 0
  top: 0
  height: 100%
  width: 44px
  display: flex
  align-items: center
  justify-content: center
  z-index: 10
  pointer-events: none
  
  svg
    width: 20px
    height: 20px
    transition: color 200ms cubic-bezier(0.4, 0, 0.2, 1)

.input-wrapper--focused .input-prepend
  color: $light-primary

.input-wrapper--error .input-prepend
  color: $color-error

@keyframes ripple
  to
    transform: scale(4)
    opacity: 0

@keyframes slide-up
  from
    opacity: 0
    transform: translateY(-4px)
  to
    opacity: 1
    transform: translateY(0)
</style>
