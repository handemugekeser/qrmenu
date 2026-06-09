<template>
  <div class="flex h-screen overflow-hidden bg-[#f8f8fb]">
    <!-- Sidebar -->
    <aside
      :class="['fixed inset-y-0 left-0 z-40 flex flex-col w-64 bg-white border-r border-gray-100 transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto',
               sidebarOpen ? 'translate-x-0' : '-translate-x-full']"
    >
      <!-- Logo -->
      <div class="flex items-center gap-3 px-5 h-16 border-b border-gray-100 shrink-0">
        <div class="flex flex-col items-center justify-center gap-0.5 shrink-0"
             style="width:40px;height:40px;border-radius:13px;background:linear-gradient(145deg,#8a9efc 0%,#6478f0 100%);box-shadow:0 3px 12px rgba(118,141,251,.38)">
          <span style="font-family:'Waldenburg','Waldenburg Fallback','Bricolage Grotesque',sans-serif;font-weight:800;font-size:19px;line-height:1;color:#fff;letter-spacing:-0.02em">Q</span>
        </div>
        <span style="font-family:'Waldenburg','Waldenburg Fallback','Bricolage Grotesque',sans-serif;font-weight:800;font-size:18px;letter-spacing:-0.03em;color:#111120">QRmenu</span>
        <span class="ml-auto">
          <span :class="planBadgeClass">{{ auth.user?.plan }}</span>
        </span>
      </div>

      <!-- Nav -->
      <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        <router-link to="/app" class="sidebar-link" :class="{ active: $route.name === 'dashboard' }">
          <LayoutDashboard :size="18" /> Dashboard
        </router-link>
        <router-link to="/app/businesses" class="sidebar-link"
          :class="{ active: $route.path.startsWith('/app/businesses') }">
          <Building2 :size="18" /> İşletmeler
        </router-link>

        <div v-if="currentBusiness" class="mt-3 mb-1">
          <p class="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            {{ currentBusiness.name }}
          </p>
          <template v-for="menu in currentBusiness.menus?.slice(0,5)" :key="menu.id">
            <button
              @click="toggleMenu(menu.id)"
              class="sidebar-link w-full justify-between"
              :class="{ active: expandedMenu === menu.id }"
            >
              <span class="flex items-center gap-3">
                <UtensilsCrossed :size="18" />
                <span class="truncate max-w-[110px]">{{ menu.name }}</span>
              </span>
              <ChevronDown :size="14" :class="expandedMenu === menu.id ? 'rotate-180' : ''" class="transition-transform" />
            </button>
            <div v-if="expandedMenu === menu.id" class="pl-4 space-y-0.5">
              <router-link
                :to="`/app/businesses/${currentBusiness.id}/menus/${menu.id}`"
                class="sidebar-link text-xs"
                :class="{ active: $route.name === 'menu-builder' && $route.params.menuId === menu.id }"
              >
                <List :size="15" /> Menü Düzenle
              </router-link>
              <router-link
                :to="`/app/businesses/${currentBusiness.id}/menus/${menu.id}/qrcodes`"
                class="sidebar-link text-xs"
                :class="{ active: $route.name === 'qrcodes' }"
              >
                <QrCode :size="15" /> QR Kodlar
              </router-link>
              <router-link
                :to="`/app/businesses/${currentBusiness.id}/menus/${menu.id}/analytics`"
                class="sidebar-link text-xs"
                :class="{ active: $route.name === 'analytics' }"
              >
                <BarChart3 :size="15" /> Analitik
              </router-link>
            </div>
          </template>
        </div>

        <div class="mt-3 border-t border-gray-100 pt-3 space-y-0.5">
          <router-link
            v-if="auth.isPro"
            to="/app/insights"
            class="sidebar-link"
            :class="{ active: $route.name === 'insights' }"
          >
            <Sparkles :size="18" />
            <span class="flex-1">{{ t('insights.sidebarLabel') }}</span>
            <span
              v-if="insightsStore.newCount > 0"
              class="ml-auto text-[10px] font-bold bg-red-500 text-white rounded-full min-w-[18px] h-[18px] inline-flex items-center justify-center px-1.5"
            >
              {{ insightsStore.newCount }}
            </span>
          </router-link>
          <router-link to="/app/subscription" class="sidebar-link" :class="{ active: $route.name === 'subscription' }">
            <CreditCard :size="18" /> Abonelik
          </router-link>
          <router-link to="/app/settings" class="sidebar-link" :class="{ active: $route.name === 'settings' }">
            <Settings :size="18" /> Ayarlar
          </router-link>
        </div>
      </nav>

      <!-- User -->
      <div class="p-3 border-t border-gray-100">
        <div class="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 cursor-pointer" @click="auth.logout(); $router.push('/login')">
          <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" style="background:rgba(118,141,251,.12);color:#5b73e8">
            {{ auth.user?.name?.[0]?.toUpperCase() }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-800 truncate">{{ auth.user?.name }}</p>
            <p class="text-xs text-gray-400 truncate">{{ auth.user?.email }}</p>
          </div>
          <LogOut :size="16" class="text-gray-400" />
        </div>
      </div>
    </aside>

    <!-- Overlay (mobile) -->
    <div v-if="sidebarOpen" @click="sidebarOpen = false"
         class="fixed inset-0 bg-black/30 z-30 lg:hidden" />

    <!-- Main -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top bar -->
      <header class="h-16 bg-white border-b border-gray-100 flex items-center gap-4 px-4 lg:px-6 shrink-0">
        <button @click="sidebarOpen = !sidebarOpen" class="lg:hidden p-2 rounded-lg hover:bg-gray-100">
          <Menu :size="20" />
        </button>
        <div class="flex-1">
          <h1 class="font-semibold text-gray-900 text-sm">{{ pageTitle }}</h1>
        </div>
        <NotificationBadge />
      </header>

      <!-- Content -->
      <main class="flex-1 overflow-y-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useBusinessStore } from '@/stores/business'
import { useInsightsStore } from '@/stores/insights'
import { useNotificationsStore } from '@/stores/notifications'
import NotificationBadge from '@/components/NotificationBadge.vue'
import {
  LayoutDashboard, Building2, UtensilsCrossed, QrCode, BarChart3,
  Settings, CreditCard, LogOut, Menu, List, ChevronDown, Sparkles
} from 'lucide-vue-next'

const { t } = useI18n()
const auth = useAuthStore()
const businessStore = useBusinessStore()
const insightsStore = useInsightsStore()
const route = useRoute()
const router = useRouter()

const sidebarOpen = ref(false)
const expandedMenu = ref<string | null>(null)

const currentBusiness = computed(() => {
  const bid = route.params.businessId as string
  return bid ? businessStore.businesses.find(b => b.id === bid) || businessStore.current : null
})

const pageTitle = computed(() => {
  const map: Record<string, string> = {
    'dashboard': 'Dashboard',
    'businesses': 'İşletmeler',
    'business-detail': 'İşletme Detayı',
    'menu-builder': 'Menü Düzenleyici',
    'qrcodes': 'QR Kodlar',
    'analytics': 'Analitik',
    'settings': 'Ayarlar',
    'subscription': 'Abonelik',
  }
  return map[route.name as string] || 'QRmenu'
})

const planBadgeClass = computed(() => {
  const plan = auth.user?.plan
  if (plan === 'PREMIUM') return 'badge badge-purple'
  if (plan === 'PRO') return 'badge badge-blue'
  return 'badge bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-semibold'
})

function toggleMenu(id: string) {
  expandedMenu.value = expandedMenu.value === id ? null : id
}

function previewMenu() {
  const bid = route.params.businessId as string
  const biz = businessStore.businesses.find(b => b.id === bid)
  if (biz) window.open(`/menu/${biz.slug}`, '_blank')
}

watch(() => route.params.menuId, (id) => {
  if (id) expandedMenu.value = id as string
}, { immediate: true })

const notificationsStore = useNotificationsStore()

onMounted(() => {
  businessStore.fetchAll()
  insightsStore.refreshCount()
  notificationsStore.startPolling()
})
</script>
