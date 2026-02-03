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
  border: none
  border-radius: 8px
  color: #8D3FD0
  font-size: 13px
  font-weight: 500
  font-family: 'Inter', sans-serif
  @include hover-darken-effect(#f0f3ff, 5%)
</style>
