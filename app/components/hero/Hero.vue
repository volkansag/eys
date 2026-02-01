<template>
  <div class="hero-container">
    <!-- Canvas Animation Layer -->
    <canvas ref="canvasRef" class="canvas-layer"></canvas>

    <div class="hero-content">
      <div class="hero-grid">
        <div class="hero-visual">
          <GlobeNetwork />
        </div>
        <div class="hero-text">
          <h1 class="title">EYS Yönetim Paneli</h1>
          <p class="subtitle">Modern, Hızlı ve Güvenli İçerik Yönetimi</p>
          
          <div v-if="loggedIn" class="actions">
            <p class="welcome-msg">Tekrar hoşgeldin, {{ user?.name }}!</p>
            <NuxtLink to="/dashboard" custom v-slot="{ navigate }">
              <UiButtonPrimaryButton @click="navigate">
                Panele Git <ArrowRight :size="20" />
              </UiButtonPrimaryButton>
            </NuxtLink>
            <UiButtonSecondaryButton @click="handleLogout">
              <LogOut :size="20" /> Çıkış Yap
            </UiButtonSecondaryButton>
          </div>
          
          <div v-else class="actions">
            <NuxtLink to="/login" custom v-slot="{ navigate }">
              <UiButtonPrimaryButton @click="navigate">Giriş Yap</UiButtonPrimaryButton>
            </NuxtLink>
            <NuxtLink to="/register" custom v-slot="{ navigate }">
              <UiButtonSecondaryButton @click="navigate">Kayıt Ol</UiButtonSecondaryButton>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight, LogOut } from 'lucide-vue-next'
import { onMounted, onUnmounted, ref } from 'vue'
import GlobeNetwork from './GlobeNetwork.vue'

const { loggedIn, user, clear } = useUserSession()

const handleLogout = async () => {
  await clear()
  await navigateTo('/')
}

// --- Canvas Animation Setup ---
const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationId: number
let particles: Particle[] = []
const PARTICLE_COUNT = 60
const CONNECTION_DISTANCE = 150

class Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  canvasWidth: number
  canvasHeight: number

  constructor(w: number, h: number) {
    this.canvasWidth = w
    this.canvasHeight = h
    this.x = Math.random() * w
    this.y = Math.random() * h
    this.vx = (Math.random() - 0.5) * 0.4 // Slow speed
    this.vy = (Math.random() - 0.5) * 0.4 // Slow speed
    this.size = Math.random() * 2 + 1
  }

  update() {
    this.x += this.vx
    this.y += this.vy

    // Bounce off edges
    if (this.x < 0 || this.x > this.canvasWidth) this.vx *= -1
    if (this.y < 0 || this.y > this.canvasHeight) this.vy *= -1
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(141, 63, 208, 0.4)' // Using Primary Purple #8D3FD0
    ctx.fill()
  }
}

const initCanvas = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const resize = () => {
    canvas.width = canvas.parentElement?.clientWidth || window.innerWidth
    canvas.height = canvas.parentElement?.clientHeight || 600
    particles = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle(canvas.width, canvas.height))
    }
  }
  
  window.addEventListener('resize', resize)
  resize()

  const animate = () => {
    if (!canvas || !ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw Particles & Connections
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i]
      if (!p1) continue
      p1.update()
      p1.draw(ctx)
      
      for (let j = i; j < particles.length; j++) {
        const p2 = particles[j]
        if (!p2) continue
        const dx = p1.x - p2.x
        const dy = p1.y - p2.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < CONNECTION_DISTANCE) {
          ctx.beginPath()
          const opacity = 1 - (distance / CONNECTION_DISTANCE)
          ctx.strokeStyle = `rgba(141, 63, 208, ${opacity * 0.15})` // Primary Purple #8D3FD0
          ctx.lineWidth = 1
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.stroke()
        }
      }
    }
    animationId = requestAnimationFrame(animate)
  }
  animate()
  
  return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
  }
}

let cleanupCanvas: (() => void) | undefined

onMounted(() => {
  cleanupCanvas = initCanvas()
})

onUnmounted(() => {
  if (cleanupCanvas) cleanupCanvas()
})
</script>

<style scoped lang="sass">
@use "~/assets/sass/shared/_colors.sass" as *

.hero-container
  position: relative
  min-height: 100vh // Ensure it takes full height for canvas
  display: flex
  align-items: center
  justify-content: center
  overflow: hidden

.canvas-layer
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
  z-index: 0
  pointer-events: none

.hero-content
  width: 100%
  max-width: 1400px
  margin: 0 auto
  padding: 0 2rem
  position: relative
  z-index: 1

.hero-grid
  display: flex
  align-items: center
  justify-content: center
  gap: 4rem
  min-height: 80vh

.hero-visual
  flex: 1
  display: flex
  justify-content: center
  align-items: center

.hero-text
  flex: 1
  text-align: center
  display: flex
  flex-direction: column
  align-items: center

.title
  font-size: 4.5rem
  font-weight: 800
  margin-bottom: 1.5rem
  color: $light-text-header
  line-height: 1.1
  letter-spacing: -0.02em

.subtitle
  font-size: 1.25rem
  color: $light-text-muted
  margin-bottom: 2.5rem
  font-weight: 400
  line-height: 1.6
  max-width: 600px
  margin-left: auto
  margin-right: auto

.actions
  display: flex
  justify-content: center
  gap: 1rem
  align-items: center
  flex-wrap: wrap

.welcome-msg
  width: 100%
  margin-bottom: 1.5rem
  font-size: 1.1rem
  color: $light-primary
  font-weight: 600

@media (max-width: 1024px)
  .hero-grid
    flex-direction: column
    text-align: center
    gap: 2rem
    padding-top: 4rem
  
  .hero-visual
    order: -1
    
  .title
    font-size: 3rem
</style>
