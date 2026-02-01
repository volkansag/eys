<template>
  <div class="container">
    <header class="header">
      <div class="user-bar">
        <span class="welcome-text">👋 Hoşgeldin, <strong>{{ user?.name }}</strong></span>
      </div>
      
      <h1>📚 Dashboard</h1>
      <p class="subtitle">Kullanıcı & Post Yönetimi</p>
    </header>

    <div class="content">
      <!-- Kullanıcılar Bölümü -->
      <section class="section users-section">
        <div class="section-header">
          <h2>👤 Kullanıcılar</h2>
          <span class="badge">{{ usersStore.users.length }}</span>
        </div>
        
        <UserForm 
          :user="editingUser" 
          @saved="handleUserSaved" 
          @cancel="editingUser = null"
        />
        
        <UserList 
          :selected-user="editingUser"
          @edit="editingUser = $event"
        />
      </section>

      <!-- Postlar Bölümü -->
      <section class="section posts-section">
        <div class="section-header">
          <h2>📝 Postlar</h2>
          <span class="badge">{{ postsStore.posts.length }}</span>
        </div>
        
        <PostForm 
          :post="editingPost" 
          @saved="handlePostSaved" 
          @cancel="editingPost = null"
        />
        
        <PostList 
          :selected-post="editingPost"
          @edit="editingPost = $event"
        />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User, Post } from '~~/shared/types'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const { user } = useUserSession()

const usersStore = useUsersStore()
const postsStore = usePostsStore()

const editingUser = ref<User | null>(null)
const editingPost = ref<Post | null>(null)

// Sayfa yüklendiğinde verileri çek
onMounted(async () => {
  await Promise.all([
    usersStore.fetchUsers(),
    postsStore.fetchPosts()
  ])
})

function handleUserSaved() {
  editingUser.value = null
  // Kullanıcı güncellendiğinde postları da yenile (yazar bilgisi için)
  postsStore.fetchPosts()
}

function handlePostSaved() {
  editingPost.value = null
  // Post güncellendiğinde kullanıcıları da yenile (post sayısı için)
  usersStore.fetchUsers()
}
</script>



<style scoped lang="sass">
.container
  /* max-width handled by layout */
  /* padding handled by layout */
  width: 100%

.header
  text-align: center
  margin-bottom: 3rem
  h1
    font-size: 2.5rem
    font-weight: 700
    background: linear-gradient(135deg, #00d4ff, #a29bfe)
    background-clip: text
    -webkit-background-clip: text
    -webkit-text-fill-color: transparent
    margin-bottom: 0.5rem

.subtitle
  color: rgba(255, 255, 255, 0.6)
  font-size: 1.1rem

.content
  display: grid
  grid-template-columns: 1fr 1fr
  gap: 2rem
  @media (max-width: 1200px)
    grid-template-columns: 1fr

.section
  background: rgba(255, 255, 255, 0.03)
  border-radius: 16px
  padding: 1.5rem
  border: 1px solid rgba(255, 255, 255, 0.05)

.section-header
  display: flex
  align-items: center
  gap: 1rem
  margin-bottom: 1.5rem
  h2
    font-size: 1.5rem
    font-weight: 600

.badge
  display: inline-flex
  align-items: center
  justify-content: center
  min-width: 28px
  height: 28px
  padding: 0 0.5rem
  background: rgba(0, 212, 255, 0.2)
  color: #00d4ff
  border-radius: 14px
  font-size: 0.9rem
  font-weight: 600

.users-section .badge
  background: rgba(0, 184, 148, 0.2)
  color: #00b894

.posts-section .badge
  background: rgba(108, 92, 231, 0.2)
  color: #a29bfe

.user-bar
  display: flex
  justify-content: flex-end
  align-items: center
  gap: 1rem
  padding: 1rem 0
  margin-bottom: 2rem
  border-bottom: 1px solid rgba(255, 255, 255, 0.1)

.welcome-text
  color: rgba(255, 255, 255, 0.8)
  font-size: 0.95rem

.logout-btn
  background: rgba(239, 68, 68, 0.1)
  color: #ef4444
  border: 1px solid rgba(239, 68, 68, 0.2)
  padding: 0.5rem 1rem
  border-radius: 8px
  cursor: pointer
  transition: all 0.2s
  font-size: 0.9rem
  font-weight: 500
  &:hover
    background: rgba(239, 68, 68, 0.2)
    transform: translateY(-1px)
</style>
