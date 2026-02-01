<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'

const props = defineProps<{
  modelValue?: Date | null
  placeholder?: string
  minDate?: Date
  maxDate?: Date
  format?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Date | null): void
}>()

// State
const isOpen = ref(false)
const inputRef = ref<HTMLElement | null>(null)
const popoverRef = ref<HTMLElement | null>(null)
const placement = ref<'bottom' | 'top'>('bottom')
const inputValue = ref('') // Local input value for manual typing

// Calendar State
const viewDate = ref(props.modelValue ? new Date(props.modelValue) : new Date())
const currentMonth = computed(() => viewDate.value.getMonth())
const currentYear = computed(() => viewDate.value.getFullYear())

// Sync internal view and local input
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    viewDate.value = new Date(newVal)
    // Update input value on model change
    const d = newVal
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    inputValue.value = `${day}.${month}.${year}`
  } else {
    inputValue.value = ''
  }
}, { immediate: true })

// Helpers
const monthNames = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
]

const dayNames = ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pa']

// Toast
import { useToast } from '~/composables/useToast'
const { addToast } = useToast()

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  let val = target.value
  
  // Input Masking Logic (Auto-insert dots)
  // Only if adding characters (implied by checking if we need to add a dot)
  if (e instanceof InputEvent && (e.inputType === 'deleteContentBackward' || e.inputType === 'deleteContentForward')) {
    // allow deleting without interference
  } else {
    // Simplified masking: just check current length
    if (val.length === 2) {
      val += '.'
    } else if (val.length === 5) {
      val += '.'
    }
    // Strict limit
    if (val.length > 10) {
      val = val.slice(0, 10)
    }
  }

  inputValue.value = val
  target.value = val // Update DOM immediately for cursor consistency
  
  // Try to parse DD.MM.YYYY
  const regex = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/
  const match = val.match(regex)
  
  if (match && match[1] && match[2] && match[3]) {
    const day = parseInt(match[1])
    const month = parseInt(match[2])
    const year = parseInt(match[3])
    
    // Validation: Syntax Limits
    if (day > 31) {
      addToast({
        type: 'error',
        title: 'Hatalı Tarih',
        message: 'Gün değeri 31\'den büyük olamaz.'
      })
      return
    }
    
    if (month > 12) {
      addToast({
        type: 'error',
        title: 'Hatalı Tarih',
        message: 'Ay değeri 12\'den büyük olamaz.'
      })
      return
    }

    // Validation: Logic (e.g. 30.02.2023)
    // JS Date autocorrects overflow (Feb 30 -> Mar 2), so we must check if input matches result
    const date = new Date(year, month - 1, day)
    
    if (
      date.getFullYear() !== year || 
      date.getMonth() !== month - 1 || 
      date.getDate() !== day
    ) {
      addToast({
        type: 'error',
        title: 'Geçersiz Tarih',
        message: 'Girdiğiniz tarih takvimde bulunmuyor (Örn: Şubat 30).'
      })
      return
    }

    // Constraints
    if (props.minDate && date < props.minDate) {
      addToast({ type: 'warning', message: 'Tarih minimum sınırın altında.' })
      return
    }
    if (props.maxDate && date > props.maxDate) {
      addToast({ type: 'warning', message: 'Tarih maksimum sınırın üzerinde.' })
      return
    }
      
    // Valid
    viewDate.value = new Date(date) // Jump calendar to typed date
    emit('update:modelValue', date)
  }
}

const calendarDays = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  
  let startDay = firstDayOfMonth.getDay() - 1
  if (startDay === -1) startDay = 6
  
  const daysInMonth = lastDayOfMonth.getDate()
  
  const prevMonthDays = []
  const prevMonthLastDate = new Date(year, month, 0).getDate()
  for (let i = startDay - 1; i >= 0; i--) {
    prevMonthDays.push({
      date: new Date(year, month - 1, prevMonthLastDate - i),
      currentMonth: false,
      prevMonth: true
    })
  }
  
  const currentMonthDays = []
  for (let i = 1; i <= daysInMonth; i++) {
    currentMonthDays.push({
      date: new Date(year, month, i),
      currentMonth: true
    })
  }
  
  const daysSoFar = prevMonthDays.length + currentMonthDays.length
  const remaining = 42 - daysSoFar
  const nextMonthDays = []
  for (let i = 1; i <= remaining; i++) {
    nextMonthDays.push({
      date: new Date(year, month + 1, i),
      currentMonth: false,
      nextMonth: true
    })
  }
  
  return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays]
})

// Actions
const updatePosition = async () => {
  if (!inputRef.value) return
  
  // Calculate availability before opening (or while open)
  const inputRect = inputRef.value.getBoundingClientRect()
  const windowHeight = window.innerHeight
  const popoverHeight = 320 // Approximate max height of popover
  
  const spaceBelow = windowHeight - inputRect.bottom
  
  // If space below is less than popover height, force top
  if (spaceBelow < popoverHeight) {
    placement.value = 'top'
  } else {
    placement.value = 'bottom'
  }
}

const togglePopover = async () => {
  if (isOpen.value) {
    closePopover()
  } else {
    // Pre-calculate position before setting isOpen to True
    await updatePosition()
    isOpen.value = true
    // Refine after render if needed (though estimating usually prevents jump)
    nextTick(() => {
      // Optional: Double check if we have the real ref now
      if (popoverRef.value && inputRef.value) {
        // Precise check could go here
      }
    })
  }
}

const openPopover = async () => {
  if (!isOpen.value) {
    await updatePosition()
    isOpen.value = true
  }
}

const closePopover = () => {
  isOpen.value = false
  // Don't reset placement immediately to avoid flickering on close animation if we had one
}

