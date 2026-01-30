<template>
  <div class="post-list">
    <div v-if="loading" class="loading">Yükleniyor...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="posts.length === 0" class="empty">Henüz post yok</div>
    <div v-else class="grid-table">
      <div class="grid-header">
        <div class="col-id">ID</div>
        <div class="col-title">Başlık</div>
        <div class="col-author">Yazar</div>
        <div class="col-status">Durum</div>
        <div class="col-actions">İşlemler</div>
      </div>
      <div 
        v-for="post in posts" 
        :key="post.id" 
        class="grid-row"
        :class="{ selected: selectedPost?.id === post.id }"
      >
        <div class="col-id">{{ post.id }}</div>
        <div class="col-title">
          <span class="title">{{ post.title }}</span>
          <span v-if="post.content" class="content-preview">{{ post.content }}</span>
        </div>
        <div class="col-author">{{ post.author?.name || post.author?.email || '-' }}</div>
        <div class="col-status">
          <span class="status-badge" :class="{ published: post.published }">
            {{ post.published ? 'Yayında' : 'Taslak' }}
          </span>
        </div>
        <div class="col-actions">
          <button class="btn-icon edit" @click="emit('edit', post)" title="Düzenle">
            <Pencil :size="16" />
          </button>
          <button class="btn-icon delete" @click="handleDelete(post.id)" title="Sil">
            <Trash2 :size="16" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Post } from '~~/shared/types'
import { Pencil, Trash2 } from 'lucide-vue-next'


defineProps<{
  selectedPost?: Post | null
}>()

const emit = defineEmits<{
  edit: [post: Post]
}>()

const postsStore = usePostsStore()
const posts = computed(() => postsStore.posts)
const loading = computed(() => postsStore.loading)
const error = computed(() => postsStore.error)

async function handleDelete(id: number) {
  if (confirm('Bu postu silmek istediğinize emin misiniz?')) {
    await postsStore.deletePost(id)
  }
}
</script>

<style scoped>
.post-list {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1rem;
  overflow: hidden;
}

.loading, .error, .empty {
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.6);
}

.error {
  color: #e17055;
}

.grid-table {
  display: grid;
  gap: 0.5rem;
}

.grid-header, .grid-row {
  display: grid;
  grid-template-columns: 60px 1.5fr 1fr 100px 100px;
  gap: 1rem;
  padding: 0.75rem 1rem;
  align-items: center;
}

.grid-header {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.85rem;
  text-transform: uppercase;
}

.grid-row {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  color: #fff;
  transition: all 0.2s;
}

.grid-row:hover {
  background: rgba(255, 255, 255, 0.08);
}

.grid-row.selected {
  background: rgba(108, 92, 231, 0.15);
  border: 1px solid rgba(108, 92, 231, 0.3);
}

.col-id {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
}

.col-title {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.col-title .title {
  font-weight: 500;
}

.col-title .content-preview {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
}

.status-badge.published {
  background: rgba(0, 184, 148, 0.2);
  color: #00b894;
}

.col-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon.edit {
  background: rgba(108, 92, 231, 0.2);
}

.btn-icon.edit:hover {
  background: rgba(108, 92, 231, 0.4);
}

.btn-icon.delete {
  background: rgba(225, 112, 85, 0.2);
}

.btn-icon.delete:hover {
  background: rgba(225, 112, 85, 0.4);
}
</style>
