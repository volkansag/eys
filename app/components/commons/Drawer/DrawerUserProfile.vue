<template>
  <div class="user-profile">
    <div class="avatar-container">
      <div class="avatar">
        <img
          v-if="(user as any)?.avatar"
          :src="(user as any).avatar"
          alt="User Avatar"
        />
        <div v-else class="avatar-placeholder">
          {{ userInitial }}
        </div>
      </div>
      <button class="edit-btn" title="Edit Profile">
        <span class="icon">✏️</span>
      </button>
    </div>

    <div class="user-info">
      <h3 class="user-name">{{ userName }}</h3>
      <div class="user-status">
        <span class="status-icon">👑</span>
        <span class="status-text">Premium Üye • Lv. 1</span>
      </div>
    </div>

    <div class="user-stats">
      <div class="stat-item">
        <span class="stat-icon">📅</span>
        <div class="stat-details">
          <span class="stat-value">{{ joinedDate }}</span>
          <span class="stat-label">Katılım</span>
        </div>
      </div>
      <div class="stat-item">
        <span class="stat-icon">⭐</span>
        <div class="stat-details">
          <span class="stat-value">5.0</span>
          <span class="stat-label">Puan</span>
        </div>
      </div>
      <div class="stat-item">
        <span class="stat-icon">📝</span>
        <div class="stat-details">
          <span class="stat-value">0</span>
          <span class="stat-label">Post</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user } = useUserSession();

const userName = computed(() => user.value?.name || "Misafir Kullanıcı");
const userInitial = computed(() => userName.value.charAt(0).toUpperCase());
const joinedDate = computed(() => {
  // Simple mock date for now
  return new Date().toLocaleDateString("tr-TR", {
    month: "2-digit",
    year: "numeric",
  });
});
</script>

<style scoped lang="sass">
@use "sass:color"
@use "~/assets/sass/shared/_colors.sass" as *

.user-profile
  display: flex
  flex-direction: column
  align-items: center
  padding: 0 20px 24px
  margin-top: -40px
  position: relative
  z-index: 2

.avatar-container
  position: relative
  margin-bottom: 16px

.avatar
  width: 90px
  height: 90px
  border-radius: 24px
  background: white
  padding: 4px
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1)
  overflow: hidden

  img
    width: 100%
    height: 100%
    object-fit: cover
    border-radius: 20px

.avatar-placeholder
  width: 100%
  height: 100%
  background: linear-gradient(135deg, $light-primary, $light-secondary)
  color: white
  display: flex
  align-items: center
  justify-content: center
  font-size: 2rem
  font-weight: 700
  border-radius: 20px

.edit-btn
  position: absolute
  top: 0
  right: -10px
  width: 28px
  height: 28px
  border-radius: 50%
  background: white
  border: none
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1)
  display: flex
  align-items: center
  justify-content: center
  cursor: pointer
  font-size: 12px
  transition: transform 0.2s

  &:hover
    transform: scale(1.1)

.user-info
  text-align: center
  margin-bottom: 24px

.user-name
  font-size: 1.25rem
  font-weight: 700
  color: $light-text-primary
  margin: 0 0 4px 0
  letter-spacing: -0.02em

.user-status
  display: flex
  align-items: center
  justify-content: center
  gap: 6px
  background: rgba($color-warning, 0.1)
  padding: 4px 12px
  border-radius: 20px

  .status-icon
    font-size: 12px

  .status-text
    font-size: 0.75rem
    font-weight: 600
    color: color.adjust($color-warning, $lightness: -15%)

.user-stats
  display: flex
  width: 100%
  justify-content: space-between
  padding: 16px
  background: white
  border-radius: 20px
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05)
  border: 1px solid rgba($light-border, 0.5)

.stat-item
  display: flex
  flex-direction: column
  align-items: center
  gap: 4px
  flex: 1

  &:not(:last-child)
    border-right: 1px solid rgba($light-border, 0.5)

.stat-icon
  font-size: 1.1rem

.stat-details
  display: flex
  flex-direction: column
  align-items: center

.stat-value
  font-size: 0.85rem
  font-weight: 700
  color: $light-text-primary

.stat-label
  font-size: 0.65rem
  font-weight: 500
  color: $light-text-secondary
  text-transform: uppercase
</style>
