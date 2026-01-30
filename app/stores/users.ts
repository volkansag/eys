import type { User } from "~/types";

export const useUsersStore = defineStore("users", () => {
  const users = ref<User[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchUsers() {
    loading.value = true;
    error.value = null;
    try {
      users.value = await $fetch<User[]>("/api/users");
    } catch (e) {
      error.value = "Kullanıcılar yüklenirken hata oluştu";
      console.error(e);
    } finally {
      loading.value = false;
    }
  }

  async function createUser(data: { email: string; name: string }) {
    loading.value = true;
    error.value = null;
    try {
      const user = await $fetch<User>("/api/users", {
        method: "POST",
        body: data,
      });
      users.value.push(user);
      return user;
    } catch (e) {
      error.value = "Kullanıcı oluşturulurken hata oluştu";
      console.error(e);
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function updateUser(id: number, data: { email: string; name: string }) {
    loading.value = true;
    error.value = null;
    try {
      const user = await $fetch<User>(`/api/users/${id}`, {
        method: "PUT",
        body: data,
      });
      const index = users.value.findIndex((u) => u.id === id);
      if (index !== -1) {
        users.value[index] = { ...users.value[index], ...user };
      }
      return user;
    } catch (e) {
      error.value = "Kullanıcı güncellenirken hata oluştu";
      console.error(e);
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function deleteUser(id: number) {
    loading.value = true;
    error.value = null;
    try {
      await $fetch(`/api/users/${id}`, {
        method: "DELETE",
      });
      users.value = users.value.filter((u) => u.id !== id);
    } catch (e) {
      error.value = "Kullanıcı silinirken hata oluştu";
      console.error(e);
      throw e;
    } finally {
      loading.value = false;
    }
  }

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
});
