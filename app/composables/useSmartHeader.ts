import type { Directive } from 'vue'

const normalizeUpDown = (t: any) => {
  return t === Object(t) ? t : { down: t, up: t }
}

const getScrollParent = (node: HTMLElement): HTMLElement | Window => {
  if (!node) return window
  
  const isScrollable = (el: HTMLElement) => {
    const style = window.getComputedStyle(el)
    const overflow = style.overflowY || style.overflow
    return ['auto', 'scroll', 'overlay'].includes(overflow)
  }

  let parent = node.parentElement
  while (parent) {
    if (parent.tagName === 'BODY') return window
    if (isScrollable(parent)) return parent
    parent = parent.parentElement
  }
  
  return window
}

const createScroller = (element: HTMLElement | Window) => {
  const isWindow = element === window;

  return {
    scrollY: () => (isWindow ? window.scrollY : (element as HTMLElement).scrollTop),
    height: () => (isWindow ? window.innerHeight : (element as HTMLElement).offsetHeight),
    scrollHeight: () =>
      isWindow ? document.documentElement.scrollHeight : (element as HTMLElement).scrollHeight
  };
}

export const useSmartHeader = (options: any = {}) => {
  const { classes: userClasses = {}, ...headerOptions } = options

  const classes = {
    initial: 'sh-init',
    pinned: 'sh-pinned',
    unpinned: 'sh-unpinned',
    top: 'sh-top',
    notTop: 'sh-non-top',
    bottom: 'sh-bottom',
    notBottom: 'sh-non-bottom',
    frozen: 'sh-frozen',
    ...userClasses
  }

  // Reactive state
  const state = reactive({
    pinned: false,
    unpinned: false,
    top: true,
    notTop: false,
    bottom: false,
    notBottom: true,
    frozen: false,
    initial: false
  })

  const updateState = (key: keyof typeof state, value: boolean) => {
    state[key] = value
  }

  // Actions
  const pin = () => {
    if (state.unpinned) {
      updateState('pinned', true)
      updateState('unpinned', false)
    }
  }

  const unpin = () => {
    if (state.pinned || !state.unpinned) {
      updateState('unpinned', true)
      updateState('pinned', false)
    }
  }

  const top = () => {
    if (!state.top) {
      updateState('top', true)
      updateState('notTop', false)
    }
  }

  const notTop = () => {
    if (!state.notTop) {
      updateState('notTop', true)
      updateState('top', false)
    }
  }

  const bottom = () => {
    if (!state.bottom) {
      updateState('bottom', true)
      updateState('notBottom', false)
    }
  }

  const notBottom = () => {
    if (!state.notBottom) {
      updateState('notBottom', true)
      updateState('bottom', false)
    }
  }

  const directive: Directive = {
    mounted(el: HTMLElement) {
      let scrollerElement = headerOptions.scroller
    
      // Auto-detect scroller from the bound element
      if (!scrollerElement) {
        scrollerElement = getScrollParent(el)
      }
      
      const scroller = createScroller(scrollerElement)

      const tolerance = normalizeUpDown(headerOptions.tolerance || 0)
      const offset = normalizeUpDown(headerOptions.offset || 0)

      updateState('initial', true)

      // Scroll Tracking Logic
      let lastScrollY = scroller.scrollY()
      let rafId: number
      let scrolled = false
      const details: any = {}

      const update = () => {
        const scrollY = Math.round(scroller.scrollY())
        const height = scroller.height()
        const scrollHeight = scroller.scrollHeight()

        // reuse object for less memory churn
        details.scrollY = scrollY
        details.lastScrollY = lastScrollY
        details.direction = scrollY > lastScrollY ? 'down' : 'up'
        details.distance = Math.abs(scrollY - lastScrollY)
        details.isOutOfBounds = scrollY < 0 || scrollY + height > scrollHeight
        // @ts-ignore
        details.top = scrollY <= offset[details.direction]
        details.bottom = scrollY + height >= scrollHeight
        // @ts-ignore
        details.toleranceExceeded = details.distance > tolerance[details.direction]

        // State update logic
        if (!details.isOutOfBounds && !state.frozen) {
          if (details.top) top()
          else notTop()

          if (details.bottom) bottom()
          else notBottom()

          let shouldUnpin = details.direction === 'down' && !details.top && details.toleranceExceeded
          let shouldPin = (details.direction === 'up' && details.toleranceExceeded) || details.top

          if (shouldUnpin) unpin()
          else if (shouldPin) pin()
        }

        lastScrollY = scrollY
        scrolled = false
      }

      const handleScroll = () => {
        if (!scrolled) {
          scrolled = true
          rafId = requestAnimationFrame(update)
        }
      }

      const eventOptions = { passive: true, capture: false }
      
      // Attach listener
      scrollerElement.addEventListener('scroll', handleScroll, eventOptions)
      update()

      // Store cleanup function on element to access it in unmount
      ;(el as any)._smartHeaderCleanup = () => {
        cancelAnimationFrame(rafId)
        scrollerElement.removeEventListener('scroll', handleScroll, eventOptions)
      }
    },
    beforeUnmount(el: HTMLElement) {
       if ((el as any)._smartHeaderCleanup) {
         (el as any)._smartHeaderCleanup()
       }
    }
  }

  return {
    state,
    classes,
    vSmartHeader: directive,
    pin,
    unpin,
    freeze: () => updateState('frozen', true),
    unfreeze: () => updateState('frozen', false)
  }
}
