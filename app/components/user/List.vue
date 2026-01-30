<template>
  <div class="user-list">
    <div v-if="loading" class="loading">Yükleniyor...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="users.length === 0" class="empty">Henüz kullanıcı yok</div>
    <div v-else class="grid-table">
      <div class="grid-header">
        <div class="col-id">ID</div>
        <div class="col-name">İsim</div>
        <div class="col-email">E-posta</div>
        <div class="col-posts">Postlar</div>
        <div class="col-actions">İşlemler</div>
      </div>
      <div 
        v-for="user in users" 
        :key="user.id" 
        class="grid-row"
        :class="{ selected: selectedUser?.id === user.id }"
      >
        <div class="col-id">{{ user.id }}</div>
        <div class="col-name">{{ user.name || '-' }}</div>
        <div class="col-email">{{ user.email }}</div>
        <div class="col-posts">{{ user.posts?.length || 0 }}</div>
        <div class="col-actions">
          <button class="btn-icon edit" @click="emit('edit', user)" title="Düzenle">
            <Pencil :size="16" />
          </button>
          <button class="btn-icon delete" @click="handleDelete(user.id)" title="Sil">
            <Trash2 :size="16" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '~~/shared/types'
import { Pencil, Trash2 } from 'lucide-vue-next'


defineProps<{
  selectedUser?: User | null
}>()

const emit = defineEmits<{
  edit: [user: User]
}>()

const usersStore = useUsersStore()
const users = computed(() => usersStore.users)
const loading = computed(() => usersStore.loading)
const error = computed(() => usersStore.error)

async function handleDelete(id: number) {
  if (confirm('Bu kullanıcıyı silmek istediğinize emin misiniz? Tüm postları da silinecek.')) {
    await usersStore.deleteUser(id)
  }
}
</script>

<style scoped>
.user-list {
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
  grid-template-columns: 60px 1fr 1.5fr 80px 100px;
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
  background: rgba(0, 212, 255, 0.15);
  border: 1px solid rgba(0, 212, 255, 0.3);
}

.col-id {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
}

.col-posts {
  text-align: center;
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
  background: rgba(0, 212, 255, 0.2);
}

.btn-icon.edit:hover {
  background: rgba(0, 212, 255, 0.4);
}

.btn-icon.delete {
  background: rgba(225, 112, 85, 0.2);
}

.btn-icon.delete:hover {
  background: rgba(225, 112, 85, 0.4);
}
</style>
