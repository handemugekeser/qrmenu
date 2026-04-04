<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium pointer-events-auto max-w-sm',
                   toast.type === 'success' ? 'bg-emerald-500 text-white' :
                   toast.type === 'error'   ? 'bg-red-500 text-white' :
                                              'bg-gray-800 text-white']"
        >
          <CheckCircle v-if="toast.type === 'success'" :size="16" />
          <XCircle v-else-if="toast.type === 'error'" :size="16" />
          <Info v-else :size="16" />
          {{ toast.message }}
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { CheckCircle, XCircle, Info } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'
const { toasts } = useToast()
</script>

<style scoped>
.toast-enter-active { transition: all 0.25s ease; }
.toast-leave-active { transition: all 0.2s ease; }
.toast-enter-from { opacity: 0; transform: translateX(24px); }
.toast-leave-to   { opacity: 0; transform: translateX(24px); }
</style>
