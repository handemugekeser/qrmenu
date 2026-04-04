<template>
  <button
    type="button"
    :class="['toggle', modelValue ? 'bg-orange-500' : 'bg-gray-200']"
    @click="$emit('update:modelValue', !modelValue)"
    :aria-checked="modelValue"
  >
    <span :class="['toggle-thumb', modelValue ? 'translate-x-5' : 'translate-x-0']" />
  </button>
</template>

<script setup lang="ts">
defineProps<{ modelValue: boolean }>()
defineEmits(['update:modelValue'])
</script>
