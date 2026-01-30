/**
 * DPI Bazlı UI Ölçekleme Composable
 * 
 * window.devicePixelRatio değerini algılar ve CSS custom properties üzerinden
 * SASS mixinlerine aktarır. Reaktif olarak DPI değişikliklerini dinler.
 */

interface DpiConfig {
  /** Ölçekleme eşikleri */
  thresholds: Record<string, number>
  /** DPI seviyelerine göre ölçekleme faktörleri */
  scaleFactors: Record<string, number>
}

interface DpiState {
  /** Mevcut DPI oranı (window.devicePixelRatio) */
  dpiRatio: Readonly<Ref<number>>
  /** DPI seviyesi (1x, 1.25x, 1.5x, 2x, vb.) */
  dpiLevel: ComputedRef<string>
  /** Ölçekleme faktörü (0.6 - 1 arası) */
  scaleFactor: ComputedRef<number>
  /** Ters ölçekleme faktörü (1 / scaleFactor) */
  inverseScale: ComputedRef<number>
  /** Bir değeri ölçekle */
  scale: (value: number) => number
  /** Ölçeklenmiş değeri orijinaline çevir */
  unscale: (value: number) => number
  /** CSS custom properties'i manuel güncelle */
  refresh: () => void
  /** DPI sistemini başlat (plugin için) */
  init: () => void
}

const defaultConfig: DpiConfig = {
  thresholds: {
    '1x': 1,
    '1.25x': 1.25,
    '1.5x': 1.5,
    '2x': 2,
    '2.5x': 2.5,
    '3x': 3
  },
  scaleFactors: {
    '1x': 1,
    '1.25x': 0.9,
    '1.5x': 0.8,
    '2x': 0.75,
    '2.5x': 0.65,
    '3x': 0.6
  }
}

// Global state - tüm componentler arasında paylaşılır
const globalDpiRatio = ref(1)
const globalConfig = ref<DpiConfig>(defaultConfig)
let isInitialized = false
let mediaQueryCleanup: (() => void) | null = null

// DPI seviyesini belirle
function getDpiLevel(ratio: number): string {
  const thresholds = globalConfig.value.thresholds
  if (ratio >= (thresholds['3x'] ?? 3)) return '3x'
  if (ratio >= (thresholds['2.5x'] ?? 2.5)) return '2.5x'
  if (ratio >= (thresholds['2x'] ?? 2)) return '2x'
  if (ratio >= (thresholds['1.5x'] ?? 1.5)) return '1.5x'
  if (ratio >= (thresholds['1.25x'] ?? 1.25)) return '1.25x'
  return '1x'
}

// Computed değerler (global scope'ta)
const dpiLevel = computed(() => getDpiLevel(globalDpiRatio.value))
const scaleFactor = computed(() => globalConfig.value.scaleFactors[dpiLevel.value] ?? 1)
const inverseScale = computed(() => 1 / scaleFactor.value)

// CSS custom properties güncelle
function updateCssProperties() {
  if (!import.meta.client) return

  const root = document.documentElement
  root.style.setProperty('--dpi-ratio', globalDpiRatio.value.toString())
  root.style.setProperty('--dpi-scale', scaleFactor.value.toString())
  root.style.setProperty('--dpi-inverse', inverseScale.value.toString())
  root.style.setProperty('--dpi-level', `"${dpiLevel.value}"`)
}

// DPI değişikliklerini dinle
function setupDpiListener() {
  if (!import.meta.client || isInitialized) return

  globalDpiRatio.value = window.devicePixelRatio
  updateCssProperties()

  // matchMedia ile DPI değişikliklerini dinle
  let currentQuery: MediaQueryList | null = null

  const setupMediaQuery = () => {
    // Önceki listener'ı temizle
    if (currentQuery && mediaQueryCleanup) {
      mediaQueryCleanup()
    }

    // Yeni query oluştur
    currentQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`)
    
    const handleChange = () => {
      globalDpiRatio.value = window.devicePixelRatio
      updateCssProperties()
      // Yeni DPI için yeni media query oluştur
      setupMediaQuery()
    }

    currentQuery.addEventListener('change', handleChange)
    
    mediaQueryCleanup = () => {
      currentQuery?.removeEventListener('change', handleChange)
    }
  }

  setupMediaQuery()
  isInitialized = true
}

// Watch for scaleFactor changes to update CSS
watch(scaleFactor, () => {
  updateCssProperties()
})

/**
 * DPI ölçekleme composable'ı
 * 
 * @param config - Özel konfigürasyon (opsiyonel)
 * @returns DPI durumu ve yardımcı fonksiyonlar
 * 
 * @example
 * ```vue
 * <script setup lang="ts">
 * const { dpiRatio, dpiLevel, scale } = useDpi()
 * 
 * const iconSize = computed(() => `${scale(24)}px`)
 * </script>
 * ```
 */
export function useDpi(config: Partial<DpiConfig> = {}): DpiState {
  // Config'i merge et
  if (Object.keys(config).length > 0) {
    globalConfig.value = {
      thresholds: { ...defaultConfig.thresholds, ...config.thresholds },
      scaleFactors: { ...defaultConfig.scaleFactors, ...config.scaleFactors }
    }
  }

  // Yardımcı fonksiyonlar
  const scale = (value: number): number => value * scaleFactor.value
  const unscale = (value: number): number => value * inverseScale.value

  // Init fonksiyonu - plugin'den çağrılabilir
  const init = () => {
    setupDpiListener()
  }

  // Eğer component context'indeyse onMounted kullan
  if (getCurrentInstance()) {
    onMounted(() => {
      setupDpiListener()
    })
  }

  return {
    dpiRatio: readonly(globalDpiRatio),
    dpiLevel,
    scaleFactor,
    inverseScale,
    scale,
    unscale,
    refresh: updateCssProperties,
    init
  }
}
