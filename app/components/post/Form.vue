<template>
  <div class="post-form">
    <h3>{{ editMode ? 'Post Düzenle' : 'Yeni Post' }}</h3>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="author">Yazar</label>
        <select id="author" v-model="formData.authorId" required :disabled="editMode">
          <option value="" disabled>Yazar seçin</option>
          <option v-for="user in users" :key="user.id" :value="user.id">
            {{ user.name || user.email }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label for="title">Başlık</label>
        <input 
          id="title" 
          v-model="formData.title" 
          type="text" 
          placeholder="Post başlığı"
          required
        />
      </div>
      <div class="form-group">
        <label for="content">İçerik</label>
        <textarea 
          id="content" 
          v-model="formData.content" 
          placeholder="Post içeriği"
          rows="3"
        ></textarea>
      </div>
      <div class="form-group checkbox">
        <label>
          <input type="checkbox" v-model="formData.published" />
          <span>Yayınla</span>
        </label>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn-primary" :disabled="loading || !formData.authorId">
          {{ loading ? 'Kaydediliyor...' : (editMode ? 'Güncelle' : 'Ekle') }}
        </button>
        <button v-if="editMode" type="button" class="btn-secondary" @click="cancelEdit">
          İptal
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Post } from '~~/shared/types'

const props = defineProps<{
  post?: Post | null
}>()

const emit = defineEmits<{
  saved: []
  cancel: []
}>()

const usersStore = useUsersStore()
const postsStore = usePostsStore()

const users = computed(() => usersStore.users)
const loading = computed(() => postsStore.loading)
const editMode = computed(() => !!props.post)

const formData = ref({
  authorId: '' as number | '',
  title: '',
  content: '',
  published: false
})

watch(() => props.post, (newPost) => {
  if (newPost) {
    formData.value = {
      authorId: newPost.authorId,
      title: newPost.title,
      content: newPost.content || '',
      published: newPost.published
    }
  } else {
    formData.value = { authorId: '', title: '', content: '', published: false }
  }
}, { immediate: true })

async function handleSubmit() {
  if (!formData.value.authorId) return
  
  try {
    if (editMode.value && props.post) {
      await postsStore.updatePost(props.post.id, {
        title: formData.value.title,
        content: formData.value.content,
        published: formData.value.published
      })
    } else {
      await postsStore.createPost({
        authorId: formData.value.authorId as number,
        title: formData.value.title,
        content: formData.value.content,
        published: formData.value.published
      })
    }
    formData.value = { authorId: '', title: '', content: '', published: false }
    emit('saved')
  } catch (e) {
    console.error(e)
  }
}

function cancelEdit() {
  formData.value = { authorId: '', title: '', content: '', published: false }
  emit('cancel')
}
</script>

<style scoped>
.post-form {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.post-form h3 {
  margin: 0 0 1rem;
  color: #fff;
  font-size: 1.1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 1rem;
  font-family: 'Inter', sans-serif;
  transition: border-color 0.3s;
}

.form-group select {
  cursor: pointer;
}

.form-group select option {
  background: #1a1a2e;
  color: #fff;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #00d4ff;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.form-group.checkbox label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.form-group.checkbox input {
  width: auto;
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-primary {
  flex: 1;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  font-family: 'Inter', sans-serif;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(108, 92, 231, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  font-family: 'Inter', sans-serif;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
