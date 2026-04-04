<template>
  <Teleport to="body">
    <Transition name="upgrade-modal">
      <div v-if="modelValue" class="fixed inset-0 flex items-center justify-center p-4" style="z-index: 9999" @mousedown.self="emit('update:modelValue', false)">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @mousedown="emit('update:modelValue', false)" />

        <!-- Modal Box -->
        <div class="upgrade-box relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden" @mousedown.stop>
          <!-- Header -->
          <div class="px-6 pt-6 pb-4 text-center">
            <button @click="emit('update:modelValue', false)"
              class="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
              <X :size="18" />
            </button>
            <div class="w-14 h-14 bg-linear-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-orange-200">
              <Zap :size="24" class="text-white" fill="currentColor" />
            </div>
            <h2 class="text-xl font-black text-gray-900">Plan Limitine Ulaştınız</h2>
            <p class="text-gray-500 text-sm mt-1.5 max-w-md mx-auto leading-relaxed">{{ message || 'Daha fazla özellik için aboneliğinizi yükseltin.' }}</p>
          </div>

          <!-- Plan Cards -->
          <div class="px-6 pb-6 grid grid-cols-2 gap-3">

            <!-- PRO Card -->
            <div
              @click="selected = 'PRO'"
              :class="[
                'relative rounded-2xl border-2 p-5 cursor-pointer transition-all',
                selected === 'PRO'
                  ? 'border-orange-400 bg-orange-50 shadow-md shadow-orange-100'
                  : 'border-gray-200 bg-white hover:border-orange-200 hover:bg-orange-50/40'
              ]">
              <div v-if="selected === 'PRO'" class="absolute top-3 right-3 w-5 h-5 bg-orange-400 rounded-full flex items-center justify-center">
                <Check :size="12" class="text-white" stroke-width="3" />
              </div>

              <div class="mb-4">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Pro Plan</p>
                <div class="flex items-baseline gap-1">
                  <span class="text-2xl font-black text-gray-900">₺299</span>
                  <span class="text-gray-400 text-sm">/ay</span>
                </div>
              </div>

              <ul class="space-y-2">
                <li v-for="f in proFeatures" :key="f" class="flex items-center gap-2 text-sm text-gray-700">
                  <div class="w-4 h-4 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                    <Check :size="10" class="text-orange-500" stroke-width="3" />
                  </div>
                  {{ f }}
                </li>
              </ul>

              <router-link
                :to="{ path: '/subscription', query: { plan: 'PRO' } }"
                @click="emit('update:modelValue', false)"
                class="mt-5 w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-sm font-bold transition-all"
                :class="selected === 'PRO'
                  ? 'bg-orange-400 text-white hover:bg-orange-500'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'">
                Pro'ya Geç
                <ArrowRight :size="14" />
              </router-link>
            </div>

            <!-- PREMIUM Card (Önerilen) -->
            <div
              @click="selected = 'PREMIUM'"
              :class="[
                'relative rounded-2xl border-2 p-5 cursor-pointer transition-all',
                selected === 'PREMIUM'
                  ? 'border-violet-500 shadow-lg shadow-violet-100'
                  : 'border-violet-300 hover:border-violet-400'
              ]"
              style="background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)">
              <!-- Önerilen Badge -->
              <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-linear-to-r from-violet-500 to-purple-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-md whitespace-nowrap">
                ✨ Önerilen
              </div>

              <div v-if="selected === 'PREMIUM'" class="absolute top-3 right-3 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center">
                <Check :size="12" class="text-white" stroke-width="3" />
              </div>

              <div class="mb-4 mt-1">
                <p class="text-xs font-bold text-violet-500 uppercase tracking-wider mb-1">Premium Plan</p>
                <div class="flex items-baseline gap-1">
                  <span class="text-2xl font-black text-gray-900">₺599</span>
                  <span class="text-gray-400 text-sm">/ay</span>
                </div>
              </div>

              <ul class="space-y-2">
                <li v-for="f in premiumFeatures" :key="f" class="flex items-center gap-2 text-sm text-gray-700">
                  <div class="w-4 h-4 bg-violet-200 rounded-full flex items-center justify-center shrink-0">
                    <Check :size="10" class="text-violet-600" stroke-width="3" />
                  </div>
                  {{ f }}
                </li>
              </ul>

              <router-link
                :to="{ path: '/subscription', query: { plan: 'PREMIUM' } }"
                @click="emit('update:modelValue', false)"
                class="mt-5 w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-sm font-bold transition-all bg-linear-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700 shadow-md shadow-violet-200">
                Premium'a Geç
                <ArrowRight :size="14" />
              </router-link>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 pb-5 flex justify-center border-t border-gray-100 pt-4">
            <button @click="emit('update:modelValue', false)" class="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              Şimdi değil
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { X, Zap, Check, ArrowRight } from 'lucide-vue-next'

defineProps<{
  modelValue: boolean
  message?: string
}>()

const emit = defineEmits(['update:modelValue'])

const selected = ref<'PRO' | 'PREMIUM'>('PREMIUM')

const proFeatures = [
  '3 İşletme',
  '5 Menü',
  '100 Ürün',
  'Analitik',
  'Masa QR Kodu',
  'Özel Tema',
]

const premiumFeatures = [
  'Sınırsız İşletme',
  'Sınırsız Menü',
  'Sınırsız Ürün',
  'Çoklu Dil Desteği',
  'Öncelikli Destek',
  'Tüm Pro Özellikleri',
]
</script>

<style>
.upgrade-modal-enter-active { transition: opacity 0.2s ease; }
.upgrade-modal-leave-active { transition: opacity 0.15s ease; }
.upgrade-modal-enter-from,
.upgrade-modal-leave-to { opacity: 0; }
.upgrade-modal-enter-active .upgrade-box { transition: transform 0.2s ease, opacity 0.2s ease; }
.upgrade-modal-enter-from .upgrade-box { transform: scale(0.95) translateY(-10px); opacity: 0; }
</style>
