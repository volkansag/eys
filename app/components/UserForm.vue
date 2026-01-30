<template>
  <div class="user-form">
    <h3>{{ editMode ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı' }}</h3>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="name">İsim</label>
        <input 
          id="name" 
          v-model="formData.name" 
          type="text" 
          placeholder="İsim girin"
          required
        />
      </div>
      <div class="form-group">
        <label for="email">E-posta</label>
        <input 
          id="email" 
          v-model="formData.email" 
          type="email" 
          placeholder="E-posta girin"
          required
        />
      </div>
      <div class="form-actions">
        <button type="submit" class="btn-primary" :disabled="loading">
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
import type { User } from '~~/shared/types'

const props = defineProps<{
  user?: User | null
}>()

const emit = defineEmits<{
  saved: []
  cancel: []
}>()

const usersStore = useUsersStore()

const formData = ref({
  name: '',
  email: ''
})

const editMode = computed(() => !!props.user)
const loading = computed(() => usersStore.loading)

watch(() => props.user, (newUser) => {
  if (newUser) {
    formData.value = {
      name: newUser.name || '',
      email: newUser.email
    }
  } else {
    formData.value = { name: '', email: '' }
  }
}, { immediate: true })

async function handleSubmit() {
  try {
    if (editMode.value && props.user) {
      await usersStore.updateUser(props.user.id, formData.value)
    } else {
      await usersStore.createUser(formData.value)
    }
    formData.value = { name: '', email: '' }
    emit('saved')
  } catch (e) {
    console.error(e)
  }
}

function cancelEdit() {
  formData.value = { name: '', email: '' }
  emit('cancel')
}
</script>

<style scoped>
.user-form {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.user-form h3 {
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

.form-group input {
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

.form-group input:focus {
  outline: none;
  border-color: #00d4ff;
}

.form-group input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.form-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-primary {
  flex: 1;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #00b894, #00cec9);
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
  box-shadow: 0 5px 20px rgba(0, 184, 148, 0.4);
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
