<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import ChartTooltip from './ChartTooltip.vue'

const props = defineProps<{
  data: { label: string; shortLabel?: string; value: number; max: number; color?: string }[]
}>()

const sides = 6
const radius = 90 
const center = { x: 175, y: 175 }
const mounted = ref(false)

// Tooltip State
const tooltip = ref({
  visible: false,
  x: 0,
  y: 0,
  title: '',
  value: 0,
  max: 0
})

onMounted(() => {
  mounted.value = true
})

const getPoint = (index: number, value: number, max: number) => {
  const angle = (Math.PI * 2 * index) / sides - Math.PI / 2
  const r = (value / max) * radius
  const x = center.x + r * Math.cos(angle)
  const y = center.y + r * Math.sin(angle)
  return { x, y }
}

const gridDescs = [1, 0.8, 0.6, 0.4, 0.2]
const gridPolygons = computed(() => {
  if (!props.data || props.data.length === 0) return []
  return gridDescs.map((scale) => {
    const points = props.data.map((item, i) => {
      const max = props.data[0]?.max || 100
      const { x, y } = getPoint(i, max * scale, max)
      return `${x},${y}`
    }).join(' ')
    return { points, scale }
  })
})

const axisLines = computed(() => {
  if (!props.data) return []
  return props.data.map((item, i) => {
    const start = center
    const max = props.data[0]?.max || 100
    const end = getPoint(i, max, max)
    return { x1: start.x, y1: start.y, x2: end.x, y2: end.y }
  })
})

const dataPath = computed(() => {
  if (!mounted.value || !props.data) {
    return props.data?.map(() => `${center.x},${center.y}`).join(' ') || ''
  }
  return props.data.map((item, i) => {
    const { x, y } = getPoint(i, item.value, item.max)
    return `${x},${y}`
  }).join(' L ') + ' Z'
})

const labels = computed(() => {
  if (!props.data) return []
  return props.data.map((item, i) => {
    const max = props.data[0]?.max || 100 
    
    // Dynamic spacing: Vertical labels (0 and 3) don't need as much clearance as corner labels
    const isVertical = i === 0 || i === 3
    const multiplier = isVertical ? 1.15 : 1.25
    
    const { x, y } = getPoint(i, max * multiplier, max)
    return { 
      x, 
      y, 
      text: item.shortLabel || item.label
    }
  })
})

// Tooltip Handlers
const showTooltip = (e: MouseEvent, item: any) => {
  const index = props.data.indexOf(item)
  const point = getPoint(index, item.value, item.max)

  tooltip.value = {
    visible: true,
    x: point.x,
    y: point.y,
    title: item.label,
    value: item.value,
    max: item.max
  }
}

const hideTooltip = () => {
  tooltip.value.visible = false
}
</script>

<template>
  <div class="spider-chart-container">
    <div class="chart-wrapper">
      <ChartTooltip v-bind="tooltip" />
      
      <svg width="350" height="350" viewBox="0 0 350 350" class="spider-svg">
        <defs>
          <linearGradient id="poly-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#a78bfa" stop-opacity="0.5" /> 
            <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0.2" /> 
          </linearGradient>
        </defs>

        <!-- Grid -->
        <g class="grid-layer">
          <polygon 
            v-for="(grid, idx) in gridPolygons" 
            :key="idx" 
            :points="grid.points" 
            class="grid-polygon"
          />
        </g>

        <!-- Axis -->
        <g class="axis-layer">
          <line 
            v-for="(line, idx) in axisLines" 
            :key="idx" 
            :x1="line.x1" :y1="line.y1" :x2="line.x2" :y2="line.y2" 
            class="axis-line"
          />
        </g>

        <!-- Data Shape -->
        <path 
          v-if="dataPath"
          :d="'M ' + dataPath" 
          fill="url(#poly-fill)" 
          stroke="#8b5cf6" 
          stroke-width="3" 
          class="data-polygon"
        />

        <!-- Points & Hit Areas -->
        <g class="points-layer">
           <!-- Invisible larger circle for easier hovering -->
           <circle 
             v-for="(item, i) in data" 
             :key="'hit-' + i"
             :cx="getPoint(i, mounted ? item.value : 0, item.max).x" 
             :cy="getPoint(i, mounted ? item.value : 0, item.max).y" 
             r="15" 
             fill="transparent"
             class="hit-area"
             @mouseenter="showTooltip($event, item)"
             @mouseleave="hideTooltip"
           />
           <!-- Visible dot -->
           <circle 
             v-for="(item, i) in data" 
             :key="i"
             :cx="getPoint(i, mounted ? item.value : 0, item.max).x" 
             :cy="getPoint(i, mounted ? item.value : 0, item.max).y" 
             r="5" 
             fill="#8b5cf6"
             class="data-point"
             pointer-events="none" 
           />
        </g>
      </svg>
      
      <!-- Labels (No Values) -->
      <div v-for="(label, i) in labels" :key="i" class="chart-label" :style="{ left: label.x + 'px', top: label.y + 'px' }">
        <span class="label-text">{{ label.text }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
.spider-chart-container
  display: flex
  justify-content: center
  align-items: center
  padding: 1rem
  background: transparent 

.chart-wrapper
  position: relative
  width: 350px
  height: 350px

.spider-svg
  overflow: visible
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2))

.grid-polygon
  fill: none
  stroke: rgba(255, 255, 255, 0.2)
  stroke-width: 1

.axis-line
  stroke: rgba(255, 255, 255, 0.1)
  stroke-width: 1

.data-polygon
  filter: drop-shadow(0 0 2px rgba(139, 92, 246, 0.4))

.data-point
  stroke: #fff
  stroke-width: 2
  z-index: 10

.hit-area
  cursor: pointer
  pointer-events: all
  /* Ensure it captures events */

.chart-label
  position: absolute
  transform: translate(-50%, -50%) 
  display: flex
  flex-direction: column
  align-items: center
  text-align: center
  pointer-events: none
  z-index: 20
  
.label-text
  font-size: 0.85rem
  color: #e2e8f0
  font-weight: 700
  letter-spacing: 0.05em
  text-shadow: 0 1px 2px rgba(0,0,0,0.8)
</style>
