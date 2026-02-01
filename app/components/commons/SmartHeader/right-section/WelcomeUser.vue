<script setup lang="ts">
const { user, loggedIn } = useUserSession();
</script>

<template>
  <div class="user-info">
    <div class="text-group">
      <span v-if="loggedIn && user" class="welcome-text">
        👋 Hoşgeldin, <strong>{{ user.name }}</strong>
      </span>
      <div class="status-wrapper">
        <div v-if="loggedIn" class="status-indicator">
          <span class="pulse-dot"></span>
          <span class="pulse-ring"></span>
        </div>
        <span class="user-status">
          {{ loggedIn ? "Çevrimiçi" : "Misafir" }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
@use "~/assets/sass/shared/_colors.sass" as *

.user-info
  display: flex
  align-items: center
  user-select: none
  font-family: 'Inter', sans-serif

.text-group
  display: flex
  flex-direction: column
  align-items: flex-end
  line-height: 1.4

.welcome-text
  font-size: 13px
  color: $light-text-secondary
  strong
    color: $light-text-primary
    font-weight: 600

.status-wrapper
  display: flex
  align-items: center
  gap: 6px

.status-indicator
  position: relative
  width: 8px
  height: 8px
  display: flex
  align-items: center
  justify-content: center

.pulse-dot
  width: 6px
  height: 6px
  background-color: $color-success
  border-radius: 50%
  z-index: 2

.pulse-ring
  position: absolute
  width: 100%
  height: 100%
  background-color: $color-success
  border-radius: 50%
  opacity: 0.6
  animation: radar-pulse 2s infinite ease-out
  z-index: 1

@keyframes radar-pulse
  0%
    transform: scale(1)
    opacity: 0.6
  100%
    transform: scale(3)
    opacity: 0

.user-status
  font-size: 11px
  font-weight: 500
  color: $light-text-muted
  letter-spacing: 0.5px
</style>
