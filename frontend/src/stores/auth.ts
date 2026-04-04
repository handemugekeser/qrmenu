import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api'
import { useRouter } from 'vue-router'

interface User {
  id: string
  email: string
  name: string
  plan: 'FREE' | 'PRO' | 'PREMIUM'
  planExpiresAt?: string
  businesses?: any[]
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('qrmenu_token'))
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isPro = computed(() => user.value?.plan === 'PRO' || user.value?.plan === 'PREMIUM')
  const isPremium = computed(() => user.value?.plan === 'PREMIUM')

  async function login(email: string, password: string) {
    loading.value = true
    try {
      const { data } = await authApi.login({ email, password })
      token.value = data.token
      user.value = data.user
      localStorage.setItem('qrmenu_token', data.token)
      return data
    } finally {
      loading.value = false
    }
  }

  async function register(name: string, email: string, password: string) {
    loading.value = true
    try {
      const { data } = await authApi.register({ name, email, password })
      token.value = data.token
      user.value = data.user
      localStorage.setItem('qrmenu_token', data.token)
      return data
    } finally {
      loading.value = false
    }
  }

  async function fetchMe() {
    if (!token.value) return
    try {
      const { data } = await authApi.me()
      user.value = data
    } catch {
      logout()
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('qrmenu_token')
  }

  return { user, token, loading, isAuthenticated, isPro, isPremium, login, register, fetchMe, logout }
})
