<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string | number
  value: string | number
  label?: string
  name?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  value: '',
  label: '',
  name: '',
  disabled: false
})

const emit = defineEmits(['update:modelValue'])
const { ripples, addRipple } = useRipple()

const isChecked = computed(() => props.modelValue === props.value)

const handleChange = () => {
  if (props.disabled) return
  emit('update:modelValue', props.value)
}

const handleMousedown = (event: MouseEvent) => {
  if (props.disabled) return
  addRipple(event)
}
</script>

<template>
  <label
    class="radio"
    :class="{
      'radio--checked': isChecked,
      'radio--disabled': disabled
    }"
    @mousedown="handleMousedown"
  >
    <input
      type="radio"
      class="radio__input"
      :name="name"
      :checked="isChecked"
      :value="value"
      :disabled="disabled"
      @change="handleChange"
    />
    <span class="radio__circle"></span>
    <span v-if="label" class="radio__label">{{ label }}</span>
    
    <span
      v-for="ripple in ripples"
      :key="ripple.id"
      class="radio__ripple"
      :style="{
        top: `${ripple.y}px`,
        left: `${ripple.x}px`,
        width: `${ripple.size}px`,
        height: `${ripple.size}px`
      }"
    ></span>
  </label>
</template>

<style lang="sass" scoped>
@use 'sass:color'

.radio
  position: relative
  display: inline-flex
  align-items: center
  cursor: pointer
  font-family: 'Inter', sans-serif
  color: $color-primary
  border: 2px solid $color-primary
  padding: 0.5rem 1rem
  border-radius: 0.5rem
  gap: 0.75rem
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1)
  user-select: none
  overflow: hidden

  &:hover:not(&--checked):not(&--disabled)
    background-color: rgba($color-primary, 0.05)
    border-color: $color-primary

  &:hover:not(&--disabled) .radio__circle
    transform: scale(1.05)

  &:active:not(&--disabled)
    transform: scale(0.98)

  &--checked
    background-color: $color-primary
    color: $color-text
    
    &:hover:not(&--disabled)
      background-color: color.adjust($color-primary, $lightness: 5%)
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05)

  &--disabled
    opacity: 0.6
    cursor: not-allowed
    border-color: $color-text-muted
    color: $color-text-muted

  &__input
    display: none

  &__circle
    height: 1.25em
    width: 1.25em
    border: 2px solid $color-primary
    border-radius: 50%
    box-sizing: border-box
    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1)
    flex-shrink: 0

  &--checked &__circle
    border: 5px solid $color-text
    background-color: $color-primary

  &--disabled &__circle
    border-color: $color-text-muted

  &__label
    font-weight: 500

  &__ripple
    position: absolute
    border-radius: 50%
    background-color: rgba(255, 255, 255, 0.3)
    transform: scale(0)
    animation: ripple 600ms linear
    pointer-events: none

@keyframes ripple
  to
    transform: scale(4)
    opacity: 0
</style>
