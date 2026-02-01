<script setup lang="ts">
interface Props {
  modelValue: boolean
  label?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  label: '',
  disabled: false
})

const emit = defineEmits(['update:modelValue'])

const handleChange = () => {
  if (props.disabled) return
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <label class="checkbox" :class="{ 'checkbox--disabled': disabled }">
    <input
      type="checkbox"
      class="checkbox__input"
      :checked="modelValue"
      :disabled="disabled"
      @change="handleChange"
    />
    <div class="checkbox__control" :class="{ 'checkbox__control--checked': modelValue }">
      <svg
        v-if="modelValue"
        class="checkbox__icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
    <span v-if="label" class="checkbox__label">{{ label }}</span>
  </label>
</template>

<style lang="sass" scoped>
.checkbox
  display: inline-flex
  align-items: center
  cursor: pointer
  user-select: none
  font-family: 'Inter', sans-serif

  &--disabled
    cursor: not-allowed
    opacity: 0.6

  &__input
    position: absolute
    opacity: 0
    width: 0
    height: 0

  &__control
    width: 20px
    height: 20px
    border: none
    border-radius: 0.375rem
    display: flex
    align-items: center
    justify-content: center
    transition: all 200ms ease
    background-color: rgba(255, 255, 255, 0.1)

    &--checked
      background-color: $color-primary

  &__icon
    width: 14px
    height: 14px
    color: white
    stroke-dasharray: 24
    stroke-dashoffset: 24
    animation: dash 300ms ease forwards

  &__label
    margin-left: 0.5rem
    font-size: 1rem
    color: $color-text

  &:hover:not(.checkbox--disabled) .checkbox__control
    background-color: rgba(255, 255, 255, 0.15)

@keyframes dash
  from
    stroke-dashoffset: 24
  to 
    stroke-dashoffset: 0
</style>
