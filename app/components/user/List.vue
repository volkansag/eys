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
        <div class="col-name">{{ user.name || "-" }}</div>
        <div class="col-email">{{ user.email }}</div>
        <div class="col-posts">{{ user.posts?.length || 0 }}</div>
        <div class="col-actions">
          <button
            class="btn-icon edit"
            @click="emit('edit', user)"
            title="Düzenle"
          >
            <Pencil :size="16" />
          </button>
          <button
            class="btn-icon delete"
            @click="handleDelete(user.id)"
            title="Sil"
          >
            <Trash2 :size="16" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from "~~/shared/types";
import { Pencil, Trash2 } from "lucide-vue-next";

defineProps<{
  selectedUser?: User | null;
}>();

const emit = defineEmits<{
  edit: [user: User];
}>();

const usersStore = useUsersStore();
const users = computed(() => usersStore.users);
const loading = computed(() => usersStore.loading);
const error = computed(() => usersStore.error);

async function handleDelete(id: number) {
  if (
    confirm(
      "Bu kullanıcıyı silmek istediğinize emin misiniz? Tüm postları da silinecek.",
    )
  ) {
    await usersStore.deleteUser(id);
  }
}
</script>

<style scoped lang="sass">
@use "~/assets/sass/shared/_colors.sass" as *

.user-list
  background: white
  border-radius: 12px
  padding: 1rem
  overflow: hidden
  border: 1px solid $light-border
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05)

.loading, .error, .empty
  text-align: center
  padding: 2rem
  color: $light-text-muted

.error
  color: $color-error

.grid-table
  display: grid
  gap: 0.5rem

.grid-header, .grid-row
  display: grid
  grid-template-columns: 60px 1fr 1.5fr 80px 100px
  gap: 1rem
  padding: 0.75rem 1rem
  align-items: center

.grid-header
  background: $light-bg
  border-radius: 8px
  font-weight: 600
  color: $light-text-primary
  font-size: 0.85rem
  text-transform: uppercase

.grid-row
  background: transparent
  border-radius: 8px
  border-bottom: 1px solid $light-border
  color: $light-text-primary
  transition: all 0.2s

  &:last-child
    border-bottom: none

  &:hover
    background: rgba($light-primary, 0.04)

  &.selected
    background: rgba($light-primary, 0.08)
    border: 1px solid rgba($light-primary, 0.2)

.col-id
  color: $light-text-muted
  font-size: 0.9rem

.col-posts
  text-align: center

.col-actions
  display: flex
  gap: 0.5rem
  justify-content: flex-end

.btn-icon
  width: 32px
  height: 32px
  border: none
  border-radius: 6px
  cursor: pointer
  transition: all 0.2s
  font-size: 0.9rem
  display: flex
  align-items: center
  justify-content: center
  background: $light-bg
  color: $light-text-primary

  &.edit
    color: $light-primary
    &:hover
      background: rgba($light-primary, 0.1)

  &.delete
    color: $color-error
    &:hover
      background: rgba($color-error, 0.1)
</style>
