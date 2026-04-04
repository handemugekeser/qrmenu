import { defineStore } from 'pinia'
import { ref } from 'vue'
import { businessApi } from '@/api'

export const useBusinessStore = defineStore('business', () => {
  const businesses = ref<any[]>([])
  const current = ref<any | null>(null)
  const loading = ref(false)

  async function fetchAll() {
    loading.value = true
    try {
      const { data } = await businessApi.list()
      businesses.value = data
    } finally {
      loading.value = false
    }
  }

  async function fetchOne(id: string) {
    loading.value = true
    try {
      const { data } = await businessApi.get(id)
      current.value = data
      return data
    } finally {
      loading.value = false
    }
  }

  async function create(payload: any) {
    const { data } = await businessApi.create(payload)
    businesses.value.unshift(data)
    return data
  }

  async function update(id: string, payload: any) {
    const { data } = await businessApi.update(id, payload)
    const idx = businesses.value.findIndex(b => b.id === id)
    if (idx !== -1) businesses.value[idx] = { ...businesses.value[idx], ...data }
    if (current.value?.id === id) current.value = { ...current.value, ...data }
    return data
  }

  async function remove(id: string) {
    await businessApi.delete(id)
    businesses.value = businesses.value.filter(b => b.id !== id)
    if (current.value?.id === id) current.value = null
  }

  return { businesses, current, loading, fetchAll, fetchOne, create, update, remove }
})