const prevMonth = () => {
  viewDate.value = new Date(currentYear.value, currentMonth.value - 1, 1)
}

const nextMonth = () => {
  viewDate.value = new Date(currentYear.value, currentMonth.value + 1, 1)
}

const selectDate = (day: any) => {
  emit('update:modelValue', day.date)
  if (!day.currentMonth) {
    viewDate.value = new Date(day.date)
  }
  closePopover()
}

const isSelected = (date: Date) => {
  if (!props.modelValue) return false
  return date.toDateString() === props.modelValue.toDateString()
}

const isToday = (date: Date) => {
  return date.toDateString() === new Date().toDateString()
}

const handleClickOutside = (e: MouseEvent) => {
  if (
    isOpen.value &&
    inputRef.value &&
    !inputRef.value.contains(e.target as Node) &&
    popoverRef.value &&
    !popoverRef.value.contains(e.target as Node)
  ) {
    closePopover()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('resize', updatePosition)
  window.addEventListener('scroll', updatePosition, true)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', updatePosition)
  window.removeEventListener('scroll', updatePosition, true)
})
</script>

<template>
  <div class="datepicker-container">
    <!-- Input Trigger -->
    <div 
      class="datepicker-input-wrapper"
      ref="inputRef"
      @click="togglePopover"
      :class="{ active: isOpen }"
    >
      <input 
        type="text" 
        v-model="inputValue" 
        @input="handleInput"
        :placeholder="placeholder || 'Tarih seçin'" 
        class="datepicker-input"
        @click="openPopover"
      />
      <span class="calendar-icon" @click.stop="togglePopover">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
      </span>
    </div>

    <!-- Popover -->
    <transition name="fade">
      <div 
        v-if="isOpen" 
        class="datepicker-popover" 
        ref="popoverRef"
        :class="placement"
      >
        <!-- Header -->
        <div class="dp-header">
          <button class="nav-btn" @click.stop="prevMonth">&lt;</button>
          <div class="current-month">
            {{ monthNames[currentMonth] }} {{ currentYear }}
          </div>
          <button class="nav-btn" @click.stop="nextMonth">&gt;</button>
        </div>

        <!-- Weekdays -->
        <div class="dp-weekdays">
          <div v-for="day in dayNames" :key="day" class="weekday-cell">{{ day }}</div>
        </div>

        <!-- Grid -->
        <div class="dp-grid">
          <div 
            v-for="(day, index) in calendarDays" 
            :key="index"
            class="day-cell"
            :class="{ 
              'muted': !day.currentMonth,
              'selected': isSelected(day.date),
              'today': isToday(day.date)
            }"
            @click.stop="selectDate(day)"
          >
            {{ day.date.getDate() }}
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="sass">
.datepicker-container
  position: relative
  width: 100%

.datepicker-input-wrapper
  display: flex
  align-items: center
  background: $color-surface
  border: 1px solid $color-border
  border-radius: 6px
  padding: 8px 12px
  cursor: text
  transition: all 0.2s ease
  color: $color-text
  
  &:hover
    border-color: $color-border-hover
    
  &.active,
  &:focus-within
    border-color: $color-primary
    box-shadow: 0 0 0 1px $color-primary-focus

.datepicker-input
  border: none
  outline: none
  width: 100%
  font-family: inherit
  font-size: 14px
  color: $color-text
  cursor: text
  background: transparent
  &::placeholder
    color: $color-text-dim

.calendar-icon
  color: $color-text-dim
  display: flex
  align-items: center
  cursor: pointer

.datepicker-popover
  position: absolute
  left: 0
  background: $color-surface
  border: 1px solid $color-border
  border-radius: 8px
  box-shadow: 0 4px 20px rgba(0,0,0,0.3)
  width: 280px
  padding: 16px
  z-index: 9999
  
  &.bottom
    top: calc(100% + 8px)
    
  &.top
    bottom: calc(100% + 8px)

.dp-header
  display: flex
  justify-content: space-between
  align-items: center
  margin-bottom: 12px

.current-month
  font-weight: 600
  font-size: 14px
  color: $color-text

.nav-btn
  border: none
  background: transparent
  cursor: pointer
  display: flex
  align-items: center
  justify-content: center
  width: 24px
  height: 24px
  border-radius: 4px
  color: $color-text-muted
  font-weight: bold
  transition: background 0.2s
  
  &:hover
    background-color: $color-surface-hover
    color: $color-text

.dp-weekdays
  display: grid
  grid-template-columns: repeat(7, 1fr)
  margin-bottom: 8px
  
.weekday-cell
  font-size: 12px
  color: $color-text-dim
  text-align: center
  font-weight: 500

.dp-grid
  display: grid
  grid-template-columns: repeat(7, 1fr)
  row-gap: 4px
  column-gap: 4px

.day-cell
  height: 32px
  display: flex
  align-items: center
  justify-content: center
  font-size: 13px
  cursor: pointer
  border-radius: 6px
  transition: all 0.1s
  color: $color-text

  &:hover
    background-color: $color-surface-hover
  
  &.muted
    color: $color-text-dim
    opacity: 0.5
    
    &:hover
      background-color: $color-surface-hover

  &.today
    background-color: $color-primary-transparent
    color: $color-primary
    font-weight: 600
    border: 1px solid $color-primary-border

  &.selected
    background-color: $color-primary
    color: white
    font-weight: 500
    border: 1px solid $color-primary
    
    &:hover
      background-color: $color-primary-hover

// Animations
.fade-enter-active,
.fade-leave-active
  transition: opacity 0.2s, transform 0.2s

.fade-enter-from,
.fade-leave-to
  opacity: 0
  transform: translateY(-4px)
</style>
