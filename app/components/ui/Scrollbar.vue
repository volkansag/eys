<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'

const props = defineProps<{
  height?: string
  maxHeight?: string
  minThumbSize?: number
}>()

// Refs
const contentRef = ref<HTMLElement | null>(null)
const scrollContainerRef = ref<HTMLElement | null>(null)

// State
const scrollTop = ref(0)
const scrollLeft = ref(0)
const scrollHeight = ref(0)
const scrollWidth = ref(0)
const clientHeight = ref(0)
const clientWidth = ref(0)

const isDraggingX = ref(false)
const isDraggingY = ref(false)
const isScrolling = ref(false)
const startX = ref(0)
const startY = ref(0)
const startScrollLeft = ref(0)
const startScrollTop = ref(0)

// Config
const minThumbSize = props.minThumbSize || 20
const showVertical = computed(() => scrollHeight.value > clientHeight.value)
const showHorizontal = computed(() => scrollWidth.value > clientWidth.value)

// Dynamic gap: only apply when both scrollbars are visible
const effectiveCornerGap = computed(() => (showVertical.value && showHorizontal.value) ? 24 : 0)

// Computed Props for Thumbs
const thumbHeight = computed(() => {
  if (!clientHeight.value || !scrollHeight.value) return 0
  const trackHeight = clientHeight.value - effectiveCornerGap.value
  const height = (trackHeight / scrollHeight.value) * trackHeight
  return Math.max(minThumbSize, height)
})

const thumbWidth = computed(() => {
  if (!clientWidth.value || !scrollWidth.value) return 0
  const trackWidth = clientWidth.value - effectiveCornerGap.value
  const width = (trackWidth / scrollWidth.value) * trackWidth
  return Math.max(minThumbSize, width)
})

const thumbTop = computed(() => {
  if (!scrollHeight.value || !clientHeight.value) return 0
  const trackHeight = clientHeight.value - effectiveCornerGap.value
  const maxScrollTop = scrollHeight.value - clientHeight.value
  const maxThumbTop = trackHeight - thumbHeight.value
  if (maxScrollTop === 0) return 0
  return (scrollTop.value / maxScrollTop) * maxThumbTop
})

const thumbLeft = computed(() => {
  if (!scrollWidth.value || !clientWidth.value) return 0
  const trackWidth = clientWidth.value - effectiveCornerGap.value
  const maxScrollLeft = scrollWidth.value - clientWidth.value
  const maxThumbLeft = trackWidth - thumbWidth.value
  if (maxScrollLeft === 0) return 0
  return (scrollLeft.value / maxScrollLeft) * maxThumbLeft
})

// Methods
const updateMetrics = () => {
  if (contentRef.value) {
    scrollHeight.value = contentRef.value.scrollHeight
    scrollWidth.value = contentRef.value.scrollWidth
    clientHeight.value = contentRef.value.clientHeight
    clientWidth.value = contentRef.value.clientWidth
    
    // Sync scroll position if metrics changed significantly
    if (contentRef.value.scrollTop !== scrollTop.value) {
      scrollTop.value = contentRef.value.scrollTop
    }
    if (contentRef.value.scrollLeft !== scrollLeft.value) {
      scrollLeft.value = contentRef.value.scrollLeft
    }
  }
}

let rafId: number | null = null
let scrollTimeout: ReturnType<typeof setTimeout> | null = null

const onScroll = (e: Event) => {
  if (!contentRef.value) return
  
  // Show scrollbar while scrolling
  isScrolling.value = true
  
  // Clear previous timeout
  if (scrollTimeout) clearTimeout(scrollTimeout)
  
  // Hide scrollbar after 1.5s of no scrolling
  scrollTimeout = setTimeout(() => {
    isScrolling.value = false
  }, 1500)
  
  // Use RAF for smooth UI updates
  if (rafId) cancelAnimationFrame(rafId)
  
  rafId = requestAnimationFrame(() => {
    if (contentRef.value) {
      scrollTop.value = contentRef.value.scrollTop
      scrollLeft.value = contentRef.value.scrollLeft
    }
  })
}

// Drag Handlers - Vertical
const onMouseDownY = (e: MouseEvent) => {
  e.preventDefault()
  e.stopPropagation()
  isDraggingY.value = true
  startY.value = e.clientY
  startScrollTop.value = scrollTop.value
  
  document.addEventListener('mousemove', onMouseMoveY)
  document.addEventListener('mouseup', onMouseUpY)
  document.body.style.userSelect = 'none'
}

const onMouseMoveY = (e: MouseEvent) => {
  if (!isDraggingY.value || !contentRef.value) return
  
  const deltaY = e.clientY - startY.value
  const maxScrollTop = scrollHeight.value - clientHeight.value
  const maxThumbTop = clientHeight.value - thumbHeight.value
  
  const scrollDelta = (deltaY / maxThumbTop) * maxScrollTop
  contentRef.value.scrollTop = startScrollTop.value + scrollDelta
}

