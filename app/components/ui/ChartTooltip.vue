<script setup lang="ts">
defineProps<{
  visible: boolean
  x: number
  y: number
  title?: string
  value?: number | string
  max?: number | string
}>()
</script>

<template>
  <Transition name="fade">
    <div 
      v-if="visible" 
      class="chart-tooltip"
      :style="{ left: x + 'px', top: y + 'px' }"
    >
      <div class="tooltip-header">{{ title }}</div>
      <div class="tooltip-body">
        <span class="value">{{ value }}</span>
        <span class="separator">/</span>
        <span class="max">{{ max }}</span>
      </div>
      <div class="tooltip-arrow"></div>
    </div>
  </Transition>
</template>

<style scoped lang="sass">
.chart-tooltip
  position: absolute
  transform: translate(-50%, -100%) translateY(-12px) // Center horizontally, move above point
  background: rgba(15, 23, 42, 0.95)
  border: 1px solid rgba(139, 92, 246, 0.5)
  padding: 8px 12px
  border-radius: 8px
  pointer-events: none // Don't block mouse
  z-index: 100
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5)
  display: flex
  flex-direction: column
  align-items: center
  min-width: 80px
  backdrop-filter: blur(4px)

.tooltip-header
  font-size: 0.75rem
  color: #94a3b8
  font-weight: 600
  text-transform: uppercase
  margin-bottom: 2px
  white-space: nowrap

.tooltip-body
  display: flex
  align-items: baseline
  gap: 2px
  color: #fff

.value
  font-size: 1.1rem
  font-weight: 700
  color: #a78bfa

.separator
  font-size: 0.8rem
  color: #64748b

.max
  font-size: 0.8rem
  color: #64748b

.tooltip-arrow
  position: absolute
  bottom: -5px
  left: 50%
  transform: translateX(-50%) rotate(45deg)
  width: 8px
  height: 8px
  background: rgba(15, 23, 42, 0.95)
  border-bottom: 1px solid rgba(139, 92, 246, 0.5)
  border-right: 1px solid rgba(139, 92, 246, 0.5)

.fade-enter-active,
.fade-leave-active
  transition: opacity 0.2s ease, transform 0.2s ease

.fade-enter-from,
.fade-leave-to
  opacity: 0
  transform: translate(-50%, -100%) translateY(-8px) scale(0.95)
</style>
