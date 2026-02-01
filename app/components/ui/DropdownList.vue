<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import BaseScrollbar from './BaseScrollbar.vue'

const props = defineProps<{
  modelValue?: string | number | null
  options: Array<{ value: string | number | null; label: string }>
  placeholder?: string
  disabled?: boolean
  maxHeight?: string
  width?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | null): void
  (e: 'change', value: string | number | null): void
}>()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const position = ref<'bottom' | 'top'>('bottom')

const selectedLabel = computed(() => {
  const selected = props.options.find(opt => opt.value === props.modelValue)
  return selected?.label || props.placeholder || 'Seçiniz'
})

const calculatePosition = async () => {
  if (!dropdownRef.value) return
  
  // Wait for DOM
  await nextTick()
  
  const rect = dropdownRef.value.getBoundingClientRect()
  const windowHeight = window.innerHeight
  const spaceBelow = windowHeight - rect.bottom
  const spaceAbove = rect.top
  
  const dropdownHeight = 220 // Approximate max height (max-height 200 + borders)
  
  // If space below is limited and space above is sufficient
  if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
    position.value = 'top'
  } else {
    position.value = 'bottom'
  }
}

const selectOption = (value: string | number | null) => {
  emit('update:modelValue', value)
  emit('change', value)
  isOpen.value = false
}

const toggle = async () => {
  if (!props.disabled) {
    if (!isOpen.value) {
      await calculatePosition()
      isOpen.value = true
    } else {
      isOpen.value = false
    }
  }
}

// Close on outside click
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('resize', calculatePosition)
  window.addEventListener('scroll', calculatePosition, true)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', calculatePosition)
  window.removeEventListener('scroll', calculatePosition, true)
})

// Generate unique ID for radio group
const groupId = `dropdown-${Math.random().toString(36).substr(2, 9)}`
</script>

<template>
  <div 
    ref="dropdownRef" 
    class="dropdown" 
    :class="{ open: isOpen, disabled }"
    :style="{ width: width || 'auto' }"
  >
    <button 
      type="button" 
      class="dropdown-trigger" 
      :class="{ active: isOpen }"
      @click="toggle"
    >
      <span class="dropdown-label">{{ selectedLabel }}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="1em"
        viewBox="0 0 512 512"
        class="dropdown-arrow"
      >
        <path
          d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
        ></path>
      </svg>
    </button>
    
    <Transition name="dropdown">
      <div v-if="isOpen" :class="['dropdown-menu', { 'position-top': position === 'top' }]">
        <BaseScrollbar :max-height="maxHeight || '200px'">
          <div class="dropdown-options">
            <div 
              v-for="option in options" 
              :key="String(option.value)" 
              class="dropdown-option"
              :class="{ selected: modelValue === option.value }"
              @click="selectOption(option.value)"
            >
              {{ option.label }}
            </div>
          </div>
        </BaseScrollbar>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="sass">
.dropdown
  position: relative
  display: inline-block
  box-sizing: border-box

.dropdown.disabled
  opacity: 0.5
  pointer-events: none

.dropdown-trigger
  display: flex
  align-items: center
  justify-content: space-between
  gap: 10px
  width: 100%
  padding: 8px 12px
  background-color: $color-surface-transparent
  border: 1px solid transparent
  box-sizing: border-box
  border-radius: 6px
  color: $color-text-muted
  font-size: 14px
  font-family: inherit
  cursor: pointer
  transition: all 0.2s ease

.dropdown-trigger:hover
  background-color: $color-surface-hover
  color: $color-text

.dropdown-trigger:focus
  outline: none
  background-color: $color-surface-hover
  box-shadow: 0 0 0 2px $color-primary-focus

.dropdown-trigger.active
  background-color: $color-surface-hover
  border-color: $color-primary
  color: $color-text

.dropdown-trigger.active .dropdown-arrow
  opacity: 1

.dropdown-label
  flex: 1
  min-width: 0
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis

.dropdown-arrow
  width: 12px
  height: 12px
  fill: currentColor
  opacity: 0.7
  transition: transform 0.2s ease
  flex-shrink: 0

.dropdown.open .dropdown-arrow
  transform: rotate(180deg)

/* Dropdown Menu - Overlay */
.dropdown-menu
  position: absolute
  top: calc(100% + 4px)
  left: 0
  bottom: auto
  min-width: 100%
  width: max-content
  max-width: 350px
  background-color: $color-surface
  border: 1px solid $color-primary
  border-radius: 6px
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4)
  z-index: 9999
  overflow: hidden

.dropdown-menu.position-top
  top: auto
  bottom: calc(100% + 4px)
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.4)

.dropdown-options
  padding: 4px

.dropdown-option
  padding: 8px 12px
  border-radius: 4px
  color: $color-text-muted
  font-size: 14px
  cursor: pointer
  transition: all 0.15s ease
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis
  margin-bottom: 4px

.dropdown-option:last-child
  margin-bottom: 0

.dropdown-option:hover
  background-color: $color-primary-transparent
  color: $color-primary

.dropdown-option.selected
  background-color: $color-primary-transparent
  color: $color-primary

/* Transition */
.dropdown-enter-active,
.dropdown-leave-active
  transition: all 0.2s ease

.dropdown-enter-from,
.dropdown-leave-to
  opacity: 0
  transform: translateY(-8px)

.dropdown-menu.position-top.dropdown-enter-from,
.dropdown-menu.position-top.dropdown-leave-to
  transform: translateY(8px)
</style>
