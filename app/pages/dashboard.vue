<template>
  <div class="container">
    <header class="header">
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

        <UserList :selected-user="editingUser" @edit="editingUser = $event" />
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

        <PostList :selected-post="editingPost" @edit="editingPost = $event" />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User, Post } from "~~/shared/types";

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

const { user } = useUserSession();

const usersStore = useUsersStore();
const postsStore = usePostsStore();

const editingUser = ref<User | null>(null);
const editingPost = ref<Post | null>(null);

// Sayfa yüklendiğinde verileri çek
onMounted(async () => {
  await Promise.all([usersStore.fetchUsers(), postsStore.fetchPosts()]);
});

function handleUserSaved() {
  editingUser.value = null;
  // Kullanıcı güncellendiğinde postları da yenile (yazar bilgisi için)
  postsStore.fetchPosts();
}

function handlePostSaved() {
  editingPost.value = null;
  // Post güncellendiğinde kullanıcıları da yenile (post sayısı için)
  usersStore.fetchUsers();
}
</script>

<style scoped lang="sass">
@use "~/assets/sass/shared/_colors.sass" as *

.container
  width: 100%

.header
  text-align: center
  margin-bottom: 3rem
  h1
    font-size: 2.5rem
    font-weight: 700
    background: linear-gradient(135deg, $light-primary, $light-secondary)
    background-clip: text
    -webkit-background-clip: text
    -webkit-text-fill-color: transparent
    margin-bottom: 0.5rem

.subtitle
  color: $light-text-secondary
  font-size: 1.1rem

.content
  display: grid
  grid-template-columns: 1fr 1fr
  gap: 2rem
  @media (max-width: 1200px)
    grid-template-columns: 1fr

.section
  background: white
  border-radius: 16px
  padding: 1.5rem
  border: 1px solid $light-border
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04)

.section-header
  display: flex
  align-items: center
  gap: 1rem
  margin-bottom: 1.5rem
  h2
    font-size: 1.5rem
    font-weight: 600
    color: $light-text-primary

.badge
  display: inline-flex
  align-items: center
  justify-content: center
  min-width: 28px
  height: 28px
  padding: 0 0.5rem
  background: rgba($light-secondary, 0.15)
  color: $light-secondary
  border-radius: 14px
  font-size: 0.9rem
  font-weight: 600

.users-section .badge
  background: rgba($light-primary, 0.15)
  color: $light-primary

.posts-section .badge
  background: rgba($light-secondary, 0.15)
  color: $light-secondary
</style>
