import { defineStore } from 'pinia'
import { ref } from 'vue'
import { insightsApi } from '@/api'
import { useAuthStore } from '@/stores/auth'

export const useInsightsStore = defineStore('insights', () => {
  const newCount = ref(0)
  const lastFetched = ref<number | null>(null)

  async function refreshCount(force = false) {
    const auth = useAuthStore()
    if (!auth.isPro) {
      newCount.value = 0
      return
    }
    if (!force && lastFetched.value && Date.now() - lastFetched.value < 60_000) return
    try {
      const { data } = await insightsApi.list('new')
      newCount.value = data.counts.new
      lastFetched.value = Date.now()
    } catch {
      // silent — sidebar badge is non-critical
    }
  }

  function setCount(n: number) {
    newCount.value = Math.max(0, n)
  }

  function decrement() {
    newCount.value = Math.max(0, newCount.value - 1)
  }

  return { newCount, refreshCount, setCount, decrement }
})
