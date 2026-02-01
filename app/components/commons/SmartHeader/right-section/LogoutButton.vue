<script setup lang="ts">
import { LogOut } from "lucide-vue-next";

const { loggedIn, clear } = useUserSession();
const router = useRouter();

const logout = async () => {
  await clear();
  router.push("/");
};
</script>

<template>
  <button v-if="loggedIn" class="logout-btn" @click="logout" title="Çıkış Yap">
    <LogOut :size="18" />
    <span>Çıkış</span>
  </button>
</template>

<style scoped lang="sass">
@use "sass:color"
@use "~/assets/sass/shared/_colors.sass" as *

.logout-btn
  display: flex
  align-items: center
  gap: 6px
  padding: 6px 14px
  background: rgba($light-primary, 0.08)
  border: none
  border-radius: 8px
  color: $light-primary
  font-size: 13px
  font-weight: 500
  cursor: pointer
  transition: all 0.2s ease
  font-family: 'Inter', sans-serif

  &:hover
    background: $light-primary
    color: #fff
</style>
