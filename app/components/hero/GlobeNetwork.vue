<script setup lang="ts">
import { onMounted, ref } from 'vue'
</script>

<template>
  <div class="globe-wrapper">
    <!-- Concentric Circular Background matching Page BG -->
    <div class="globe-backdrop"></div>
    
    <div class="globe-system">
      <!-- Central Core -->
      <div class="core-node">
        <div class="core-inner"></div>
        <div class="core-pulse"></div>
      </div>

      <!-- Gyroscopic Rings -->
      <div class="gyro-ring ring-outer"></div>
      <div class="gyro-ring ring-middle"></div>
      <div class="gyro-ring ring-inner"></div>
      
      <!-- Connecting Dots/Nodes -->
      <div class="node node-1"></div>
      <div class="node node-2"></div>
      <div class="node node-3"></div>

      <!-- Floating Glass Cards (Simplified) -->
      <div class="glass-card card-top">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      </div>
      <div class="glass-card card-bottom">
         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
@use "~/assets/sass/shared/_colors.sass" as *

.globe-wrapper
  width: 500px
  height: 500px
  position: relative
  display: flex
  align-items: center
  justify-content: center
  // Pointer events allowed if we want interaction later, but normally none for bg graphics
  pointer-events: none

// Background Circle
.globe-backdrop
  position: absolute
  width: 420px
  height: 420px
  border-radius: 50%
  background-color: $light-bg
  // Subtle neuromorphic visual to make it stand out slightly from the canvas
  box-shadow: -10px -10px 30px #ffffff, 10px 10px 30px rgba(0,0,0,0.05)
  z-index: 0

.globe-system
  position: relative
  width: 300px
  height: 300px
  z-index: 2
  perspective: 1000px
  transform-style: preserve-3d

// --- Core ---
.core-node
  position: absolute
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
  width: 60px
  height: 60px
  z-index: 10

.core-inner
  width: 100%
  height: 100%
  border-radius: 50%
  background: $gradient-light-brand
  box-shadow: 0 0 20px rgba($light-primary, 0.4)

.core-pulse
  position: absolute
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
  width: 100%
  height: 100%
  border-radius: 50%
  border: 1px solid $light-primary
  opacity: 0
  animation: ripple 2s ease-out infinite

// --- Gyro Rings ---
.gyro-ring
  position: absolute
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
  border-radius: 50%
  border: 1px solid rgba($light-primary, 0.3)
  transform-style: preserve-3d
  
.ring-outer
  width: 280px
  height: 280px
  border-color: rgba($light-primary, 0.15)
  animation: gyro-spin-1 15s linear infinite

.ring-middle
  width: 220px
  height: 220px
  border-top-color: $light-secondary
  border-bottom-color: transparent
  border-left-color: rgba($light-secondary, 0.2)
  border-right-color: transparent
  animation: gyro-spin-2 10s linear infinite reverse

.ring-inner
  width: 160px
  height: 160px
  border: 2px solid rgba($light-primary, 0.1)
  border-left-color: $light-primary
  animation: gyro-spin-3 8s linear infinite

// --- Nodes ---
.node
  position: absolute
  background: $light-secondary
  border-radius: 50%
  width: 12px
  height: 12px
  box-shadow: 0 0 10px $light-secondary

.node-1
  top: 10%
  left: 50%
  animation: float-node 4s ease-in-out infinite

.node-2
  bottom: 20%
  right: 20%
  animation: float-node 5s ease-in-out infinite 1s

.node-3
  top: 40%
  left: 10%
  animation: float-node 6s ease-in-out infinite 0.5s

// --- Glass Cards ---
.glass-card
  position: absolute
  padding: 12px
  background: rgba(255, 255, 255, 0.6)
  backdrop-filter: blur(12px)
  -webkit-backdrop-filter: blur(12px)
  border: 1px solid rgba(255, 255, 255, 0.8)
  border-radius: 16px
  box-shadow: 0 8px 32px rgba(141, 63, 208, 0.1) // purple shadow
  color: $light-primary
  display: flex
  align-items: center
  justify-content: center
  animation: float-card 6s ease-in-out infinite

.card-top
  top: 0
  right: 0
  transform: translate(20px, -20px)

.card-bottom
  bottom: 20px
  left: -20px
  animation-delay: 1.5s

// --- Animations ---
@keyframes ripple
  0%
    width: 100%
    height: 100%
    opacity: 0.8
  100%
    width: 250%
    height: 250%
    opacity: 0

@keyframes gyro-spin-1
  from
    transform: translate(-50%, -50%) rotate3d(1, 1, 1, 0deg)
  to
    transform: translate(-50%, -50%) rotate3d(1, 1, 1, 360deg)

@keyframes gyro-spin-2
  from
    transform: translate(-50%, -50%) rotate3d(1, -1, 0, 0deg)
  to
    transform: translate(-50%, -50%) rotate3d(1, -1, 0, 360deg)

@keyframes gyro-spin-3
  from
    transform: translate(-50%, -50%) rotate3d(0, 1, 0, 0deg)
  to
    transform: translate(-50%, -50%) rotate3d(0, 1, 0, 360deg)

@keyframes float-node
  0%, 100%
    transform: translate(0, 0)
  50%
    transform: translate(10px, -15px)

@keyframes float-card
  0%, 100%
    transform: translateY(0)
  50%
    transform: translateY(-12px)
</style>
