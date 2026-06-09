<template>
  <div class="relative" @click.stop>
    <button
      type="button"
      class="relative p-2 rounded-lg hover:bg-gray-100 transition"
      :aria-label="t('notifications.openMenu')"
      @click="toggleOpen"
    >
      <Bell :size="20" class="text-gray-700" />
      <span
        v-if="notifications.unreadCount > 0"
        class="absolute top-1 right-1 min-w-[16px] h-[16px] inline-flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full px-1"
      >
        {{ displayCount }}
      </span>
    </button>

    <div
      v-if="open"
      class="absolute right-0 mt-2 w-80 max-h-[420px] overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-xl z-50"
    >
      <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h3 class="text-sm font-semibold text-gray-900">{{ t('notifications.title') }}</h3>
        <button
          v-if="notifications.unreadCount > 0"
          type="button"
          class="text-xs font-medium text-[#3b5bdb] hover:underline"
          @click="onMarkAllRead"
        >
          {{ t('notifications.markAllRead') }}
        </button>
      </div>

      <div v-if="notifications.isLoading" class="px-4 py-8 text-center text-sm text-gray-400">
        {{ t('notifications.loading') }}
      </div>

      <div v-else-if="notifications.items.length === 0" class="px-4 py-10 text-center">
        <BellOff :size="28" class="mx-auto text-gray-300" />
        <p class="mt-3 text-sm text-gray-500">{{ t('notifications.empty') }}</p>
      </div>

      <ul v-else class="divide-y divide-gray-100">
        <li
          v-for="n in notifications.items"
          :key="n.id"
          class="px-4 py-3 hover:bg-gray-50 cursor-pointer transition"
          :class="{ 'bg-[#f8f9ff]': !n.readAt }"
          @click="onItemClick(n)"
        >
          <div class="flex items-start gap-3">
            <div
              class="mt-1.5 w-2 h-2 rounded-full shrink-0"
              :class="n.readAt ? 'bg-transparent' : 'bg-[#3b5bdb]'"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-900 truncate">{{ n.title }}</p>
              <p class="text-xs text-gray-500 line-clamp-2 mt-0.5">{{ n.body }}</p>
              <p class="text-[11px] text-gray-400 mt-1">{{ formatTime(n.createdAt) }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Bell, BellOff } from 'lucide-vue-next'
import { useNotificationsStore } from '@/stores/notifications'
import type { AppNotification } from '@/api'

const { t, locale } = useI18n()
const router = useRouter()
const notifications = useNotificationsStore()

const open = ref(false)

const displayCount = computed(() =>
  notifications.unreadCount > 9 ? '9+' : String(notifications.unreadCount),
)

async function toggleOpen() {
  open.value = !open.value
  if (open.value) {
    await notifications.fetchAll()
  }
}

function closeOnOutside(e: MouseEvent) {
  if (!(e.target as HTMLElement).closest?.('.relative')) {
    open.value = false
  }
}

async function onMarkAllRead() {
  await notifications.markAllRead()
}

async function onItemClick(n: AppNotification) {
  if (!n.readAt) await notifications.markRead(n.id)
  open.value = false
  if (n.type === 'WEEKLY_INSIGHTS_READY') {
    void router.push('/app/insights')
  }
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString(locale.value, { dateStyle: 'medium', timeStyle: 'short' })
}

onMounted(() => {
  document.addEventListener('click', closeOnOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeOnOutside)
})
</script>
