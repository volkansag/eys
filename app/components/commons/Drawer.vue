<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

// Close on Escape key
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.modelValue) {
    close()
  }
}

// Lock body scroll when open
watch(() => props.modelValue, (val) => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = val ? 'hidden' : ''
  }
})

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeydown)
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <div>
    <Transition name="drawer-fade">
      <div v-if="modelValue" class="drawer-backdrop" @click="close"></div>
    </Transition>

    <Transition name="drawer-slide">
      <div v-if="modelValue" class="drawer-panel">
        <div class="drawer-header">
          <h2 v-if="title" class="drawer-title">{{ title }}</h2>
          <button class="close-btn" @click="close">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="drawer-content">
          <slot></slot>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="sass">
.drawer-backdrop
  position: fixed
  top: 0
  left: 0
  width: 100vw
  height: 100vh
  background-color: rgba(0, 0, 0, 0.5)
  backdrop-filter: blur(4px)
  z-index: 9998

.drawer-panel
  position: fixed
  top: 0
  left: 0
  width: 300px
  max-width: 80vw
  height: 100vh
  background-color: $color-background
  border-right: 1px solid $color-border
  z-index: 9999
  display: flex
  flex-direction: column
  box-shadow: 10px 0 30px rgba(0, 0, 0, 0.5)

.drawer-header
  padding: 1.5rem
  display: flex
  align-items: center
  justify-content: space-between
  border-bottom: 1px solid $color-border

.drawer-title
  font-size: 1.25rem
  font-weight: 600
  color: $color-text
  margin: 0

.close-btn
  background: transparent
  border: none
  color: $color-text-muted
  cursor: pointer
  padding: 4px
  border-radius: 4px
  transition: all 0.2s ease
  display: flex
  align-items: center
  justify-content: center

.close-btn:hover
  color: $color-text
  background-color: $color-surface-hover

.drawer-content
  flex: 1
  overflow-y: auto
  padding: 1.5rem

/* Transitions */
.drawer-fade-enter-active,
.drawer-fade-leave-active
  transition: opacity 0.3s ease

.drawer-fade-enter-from,
.drawer-fade-leave-to
  opacity: 0

.drawer-slide-enter-active,
.drawer-slide-leave-active
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)

.drawer-slide-enter-from,
.drawer-slide-leave-to
  transform: translateX(-100%)
</style>