const onMouseUpY = () => {
  isDraggingY.value = false
  document.removeEventListener('mousemove', onMouseMoveY)
  document.removeEventListener('mouseup', onMouseUpY)
  document.body.style.userSelect = ''
}

// Drag Handlers - Horizontal
const onMouseDownX = (e: MouseEvent) => {
  e.preventDefault()
  e.stopPropagation()
  isDraggingX.value = true
  startX.value = e.clientX
  startScrollLeft.value = scrollLeft.value
  
  document.addEventListener('mousemove', onMouseMoveX)
  document.addEventListener('mouseup', onMouseUpX)
  document.body.style.userSelect = 'none'
}

const onMouseMoveX = (e: MouseEvent) => {
  if (!isDraggingX.value || !contentRef.value) return
  
  const deltaX = e.clientX - startX.value
  const maxScrollLeft = scrollWidth.value - clientWidth.value
  const maxThumbLeft = clientWidth.value - thumbWidth.value
  
  const scrollDelta = (deltaX / maxThumbLeft) * maxScrollLeft
  contentRef.value.scrollLeft = startScrollLeft.value + scrollDelta
}

const onMouseUpX = () => {
  isDraggingX.value = false
  document.removeEventListener('mousemove', onMouseMoveX)
  document.removeEventListener('mouseup', onMouseUpX)
  document.body.style.userSelect = ''
}

// Resize Observer
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  nextTick(() => {
    updateMetrics()
    if (contentRef.value) {
      resizeObserver = new ResizeObserver(() => {
        updateMetrics()
      })
      resizeObserver.observe(contentRef.value)
      // Also observe children to detect content size changes
      Array.from(contentRef.value.children).forEach(child => {
        resizeObserver?.observe(child)
      })
    }
  })
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
  if (scrollTimeout) clearTimeout(scrollTimeout)
  if (resizeObserver) resizeObserver.disconnect()
})
</script>

<template>
  <div 
    class="scrollbar-wrapper" 
    ref="scrollContainerRef" 
    :style="{ height: height || '100%', maxHeight: maxHeight }"
  >
    <!-- Viewport -->
    <div 
      class="scrollbar-content" 
      ref="contentRef"
      @scroll="onScroll"
    >
      <slot />
    </div>

    <!-- Vertical Track -->
    <div 
      v-if="showVertical" 
      class="scrollbar-track-y"
      :class="{ visible: isScrolling || isDraggingY }"
      :style="{ bottom: showHorizontal ? '24px' : '0' }"
    >
      <div 
        class="scrollbar-thumb-y"
        :class="{ dragging: isDraggingY }"
        :style="{ height: `${thumbHeight}px`, transform: `translateY(${thumbTop}px)` }"
        @mousedown="onMouseDownY"
      ></div>
    </div>

    <!-- Horizontal Track -->
    <div 
      v-if="showHorizontal" 
      class="scrollbar-track-x"
      :class="{ visible: isScrolling || isDraggingX }"
      :style="{ right: showVertical ? '24px' : '0' }"
    >
      <div 
        class="scrollbar-thumb-x"
        :class="{ dragging: isDraggingX }"
        :style="{ width: `${thumbWidth}px`, transform: `translateX(${thumbLeft}px)` }"
        @mousedown="onMouseDownX"
      ></div>
    </div>
  </div>
</template>

<style scoped lang="sass">
.scrollbar-wrapper
  position: relative
  overflow: hidden
  display: flex
  flex-direction: column

.scrollbar-content
  flex: 1
  overflow: auto
  scrollbar-width: none /* Firefox */
  -ms-overflow-style: none /* IE/Edge */
  height: 100%

.scrollbar-content::-webkit-scrollbar
  display: none /* Chrome/Safari/Webkit */

/* Tracks */
.scrollbar-track-y
  position: absolute
  top: 4px
  right: 2px
  width: 10px
  z-index: 99999
  user-select: none
  opacity: 0
  transition: opacity 0.3s ease
  display: flex
  justify-content: center

.scrollbar-track-y:hover,
.scrollbar-track-y.visible
  opacity: 1

.scrollbar-track-x
  position: absolute
  left: 4px
  bottom: 2px
  height: 10px
  z-index: 99999
  user-select: none
  opacity: 0
  transition: opacity 0.3s ease
  display: flex
  align-items: center

.scrollbar-track-x:hover,
.scrollbar-track-x.visible
  opacity: 1

/* Thumbs */
.scrollbar-thumb-y
  width: 4px
  background: $color-surface-soft // Using theme var
  border-radius: 4px
  cursor: pointer
  transition: background 0.2s, width 0.2s
  position: relative

.scrollbar-thumb-x
  height: 4px
  background: $color-surface-soft // Using theme var
  border-radius: 4px
  cursor: pointer
  transition: background 0.2s, height 0.2s
  position: relative

/* Hover States */
.scrollbar-track-y:hover .scrollbar-thumb-y,
.scrollbar-thumb-y.dragging
  background: $color-primary
  width: 6px

.scrollbar-track-x:hover .scrollbar-thumb-x,
.scrollbar-thumb-x.dragging
  background: $color-primary
  height: 6px
</style>
