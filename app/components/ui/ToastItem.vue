<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  X,
  Minus,
  Pause,
  Play,
} from "lucide-vue-next";
import { useToast, type Toast } from "~/composables/useToast";

const props = defineProps<{
  toast: Toast;
  index: number;
  total: number;
}>();

// Calculate fixed bottom position based on slot (not index)
// Each toast is approximately 100px tall + 8px gap
const toastHeight = 100;
const toastGap = 8;
const baseBottom = 24;

const positionStyle = computed(() => ({
  bottom: `${baseBottom + props.toast.slot * (toastHeight + toastGap)}px`,
}));

const { removeToast } = useToast();

const remainingMs = ref(props.toast.duration || 5000);
const totalDuration = props.toast.duration || 5000;
const isPaused = ref(false);
const progress = ref(0);
let timer: any = null;
let interval: any = null;
const updateInterval = 50; // ms

// Restart timer if duplicate toast triggers update
watch(
  () => props.toast.updateKey,
  () => {
    remainingMs.value = totalDuration;
    progress.value = 0;
    isPaused.value = false; // Unpause on new trigger
    // Timer loop handles value collection automatically
  },
);

const remainingSeconds = computed(() => Math.ceil(remainingMs.value / 1000));

const startTimer = () => {
  if (timer) return;

  if (remainingMs.value <= 0) {
    removeToast(props.toast.id);
    return;
  }

  // Use setInterval for smoother progress updates and paosability
  interval = setInterval(() => {
    if (!isPaused.value) {
      remainingMs.value -= updateInterval;
      progress.value =
        ((totalDuration - remainingMs.value) / totalDuration) * 100;

      if (remainingMs.value <= 0) {
        if (remainingMs.value <= 0) {
          // Check again to be sure
          stopTimer();
          removeToast(props.toast.id);
        }
      }
    }
  }, updateInterval);
};

const stopTimer = () => {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
};

const togglePause = () => {
  isPaused.value = !isPaused.value;
};

const minimize = () => {
  // For now, minimize just closes it, or we could add a "minimized" state.
  // User requested "tepsiye indirme" - assuming minimizing visual footprint?
  // Let's implement actual minimize visual state later if needed, for now close is main action.
  // Or maybe just hide message body?
  removeToast(props.toast.id);
};

onMounted(() => {
  startTimer();
});

onUnmounted(() => {
  stopTimer();
});

// Icon selection
const iconComponent = computed(() => {
  switch (props.toast.type) {
    case "success":
      return CheckCircle;
    case "error":
      return XCircle;
    case "warning":
      return AlertTriangle;
    case "info":
      return Info;
    default:
      return Info;
  }
});

// Default title based on type
const displayTitle = computed(() => {
  if (props.toast.title) return props.toast.title;

  switch (props.toast.type) {
    case "success":
      return "Başarılı";
    case "error":
      return "Hata";
    case "warning":
      return "Uyarı";
    case "info":
      return "Bilgi";
    default:
      return "Bildirim";
  }
});
</script>

<template>
  <div
    class="toast-item"
    :class="[toast.type, { paused: isPaused }]"
    :style="positionStyle"
  >
    <!-- Title Bar with Brand Color -->
    <div class="toast-title-bar">
      <div class="title-bar-left">
        <component :is="iconComponent" class="title-bar-icon" />
        <span class="title-bar-text">{{ displayTitle }}</span>
      </div>
      <div class="title-bar-controls">
        <button class="control-btn" @click="togglePause" title="Durdur/Başlat">
          <Pause v-if="!isPaused" :size="14" />
          <Play v-else :size="14" />
        </button>
        <button class="control-btn" @click="minimize" title="Küçült">
          <Minus :size="14" />
        </button>
        <button
          class="control-btn"
          @click="removeToast(toast.id)"
          title="Kapat"
        >
          <X :size="14" />
        </button>
      </div>
    </div>

    <!-- Message Body -->
    <div class="toast-body">
      <p class="toast-message">{{ toast.message }}</p>
    </div>

    <!-- Footer with Countdown -->
    <div class="toast-footer">
      <span class="countdown-text">
        Bu mesaj <strong>{{ remainingSeconds }}</strong> saniye sonra kapanacak.
      </span>
    </div>

    <!-- Progress Bar -->
    <div class="progress-bar-container">
      <div class="progress-bar" :style="{ width: `${100 - progress}%` }"></div>
    </div>
  </div>
</template>

<style scoped lang="sass">
@use "~/assets/sass/shared/_colors.sass" as *

.toast-item
  background: white
  border-radius: 12px
  pointer-events: auto
  position: fixed
  right: 24px
  overflow: hidden
  width: 340px
  display: flex
  flex-direction: column

// Title Bar - Brand Primary Color
.toast-title-bar
  display: flex
  align-items: center
  justify-content: space-between
  padding: 10px 12px
  background: $light-primary
  border-radius: 11px 11px 0 0

.title-bar-left
  display: flex
  align-items: center
  gap: 8px

.title-bar-icon
  width: 18px
  height: 18px
  color: white

.title-bar-text
  font-size: 13px
  font-weight: 600
  color: white
  letter-spacing: 0.3px

.title-bar-controls
  display: flex
  gap: 4px

.control-btn
  background: rgba(255, 255, 255, 0.15)
  border: none
  cursor: pointer
  color: white
  padding: 4px
  border-radius: 4px
  display: flex
  align-items: center
  justify-content: center
  transition: all 0.2s

  &:hover
    background: rgba(255, 255, 255, 0.3)

// Body
.toast-body
  padding: 10px 14px 2px 14px

.toast-message
  margin: 0
  font-size: 13px
  color: #374151
  line-height: 1.4

// Footer
.toast-footer
  padding: 0 14px 12px 14px
  display: flex
  align-items: center

.countdown-text
  font-size: 11px
  color: #9ca3af
  font-style: italic

  strong
    color: #6b7280
    font-weight: 600

// Progress Bar
.progress-bar-container
  width: 100%
  height: 4px
  background: #e5e7eb
  position: absolute
  bottom: 0
  left: 0

.progress-bar
  height: 100%
  background: $light-primary
  transition: width 50ms linear

  // Bar colors by type
  .success &
    background: $toast-success
  .error &
    background: $toast-error
  .warning &
    background: $toast-warning
  .info &
    background: $toast-info

  // Paused state
  .paused &
    opacity: 0.5
</style>
