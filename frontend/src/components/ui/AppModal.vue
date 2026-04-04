<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @mousedown.self="$emit('update:modelValue', false)">
        <div class="modal" :class="sizeClass" @mousedown.stop>
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 class="font-bold text-gray-900 text-base">{{ title }}</h3>
            <button @click="$emit('update:modelValue', false)"
              class="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
              <X :size="18" />
            </button>
          </div>
          <!-- Body -->
          <div class="p-6">
            <slot />
          </div>
          <!-- Footer -->
          <div v-if="$slots.footer" class="px-6 pb-5 flex justify-end gap-2.5 border-t border-gray-50 pt-4">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps<{
  modelValue: boolean
  title: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}>()
defineEmits(['update:modelValue'])

const sizeClass = computed(() => ({
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}[props.size || 'md']))
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .modal, .modal-leave-active .modal { transition: transform 0.2s, opacity 0.2s; }
.modal-enter-from .modal, .modal-leave-to .modal { transform: scale(0.95) translateY(-8px); opacity: 0; }
</style>
