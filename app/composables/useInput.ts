import { ref, computed } from 'vue'

export interface InputOptions {
  modelValue: string | number
  type?: string
  required?: boolean
}

export function useInput(props: InputOptions, emit: (event: 'update:modelValue', value: any) => void) {
  const isFocused = ref(false)
  const localValue = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
  })

  const isActive = computed(() => {
    return isFocused.value || (localValue.value !== '' && localValue.value !== null && localValue.value !== undefined)
  })

  const handleFocus = () => {
    isFocused.value = true
  }

  const handleBlur = () => {
    isFocused.value = false
  }

  return {
    localValue,
    isFocused,
    isActive,
    handleFocus,
    handleBlur
  }
}
