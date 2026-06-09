import { defineStore } from 'pinia'
import { ref } from 'vue'
import { notificationsApi, type AppNotification, type NotificationPreferences } from '@/api'
import { useAuthStore } from '@/stores/auth'

const POLL_INTERVAL_MS = 60_000

export const useNotificationsStore = defineStore('notifications', () => {
  const unreadCount = ref(0)
  const items = ref<AppNotification[]>([])
  const preferences = ref<NotificationPreferences | null>(null)
  const isLoading = ref(false)
  let timer: ReturnType<typeof setInterval> | null = null

  async function fetchUnreadCount() {
    const auth = useAuthStore()
    if (!auth.token) return
    try {
      const { data } = await notificationsApi.unreadCount()
      unreadCount.value = data.count
    } catch {
      // silent — badge non-critical
    }
  }

  async function fetchAll() {
    const auth = useAuthStore()
    if (!auth.token) return
    isLoading.value = true
    try {
      const { data } = await notificationsApi.list()
      items.value = data
      unreadCount.value = data.filter((n) => !n.readAt).length
    } finally {
      isLoading.value = false
    }
  }

  async function markAllRead() {
    await notificationsApi.markAllRead()
    unreadCount.value = 0
    items.value = items.value.map((n) => (n.readAt ? n : { ...n, readAt: new Date().toISOString() }))
  }

  async function markRead(id: string) {
    await notificationsApi.markRead(id)
    const item = items.value.find((n) => n.id === id)
    if (item && !item.readAt) {
      item.readAt = new Date().toISOString()
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    }
  }

  async function loadPreferences() {
    const { data } = await notificationsApi.getPreferences()
    preferences.value = data
  }

  async function updatePreferences(patch: Partial<NotificationPreferences>) {
    const { data } = await notificationsApi.updatePreferences(patch)
    preferences.value = data
    return data
  }

  function startPolling() {
    if (timer) return
    void fetchUnreadCount()
    timer = setInterval(() => {
      void fetchUnreadCount()
    }, POLL_INTERVAL_MS)
  }

  function stopPolling() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  return {
    unreadCount,
    items,
    preferences,
    isLoading,
    fetchUnreadCount,
    fetchAll,
    markAllRead,
    markRead,
    loadPreferences,
    updatePreferences,
    startPolling,
    stopPolling,
  }
})
