import { ref } from 'vue'

export interface RippleOptions {
  color?: string
  duration?: number
}

export function useRipple(options: RippleOptions = {}) {
  const ripples = ref<{ x: number; y: number; id: number; size: number }[]>([])
  let count = 0

  const addRipple = (event: MouseEvent) => {
    const target = event.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    
    const size = Math.max(rect.width, rect.height)
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2

    const id = count++
    ripples.value.push({ x, y, id, size })

    // Cleanup after animation
    const duration = options.duration || 700
    setTimeout(() => {
      ripples.value = ripples.value.filter(r => r.id !== id)
    }, duration)
  }

  return {
    ripples,
    addRipple
  }
}
