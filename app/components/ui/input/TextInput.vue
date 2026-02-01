<script setup lang="ts">
defineProps<{
  modelValue: string | number
}>()

defineEmits(['update:modelValue'])
</script>

<template>
  <UiBaseInput
    type="text"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    v-bind="$attrs"
  >
    <template v-if="$slots.prepend" #prepend>
      <slot name="prepend" />
    </template>
  </UiBaseInput>
</template>
