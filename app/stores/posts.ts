import type { Post } from "~/types";

export const usePostsStore = defineStore("posts", () => {
  const posts = ref<Post[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchPosts() {
    loading.value = true;
    error.value = null;
    try {
      posts.value = await $fetch<Post[]>("/api/posts");
    } catch (e) {
      error.value = "Postlar yüklenirken hata oluştu";
      console.error(e);
    } finally {
      loading.value = false;
    }
  }

  async function createPost(data: {
    title: string;
    content: string;
    authorId: number;
    published?: boolean;
  }) {
    loading.value = true;
    error.value = null;
    try {
      const post = await $fetch<Post>("/api/posts", {
        method: "POST",
        body: data,
      });
      posts.value.push(post);
      return post;
    } catch (e) {
      error.value = "Post oluşturulurken hata oluştu";
      console.error(e);
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function updatePost(
    id: number,
    data: { title: string; content: string; published: boolean },
  ) {
    loading.value = true;
    error.value = null;
    try {
      const post = await $fetch<Post>(`/api/posts/${id}`, {
        method: "PUT",
        body: data,
      });
      const index = posts.value.findIndex((p) => p.id === id);
      if (index !== -1) {
        posts.value[index] = post;
      }
      return post;
    } catch (e) {
      error.value = "Post güncellenirken hata oluştu";
      console.error(e);
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function deletePost(id: number) {
    loading.value = true;
    error.value = null;
    try {
      await $fetch(`/api/posts/${id}`, {
        method: "DELETE",
      });
      posts.value = posts.value.filter((p) => p.id !== id);
    } catch (e) {
      error.value = "Post silinirken hata oluştu";
      console.error(e);
      throw e;
    } finally {
      loading.value = false;
    }
  }

  return {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
  };
});
