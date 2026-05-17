<template>
  <Teleport to="body">
    <Transition name="upgrade-modal">
      <div v-if="modelValue" class="fixed inset-0 flex items-center justify-center p-4" style="z-index: 9999" @mousedown.self="emit('update:modelValue', false)">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @mousedown="emit('update:modelValue', false)" />

        <div class="upgrade-box relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden" @mousedown.stop>
          <!-- Header -->
          <div class="px-6 pt-8 pb-5 text-center">
            <button @click="emit('update:modelValue', false)"
              class="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
              <X :size="18" />
            </button>
            <div class="w-12 h-12 bg-[#768dfb]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Zap :size="22" class="text-[#768dfb]" fill="currentColor" />
            </div>
            <h2 class="text-xl font-bold text-gray-900">Plan Limitine Ulaştınız</h2>
            <p class="text-gray-500 text-sm mt-1.5 max-w-sm mx-auto leading-relaxed">{{ message || 'Daha fazla özellik için aboneliğinizi yükseltin.' }}</p>
          </div>

          <!-- Plan Cards -->
          <div class="px-6 pb-5 grid grid-cols-2 gap-3">

            <!-- PRO -->
            <div @click="selected = 'PRO'"
              :class="[
                'relative rounded-xl border p-5 cursor-pointer transition-all',
                selected === 'PRO'
                  ? 'border-[#768dfb] bg-[#768dfb]/5 shadow-sm'
                  : 'border-gray-200 bg-gray-50 hover:border-[#768dfb]/40 hover:bg-[#768dfb]/5'
              ]">
              <div v-if="selected === 'PRO'" class="absolute top-3 right-3 w-5 h-5 bg-[#768dfb] rounded-full flex items-center justify-center">
                <Check :size="11" class="text-white" stroke-width="3" />
              </div>
              <p class="text-[10px] font-bold text-[#768dfb] uppercase tracking-widest mb-2">Pro Plan</p>
              <div class="flex items-baseline gap-0.5 mb-4">
                <span class="text-3xl font-bold text-gray-900">$10</span>
                <span class="text-gray-400 text-sm">/ay</span>
              </div>
              <ul class="space-y-2 mb-5">
                <li v-for="f in proFeatures" :key="f" class="flex items-center gap-2 text-sm text-gray-700">
                  <Check :size="13" class="text-[#768dfb] shrink-0" stroke-width="2.5" />
                  {{ f }}
                </li>
              </ul>
              <router-link
                :to="{ path: '/subscription', query: { plan: 'PRO' } }"
                @click="emit('update:modelValue', false)"
                :class="[
                  'w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all',
                  selected === 'PRO'
                    ? 'bg-[#768dfb] text-white hover:bg-[#5b73e8]'
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-[#768dfb]/40'
                ]">
                Pro'ya Geç <ArrowRight :size="14" />
              </router-link>
            </div>

            <!-- PREMIUM -->
            <div @click="selected = 'PREMIUM'"
              :class="[
                'relative rounded-xl border p-5 cursor-pointer transition-all',
                selected === 'PREMIUM'
                  ? 'border-[#768dfb] bg-[#768dfb]/5 shadow-sm'
                  : 'border-[#768dfb]/30 bg-[#768dfb]/5 hover:border-[#768dfb]/60'
              ]">
              <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#768dfb] text-white text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                ✦ Önerilen
              </div>
              <div v-if="selected === 'PREMIUM'" class="absolute top-3 right-3 w-5 h-5 bg-[#768dfb] rounded-full flex items-center justify-center">
                <Check :size="11" class="text-white" stroke-width="3" />
              </div>
              <p class="text-[10px] font-bold text-[#768dfb] uppercase tracking-widest mb-2 mt-1">Premium Plan</p>
              <div class="flex items-baseline gap-0.5 mb-4">
                <span class="text-3xl font-bold text-gray-900">$25</span>
                <span class="text-gray-400 text-sm">/ay</span>
              </div>
              <ul class="space-y-2 mb-5">
                <li v-for="f in premiumFeatures" :key="f" class="flex items-center gap-2 text-sm text-gray-700">
                  <Check :size="13" class="text-[#768dfb] shrink-0" stroke-width="2.5" />
                  {{ f }}
                </li>
              </ul>
              <router-link
                :to="{ path: '/subscription', query: { plan: 'PREMIUM' } }"
                @click="emit('update:modelValue', false)"
                class="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg text-sm font-semibold bg-[#768dfb] text-white hover:bg-[#5b73e8] transition-all">
                Premium'a Geç <ArrowRight :size="14" />
              </router-link>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 pb-5 flex justify-center">
            <button @click="emit('update:modelValue', false)" class="text-sm text-gray-400 hover:text-gray-500 transition-colors">
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
  '3 işletme, 5 menü',
  '100 ürüne kadar',
  'QR kod oluşturma',
  'Özel marka',
  'Analitik & istatistikler',
  'Masa QR kodu',
]

const premiumFeatures = [
  'Sınırsız işletme',
  'Sınırsız menü & ürün',
  'QR kod oluşturma',
  'Çoklu dil desteği',
  'Öncelikli destek',
  'Tüm analitik özellikleri',
]
</script>

<style>
.upgrade-modal-enter-active { transition: opacity 0.2s ease; }
.upgrade-modal-leave-active { transition: opacity 0.15s ease; }
.upgrade-modal-enter-from,
.upgrade-modal-leave-to { opacity: 0; }
.upgrade-modal-enter-active .upgrade-box { transition: transform 0.2s ease, opacity 0.2s ease; }
.upgrade-modal-enter-from .upgrade-box { transform: scale(0.95) translateY(-8px); opacity: 0; }
</style>
