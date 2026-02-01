<template>
  <div class="user-form">
    <h3>{{ editMode ? "Kullanıcı Düzenle" : "Yeni Kullanıcı" }}</h3>
    <form @submit.prevent="handleSubmit">
      <div class="form-grid">
        <UiInput
          id="name"
          v-model="formData.name"
          label="İsim"
          placeholder="İsim girin"
          required
        />
        <UiInput
          id="email"
          v-model="formData.email"
          type="email"
          label="E-posta"
          placeholder="E-posta girin"
          required
        />
      </div>
      <div class="form-actions">
        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? "Kaydediliyor..." : editMode ? "Güncelle" : "Ekle" }}
        </button>
        <button
          v-if="editMode"
          type="button"
          class="btn-secondary"
          @click="handleCancel"
        >
          İptal
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { User } from "~~/shared/types";
import UiInput from "~/components/ui/Input.vue";

const props = defineProps<{
  user?: User | null;
}>();

const emit = defineEmits<{
  saved: [];
  cancel: [];
}>();

const usersStore = useUsersStore();

const formData = ref({
  name: "",
  email: "",
});

const editMode = computed(() => !!props.user);
const loading = computed(() => usersStore.loading);

watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      formData.value = {
        name: newUser.name || "",
        email: newUser.email,
      };
    } else {
      formData.value = { name: "", email: "" };
    }
  },
  { immediate: true },
);

async function handleSubmit() {
  try {
    if (editMode.value && props.user) {
      await usersStore.updateUser(props.user.id, formData.value);
    } else {
      await usersStore.createUser(formData.value);
    }
    formData.value = { name: "", email: "" };
    emit("saved");
  } catch (e) {
    console.error(e);
  }
}

function handleCancel() {
  formData.value = { name: "", email: "" };
  emit("cancel");
}
</script>

<style scoped lang="sass">
@use "sass:color"
@use "~/assets/sass/shared/_colors.sass" as *

.user-form
  background: white
  border-radius: 12px
  padding: 1.5rem
  margin-bottom: 1.5rem
  border: 1px solid $light-border
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05)

  h3
    margin: 0 0 1.5rem
    color: $light-text-primary
    font-size: 1.1rem
    font-weight: 600

.form-grid
  display: grid
  grid-template-columns: 1fr 1fr
  gap: 1.5rem
  margin-bottom: 0.5rem
  @media (max-width: 768px)
    grid-template-columns: 1fr

.form-actions
  display: flex
  gap: 0.75rem
  margin-top: 1rem

.btn-primary
  padding: 0.75rem 1.5rem
  background: $light-primary
  color: #fff
  border: none
  border-radius: 8px
  font-size: 0.95rem
  font-weight: 500
  cursor: pointer
  transition: all 0.2s
  font-family: 'Inter', sans-serif

  &:hover:not(:disabled)
    transform: translateY(-2px)
    background: color.adjust($light-primary, $lightness: -5%)
    box-shadow: 0 4px 15px rgba($light-primary, 0.3)

  &:disabled
    opacity: 0.6
    cursor: not-allowed

.btn-secondary
  padding: 0.75rem 1.5rem
  background: $light-bg
  color: $light-text-primary
  border: 1px solid $light-border
  border-radius: 8px
  font-size: 0.95rem
  cursor: pointer
  transition: all 0.2s
  font-family: 'Inter', sans-serif

  &:hover
    background: rgba($light-text-secondary, 0.05)
</style>
