import { onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'

export function useClickOutside(elementRef: Ref<HTMLElement | null>, callback: () => void) {
  const handleClickOutside = (event: MouseEvent) => {
    const path = event.composedPath()
    const isClickOutside = elementRef.value && !path.includes(elementRef.value)
    
    if (isClickOutside) {
      callback()
    }
  }

  onMounted(() => {
    window.addEventListener('click', handleClickOutside)
  })

  onUnmounted(() => {
    window.removeEventListener('click', handleClickOutside)
  })
}
