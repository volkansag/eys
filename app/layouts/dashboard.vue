<template>
  <div class="dashboard-layout">
    <SmartHeader />
    <Drawer v-model="isDrawerOpen" title="Menü" @close="isDrawerOpen = false">
      <nav class="drawer-nav">
        <ul>
          <li>
            <NuxtLink to="/dashboard" @click="isDrawerOpen = false">
              <span class="icon">📊</span> Dashboard
            </NuxtLink>
          </li>
          <li class="separator"></li>
          <li>
            <button @click="logout" class="logout-link">
              <span class="icon">🚪</span> Çıkış Yap
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
import SmartHeader from '~/components/commons/SmartHeader.vue'
import Drawer from '~/components/commons/Drawer.vue'
import { useDrawerState } from '~/composables/useDrawerState'

const isDrawerOpen = useDrawerState()
const { clear } = useUserSession()
const router = useRouter()

const logout = async () => {
  await clear()
  isDrawerOpen.value = false
  router.push('/')
}
</script>

<style scoped>
.dashboard-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%);
  color: #fff;
}

.dashboard-main {
  flex: 1;
  padding-top: 90px; /* Accounts for SmartHeader height ~80-90px */
}

.dashboard-content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.drawer-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.drawer-nav li {
  margin-bottom: 4px;
}

.drawer-nav a, .drawer-nav button {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  text-decoration: none;
  color: #333; /* Default text color, adjust if using dark mode */
  border-radius: 8px;
  transition: background-color 0.2s;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1rem;
  text-align: left;
}

.drawer-nav a:hover, .drawer-nav button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.drawer-nav a.router-link-active {
  background-color: #eef2ff;
  color: #4f46e5;
  font-weight: 500;
}

.icon {
  font-size: 1.2rem;
}

.separator {
  height: 1px;
  background-color: #eee;
  margin: 8px 16px;
}

.logout-link {
  color: #ef4444;
}

.logout-link:hover {
  background-color: #fef2f2;
}
</style>
