<template>
  <div class="landing-container">
    <div class="hero">
      <h1 class="title">EYS Yönetim Paneli</h1>
      <p class="subtitle">Modern, Hızlı ve Güvenli İçerik Yönetimi</p>
      
      <div v-if="loggedIn" class="actions">
        <p class="welcome-msg">Tekrar hoşgeldin, {{ user?.name }}!</p>
        <NuxtLink to="/dashboard" class="primary-btn">
          Panele Git <ArrowRight :size="20" />
        </NuxtLink>
      </div>
      
      <div v-else class="actions">
        <NuxtLink to="/login" class="primary-btn">Giriş Yap</NuxtLink>
        <NuxtLink to="/register" class="secondary-btn">Kayıt Ol</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'

const { loggedIn, user } = useUserSession()
</script>

<style scoped lang="sass">
.landing-container
  min-height: 100vh
  display: flex
  align-items: center
  justify-content: center
  background: radial-gradient(circle at top right, #1a1a2e 0%, #0f0f1a 100%)
  color: white
  padding: 20px

.hero
  text-align: center
  max-width: 600px
  animation: fadeIn 0.8s ease-out

.title
  font-size: 3.5rem
  font-weight: 800
  margin-bottom: 1rem
  background: linear-gradient(135deg, #00d4ff 0%, #a29bfe 100%)
  background-clip: text
  -webkit-background-clip: text
  -webkit-text-fill-color: transparent
  line-height: 1.2

.subtitle
  font-size: 1.25rem
  color: rgba(255, 255, 255, 0.6)
  margin-bottom: 3rem
  font-weight: 300

.actions
  display: flex
  justify-content: center
  gap: 1.5rem
  align-items: center
  flex-wrap: wrap

.welcome-msg
  width: 100%
  margin-bottom: 1rem
  font-size: 1.1rem
  color: rgba(255, 255, 255, 0.9)

.primary-btn, .secondary-btn
  display: inline-flex
  align-items: center
  gap: 0.5rem
  padding: 12px 32px
  border-radius: 12px
  font-weight: 600
  text-decoration: none
  transition: all 0.3s ease
  font-size: 1.1rem

.primary-btn
  background: #4f46e5
  color: white
  box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3)
  &:hover
    background: #4338ca
    transform: translateY(-2px)
    box-shadow: 0 8px 20px rgba(79, 70, 229, 0.4)

.secondary-btn
  background: rgba(255, 255, 255, 0.1)
  color: white
  backdrop-filter: blur(10px)
  border: 1px solid rgba(255, 255, 255, 0.1)
  &:hover
    background: rgba(255, 255, 255, 0.15)
    transform: translateY(-2px)

@keyframes fadeIn
  from 
    opacity: 0
    transform: translateY(20px)
  to 
    opacity: 1
    transform: translateY(0)

@media (max-width: 600px)
  .title
    font-size: 2.5rem
</style>
