<template>
  <div class="dashboard-layout">
    <SmartHeader />
    <Drawer title="Menü">
      <nav class="drawer-nav">
        <ul>
          <li>
            <NuxtLink to="/dashboard" @click="layoutStore.closeDrawer">
              <div class="link-content">
                <div class="icon-wrapper">📊</div>
                <span>Dashboard</span>
              </div>
            </NuxtLink>
          </li>
          <li>
            <button @click="logout" class="logout-link">
              <div class="link-content">
                <div class="icon-wrapper">🚪</div>
                <span>Çıkış Yap</span>
              </div>
            </button>
          </li>
        </ul>
      </nav>
    </Drawer>

    <main class="dashboard-main">
      <div class="dashboard-content-wrapper">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import SmartHeader from "~/components/commons/SmartHeader/SmartHeader.vue";
import Drawer from "~/components/commons/Drawer/Drawer.vue";

const layoutStore = useLayoutStore();
const { clear } = useUserSession();
const router = useRouter();

const logout = async () => {
  await clear();
  layoutStore.closeDrawer();
  router.push("/");
};
</script>

<style scoped lang="sass">
@use "sass:color"
@use "~/assets/sass/shared/_colors.sass" as *

.dashboard-layout
  min-height: 100vh
  display: flex
  flex-direction: column
  font-family: 'Inter', sans-serif
  background: #f8fbff
  color: $light-text-primary
  position: relative
  overflow: hidden

  &::before
    content: ''
    position: absolute
    top: -20%
    right: -10%
    width: 800px
    height: 800px
    background: radial-gradient(circle, rgba($light-secondary, 0.06) 0%, rgba(255,255,255,0) 70%)
    border-radius: 50%
    z-index: 0

  &::after
    content: ''
    position: absolute
    bottom: -10%
    left: -10%
    width: 600px
    height: 600px
    background: radial-gradient(circle, rgba($light-primary, 0.04) 0%, rgba(255,255,255,0) 70%)
    border-radius: 50%
    z-index: 0

.dashboard-main
  flex: 1
  padding-top: 90px
  position: relative
  z-index: 1

.dashboard-content-wrapper
  max-width: 1400px
  margin: 0 auto
  padding: 20px

.drawer-nav
  margin-top: 10px

  ul
    list-style: none
    padding: 0
    margin: 0

  li
    margin-bottom: 12px

  a, button
    display: flex
    align-items: center
    justify-content: space-between
    width: 100%
    padding: 14px 18px
    text-decoration: none
    color: $light-text-primary
    background: white
    border-radius: 16px
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)
    border: 1px solid rgba($light-border, 0.4)
    cursor: pointer
    font-size: 0.95rem
    font-weight: 600
    text-align: left
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03)

    &::after
      content: '›'
      font-size: 1.4rem
      color: rgba($light-text-secondary, 0.3)
      font-weight: 400
      transition: transform 0.3s ease

    &:hover
      transform: translateY(-2px)
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06)
      border-color: rgba($light-primary, 0.2)

      &::after
        color: $light-primary
        transform: translateX(4px)

    .link-content
      display: flex
      align-items: center
      gap: 14px

  .icon-wrapper
    width: 36px
    height: 36px
    display: flex
    align-items: center
    justify-content: center
    border-radius: 12px
    font-size: 1.1rem
    background: rgba($light-primary, 0.05)
    color: $light-primary

  a.router-link-active
    background: white
    border-color: $light-primary
    color: $light-primary
    box-shadow: 0 10px 25px rgba($light-primary, 0.08)

    .icon-wrapper
      background: $light-primary
      color: white

  .logout-link
    color: $color-error
    background: rgba($color-error, 0.02)
    border-color: rgba($color-error, 0.1)

    .icon-wrapper
      background: rgba($color-error, 0.08)
      color: $color-error

    &:hover
      background: white
      border-color: $color-error
      color: $color-error

      .icon-wrapper
        background: $color-error
        color: white
</style>
