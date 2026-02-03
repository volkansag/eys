<script setup lang="ts">
import { onMounted, onUnmounted, watch, computed } from "vue";
import DrawerHeader from "./DrawerHeader.vue";
import DrawerUserProfile from "./DrawerUserProfile.vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: null,
  },
  title: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue", "close"]);
const layoutStore = useLayoutStore();

// Priority: Prop modelValue (if passed) > Pinia store
const isOpen = computed({
  get: () =>
    props.modelValue !== null ? props.modelValue : layoutStore.isDrawerOpen,
  set: (val) => {
    if (props.modelValue !== null) {
      emit("update:modelValue", val);
    } else {
      layoutStore.setDrawer(val);
    }
  },
});

const close = () => {
  isOpen.value = false;
  emit("close");
};

// Close on Escape key
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && isOpen.value) {
    close();
  }
};

// Lock body scroll when open
watch(
  () => isOpen.value,
  (val) => {
    if (typeof document !== "undefined") {
      if (val) {
        const scrollbarWidth =
          window.innerWidth - document.documentElement.clientWidth;
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
      }
    }
  },
);

onMounted(() => {
  if (typeof window !== "undefined") {
    window.addEventListener("keydown", handleKeydown);
  }
});

onUnmounted(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("keydown", handleKeydown);
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  }
});
</script>

<template>
  <div>
    <Transition name="drawer-fade">
      <div v-if="isOpen" class="drawer-backdrop" @click="close"></div>
    </Transition>

    <Transition name="drawer-slide">
      <div v-if="isOpen" class="drawer-panel">
        <div class="drawer-top-area">
          <div class="wave-bg"></div>
          <DrawerHeader transparent :title="''" @close="close" />
        </div>

        <div class="drawer-scrollable-area">
          <DrawerUserProfile />

          <div class="drawer-content">
            <slot></slot>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="sass">
@use "~/assets/sass/shared/_colors.sass" as *
@use "~/assets/sass/shared/_animations.sass" as *

.drawer-backdrop
  position: fixed
  top: 0
  left: 0
  width: 100vw
  height: 100vh
  background-color: rgba(0, 0, 0, 0.5) // Simplified to move away from expensive blur
  z-index: 9998
  +will-change(opacity)
  cursor: pointer

.drawer-panel
  position: fixed
  top: 0
  left: 0
  width: 320px
  max-width: 85vw
  height: 100vh
  background-color: #f8fbff
  z-index: 9999
  display: flex
  flex-direction: column
  box-shadow: 10px 0 40px rgba(0, 0, 0, 0.1)
  +gpu-accelerate // Ensures translate3d(0, 0, 0)
  +will-change(transform)
  overflow: hidden
  backface-visibility: hidden // Prevents flickering in Chrome

.drawer-top-area
  position: relative
  height: 160px
  overflow: hidden
  flex-shrink: 0
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%) // Move gradient here
  transform: translate3d(0, 0, 0) // Force own layer

.wave-bg
  position: absolute
  bottom: -40px
  left: -10%
  width: 120%
  height: 80px
  background: #f8fbff
  border-radius: 50%
  transform: translate3d(0, 0, 0)

.drawer-scrollable-area
  flex: 1
  overflow-y: auto
  -webkit-overflow-scrolling: touch
  scrollbar-width: none
  &::-webkit-scrollbar
    display: none

.drawer-content
  padding: 0 16px 40px

/* Transitions - Optimized for Chrome Performance */
.drawer-fade-enter-active,
.drawer-fade-leave-active
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)

.drawer-fade-enter-from,
.drawer-fade-leave-to
  opacity: 0

.drawer-slide-enter-active,
.drawer-slide-leave-active
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)
  +gpu-accelerate

.drawer-slide-enter-from,
.drawer-slide-leave-to
  transform: translate3d(-100%, 0, 0)
</style>
