<template>
  <div class="post-form">
    <h3>{{ editMode ? "Post Düzenle" : "Yeni Post" }}</h3>
    <form @submit.prevent="handleSubmit">
      <div class="form-grid">
        <div class="form-group">
          <label for="author">Yazar</label>
          <div class="select-wrapper">
            <select
              id="author"
              v-model="formData.authorId"
              required
              :disabled="editMode"
            >
              <option value="" disabled>Yazar seçin</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.name || user.email }}
              </option>
            </select>
            <ChevronDown class="select-icon" :size="18" />
          </div>
        </div>

        <UiInput
          id="title"
          v-model="formData.title"
          label="Başlık"
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

      <div class="checkbox-group">
        <UiCheckbox v-model="formData.published" label="Postu yayınla" />
      </div>

      <div class="form-actions">
        <button
          type="submit"
          class="btn-primary"
          :disabled="loading || !formData.authorId"
        >
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
import type { Post } from "~~/shared/types";
import { ChevronDown } from "lucide-vue-next";
import UiInput from "~/components/ui/Input.vue";
import UiCheckbox from "~/components/ui/Checkbox.vue";

const props = defineProps<{
  post?: Post | null;
}>();

const emit = defineEmits<{
  saved: [];
  cancel: [];
}>();

const usersStore = useUsersStore();
const postsStore = usePostsStore();

const users = computed(() => usersStore.users);
const loading = computed(() => postsStore.loading);
const editMode = computed(() => !!props.post);

const formData = ref({
  authorId: "" as number | "",
  title: "",
  content: "",
  published: false,
});

watch(
  () => props.post,
  (newPost) => {
    if (newPost) {
      formData.value = {
        authorId: newPost.authorId,
        title: newPost.title,
        content: newPost.content || "",
        published: newPost.published,
      };
    } else {
      formData.value = {
        authorId: "",
        title: "",
        content: "",
        published: false,
      };
    }
  },
  { immediate: true },
);

async function handleSubmit() {
  if (!formData.value.authorId) return;

  try {
    if (editMode.value && props.post) {
      await postsStore.updatePost(props.post.id, {
        title: formData.value.title,
        content: formData.value.content,
        published: formData.value.published,
      });
    } else {
      await postsStore.createPost({
        authorId: formData.value.authorId as number,
        title: formData.value.title,
        content: formData.value.content,
        published: formData.value.published,
      });
    }
    formData.value = { authorId: "", title: "", content: "", published: false };
    emit("saved");
  } catch (e) {
    console.error(e);
  }
}

function handleCancel() {
  formData.value = { authorId: "", title: "", content: "", published: false };
  emit("cancel");
}
</script>

<style scoped lang="sass">
@use "~/assets/sass/shared/_colors.sass" as *

.post-form
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

.form-group
  margin-bottom: 1.5rem

  label
    display: block
    color: $light-text-muted
    margin-bottom: 0.5rem
    font-size: 0.9rem
    font-weight: 500

.select-wrapper
  position: relative

  select
    width: 100%
    height: 56px
    padding: 0 16px
    border: 1px solid $light-border
    border-radius: 8px
    background: $light-surface
    color: $light-text-primary
    font-size: 1rem
    font-family: 'Inter', sans-serif
    appearance: none
    cursor: pointer
    transition: all 0.2s

    &:focus
      outline: none
      border-color: $light-primary
      box-shadow: 0 0 0 3px rgba($light-primary, 0.1)

    &:disabled
      background: $light-bg
      cursor: not-allowed
      opacity: 0.7

  .select-icon
    position: absolute
    right: 16px
    top: 50%
    transform: translateY(-50%)
    color: $light-text-muted
    pointer-events: none

textarea
  width: 100%
  padding: 12px 16px
  border: 1px solid $light-border
  border-radius: 8px
  background: $light-surface
  color: $light-text-primary
  font-size: 1rem
  font-family: 'Inter', sans-serif
  resize: vertical
  min-height: 100px
  transition: all 0.2s

  &:focus
    outline: none
    border-color: $light-primary
    box-shadow: 0 0 0 3px rgba($light-primary, 0.1)

  &::placeholder
    color: $light-text-muted

.checkbox-group
  margin-bottom: 1.5rem

.form-actions
  display: flex
  gap: 0.75rem

.btn-primary
  flex: 1
  padding: 0.75rem 1.5rem
  background: $light-secondary
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
    filter: brightness(1.1)
    box-shadow: 0 4px 15px rgba($light-secondary, 0.3)

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
