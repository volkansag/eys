<script setup lang="ts">
import { ref, computed } from "vue";
import { Search, ChevronRight } from "lucide-vue-next";

const query = ref("");
const isFocused = ref(false);
const searchInput = ref<HTMLInputElement | null>(null);

const mockResults = [
  { title: "Dashboard", path: "/dashboard" },
  { title: "Ders Programı", path: "/schedule" },
  { title: "Öğrenci Listesi", path: "/students" },
  { title: "Öğretmenler", path: "/teachers" },
  { title: "Ayarlar", path: "/settings" },
  { title: "Profilim", path: "/profile" },
];

const filteredResults = computed(() => {
  if (!query.value) return [];
  return mockResults.filter((r) =>
    r.title.toLowerCase().includes(query.value.toLowerCase()),
  );
});

// Show menu only if user typed something and input is focused
const showMenu = computed(() => isFocused.value && query.value.length > 0);

const handleBlur = () => {
  // Delay closing to allow clicking on results
  setTimeout(() => {
    isFocused.value = false;
  }, 200);
};

const focusInput = () => {
  searchInput.value?.focus();
};
</script>

<template>
  <div class="search-container">
    <div class="header-search" @click="focusInput">
      <Search :size="22" class="search-icon" />
      <input
        ref="searchInput"
        v-model="query"
        @focus="isFocused = true"
        @blur="handleBlur"
        type="text"
        placeholder="Ara..."
        class="search-input"
      />
    </div>

    <!-- Autocomplete Dropdown -->
    <Transition name="fade">
      <div v-if="showMenu" class="autocomplete-menu">
        <ul v-if="filteredResults.length > 0">
          <li v-for="res in filteredResults" :key="res.path">
            <a :href="res.path" class="result-item">
              <span class="result-text">{{ res.title }}</span>
              <ChevronRight :size="16" class="arrow-icon" />
            </a>
          </li>
        </ul>
        <div v-else class="no-results">Sonuç bulunamadı</div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="sass">
@use "~/assets/sass/shared/_colors.sass" as *

.search-container
  position: relative
  margin-left: 16px

.header-search
  display: flex
  align-items: center
  gap: 12px
  background: rgba($light-primary, 0.08)
  padding: 10px 16px
  transition: all 0.2s ease
  border: none
  width: 320px
  cursor: text

  &:focus-within
    .search-icon
      color: $light-primary

.search-icon
  color: $light-primary
  transition: color 0.2s ease

.search-input
  border: none
  background: transparent
  outline: none
  font-size: 0.9rem
  color: $light-text-primary
  width: 100%
  height: 100%
  font-family: 'Inter', sans-serif
  font-weight: 500

  &::placeholder
    color: rgba($light-text-secondary, 0.7)

.autocomplete-menu
  position: absolute
  top: calc(100% + 8px)
  left: 0
  width: 100%
  background: white
  border-radius: 16px
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1)
  padding: 8px
  z-index: 100
  border: 1px solid rgba($light-border, 0.5)
  overflow: hidden

  ul
    list-style: none
    padding: 0
    margin: 0

.result-item
  display: flex
  align-items: center
  justify-content: space-between
  padding: 10px 12px
  border-radius: 10px
  text-decoration: none
  color: $light-text-primary
  transition: all 0.2s ease
  cursor: pointer

  &:hover
    background: rgba($light-primary, 0.06)

    .result-text
      color: $light-primary
      font-weight: 600

    .arrow-icon
      transform: translateX(4px)
      color: $light-primary

.result-text
  font-size: 0.9rem
  transition: all 0.2s

.arrow-icon
  color: $light-text-secondary
  transition: all 0.2s

.no-results
  padding: 12px
  text-align: center
  color: $light-text-secondary
  font-size: 0.9rem

/* Fade Animation */
.fade-enter-active,
.fade-leave-active
  transition: opacity 0.2s ease, transform 0.2s ease

.fade-enter-from,
.fade-leave-to
  opacity: 0
  transform: translateY(-5px)
</style>
