<template>
  <div class="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
    <!-- Paywall for free users -->
    <div v-if="!auth.isPro" class="card p-8 lg:p-10 text-center">
      <div class="w-14 h-14 rounded-2xl bg-[#768dfb]/10 flex items-center justify-center mx-auto mb-5">
        <Sparkles :size="26" class="text-[#5b73e8]" />
      </div>
      <h2 class="text-xl lg:text-2xl font-bold text-gray-900 mb-2">{{ t('insights.upgradeTitle') }}</h2>
      <p class="text-gray-500 max-w-md mx-auto leading-relaxed">{{ t('insights.upgradeRequired') }}</p>
      <router-link
        :to="{ path: '/app/subscription', query: { plan: 'PRO' } }"
        class="btn-primary mt-6 inline-flex"
      >
        <Zap :size="16" /> {{ t('insights.upgradeCta') }}
      </router-link>
    </div>

    <template v-else>
      <!-- Header -->
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ t('insights.pageTitle') }}</h1>
          <p class="text-gray-500 text-sm mt-1">
            <template v-if="latestWeek">{{ subText }}</template>
            <template v-else>{{ t('insights.pageSubEmpty') }}</template>
          </p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="inline-flex p-1 bg-white rounded-xl border border-gray-100 shadow-sm gap-1">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="[
            'px-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2',
            activeTab === tab.key
              ? 'bg-[#768dfb] text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-800',
          ]"
        >
          {{ tab.label }}
          <span
            v-if="counts[tab.countKey] > 0"
            :class="[
              'text-[11px] font-semibold rounded-full px-2 py-0.5 leading-none',
              activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600',
            ]"
          >
            {{ counts[tab.countKey] }}
          </span>
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-16">
        <Loader2 :size="28" class="animate-spin text-[#768dfb]" />
      </div>

      <!-- Error -->
      <div v-else-if="error" class="card p-10 text-center">
        <AlertCircle :size="32" class="text-red-400 mx-auto mb-3" />
        <p class="text-gray-600 mb-4">{{ t('insights.loadError') }}</p>
        <button @click="load" class="btn-primary mx-auto">
          <RefreshCw :size="16" /> {{ t('insights.retry') }}
        </button>
      </div>

      <!-- Empty -->
      <div v-else-if="items.length === 0" class="card p-12 text-center">
        <div class="w-12 h-12 rounded-2xl bg-[#768dfb]/10 flex items-center justify-center mx-auto mb-4">
          <Sparkles :size="22" class="text-[#5b73e8]" />
        </div>
        <h3 class="text-base font-semibold text-gray-900 mb-1">{{ emptyTitle }}</h3>
        <p class="text-sm text-gray-500 max-w-sm mx-auto">{{ emptySub }}</p>
      </div>

      <!-- Cards -->
      <div v-else class="space-y-4">
        <article
          v-for="insight in items"
          :key="insight.id"
          class="card p-5 lg:p-6 transition-all"
          :class="{ 'opacity-75': insight.status === 'APPLIED' || insight.status === 'DISMISSED' }"
        >
          <!-- Top row: severity + week -->
          <div class="flex items-center justify-between mb-3 gap-3">
            <span
              :class="[
                'inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full',
                severityStyle(insight.severity),
              ]"
            >
              <span :class="['w-1.5 h-1.5 rounded-full', severityDot(insight.severity)]" />
              {{ severityLabel(insight.severity) }}
            </span>
            <span class="text-xs text-gray-400">{{ formatWeek(insight.weekOf) }}</span>
          </div>

          <!-- Body -->
          <h3 class="text-lg font-bold text-gray-900 leading-snug mb-2">{{ insight.title }}</h3>
          <p class="text-sm text-gray-600 leading-relaxed mb-5 whitespace-pre-line">{{ insight.body }}</p>

          <!-- Actions -->
          <div v-if="insight.status === 'NEW' || insight.status === 'VIEWED'" class="flex flex-wrap items-center gap-2">
            <button
              v-if="actionLabel(insight)"
              @click="onAction(insight)"
              class="btn-primary"
            >
              {{ actionLabel(insight) }} <ArrowRight :size="14" />
            </button>
            <button
              @click="onApply(insight)"
              :disabled="busy[insight.id]"
              class="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 bg-white text-gray-700 hover:border-[#768dfb]/40 hover:text-[#5b73e8] transition-colors disabled:opacity-50"
            >
              <Check :size="14" /> {{ t('insights.applyBtn') }}
            </button>
            <button
              @click="onDismiss(insight)"
              :disabled="busy[insight.id]"
              class="inline-flex items-center justify-center px-3 py-2 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {{ t('insights.dismissBtn') }}
            </button>
          </div>

          <div v-else class="flex items-center gap-2 text-xs">
            <span
              :class="insight.status === 'APPLIED' ? 'badge-blue' : 'bg-gray-100 text-gray-500 inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold'"
            >
              <Check v-if="insight.status === 'APPLIED'" :size="12" />
              {{ insight.status === 'APPLIED' ? t('insights.appliedTag') : t('insights.dismissedTag') }}
            </span>
          </div>
        </article>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  ArrowRight, AlertCircle, Check, Loader2, RefreshCw, Sparkles, Zap,
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useInsightsStore } from '@/stores/insights'
import { insightsApi, type Insight, type InsightSeverity, type InsightStatusFilter } from '@/api'

const { t, locale } = useI18n()
const auth = useAuthStore()
const insightsStore = useInsightsStore()
const router = useRouter()

type TabKey = 'new' | 'applied' | 'dismissed'

const activeTab = ref<TabKey>('new')
const items = ref<Insight[]>([])
const counts = reactive({ new: 0, viewed: 0, applied: 0, dismissed: 0 })
const loading = ref(false)
const error = ref(false)
const busy = reactive<Record<string, boolean>>({})

const tabs = computed(() => [
  { key: 'new' as TabKey, label: t('insights.tabNew'), countKey: 'new' as const },
  { key: 'applied' as TabKey, label: t('insights.tabApplied'), countKey: 'applied' as const },
  { key: 'dismissed' as TabKey, label: t('insights.tabDismissed'), countKey: 'dismissed' as const },
])

const filterParam = computed<InsightStatusFilter>(() => activeTab.value)

const latestWeek = computed(() => items.value[0]?.weekOf || null)

const subText = computed(() => {
  if (!latestWeek.value) return ''
  return t('insights.pageSub', {
    count: counts.new,
    date: formatDate(latestWeek.value),
  })
})

const emptyTitle = computed(() => {
  if (activeTab.value === 'applied') return t('insights.emptyAppliedTitle')
  if (activeTab.value === 'dismissed') return t('insights.emptyDismissedTitle')
  return t('insights.emptyTitle')
})

const emptySub = computed(() => {
  if (activeTab.value === 'applied') return t('insights.emptyAppliedSub')
  if (activeTab.value === 'dismissed') return t('insights.emptyDismissedSub')
  return t('insights.emptySub')
})

async function load() {
  if (!auth.isPro) return
  loading.value = true
  error.value = false
  try {
    const { data } = await insightsApi.list(filterParam.value)
    items.value = data.items
    Object.assign(counts, data.counts)
    insightsStore.setCount(data.counts.new)
    markVisibleAsViewed()
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

function markVisibleAsViewed() {
  if (activeTab.value !== 'new') return
  for (const insight of items.value) {
    if (insight.status === 'NEW') {
      insightsApi.view(insight.id).catch(() => {})
    }
  }
}

async function onApply(insight: Insight) {
  if (busy[insight.id]) return
  busy[insight.id] = true
  const previous = insight.status
  insight.status = 'APPLIED'
  counts.new = Math.max(0, counts.new - 1)
  counts.applied += 1
  insightsStore.decrement()
  try {
    await insightsApi.apply(insight.id)
    pruneIfFiltered(insight)
  } catch {
    insight.status = previous
    counts.new += 1
    counts.applied = Math.max(0, counts.applied - 1)
    insightsStore.setCount(counts.new)
  } finally {
    busy[insight.id] = false
  }
}

async function onDismiss(insight: Insight) {
  if (busy[insight.id]) return
  busy[insight.id] = true
  const previous = insight.status
  insight.status = 'DISMISSED'
  counts.new = Math.max(0, counts.new - 1)
  counts.dismissed += 1
  insightsStore.decrement()
  try {
    await insightsApi.dismiss(insight.id)
    pruneIfFiltered(insight)
  } catch {
    insight.status = previous
    counts.new += 1
    counts.dismissed = Math.max(0, counts.dismissed - 1)
    insightsStore.setCount(counts.new)
  } finally {
    busy[insight.id] = false
  }
}

function pruneIfFiltered(insight: Insight) {
  const stillMatches =
    activeTab.value === 'applied' && insight.status === 'APPLIED' ||
    activeTab.value === 'dismissed' && insight.status === 'DISMISSED' ||
    activeTab.value === 'new' && insight.status === 'NEW'
  if (!stillMatches) {
    items.value = items.value.filter((i) => i.id !== insight.id)
  }
}

function onAction(insight: Insight) {
  const target = actionRoute(insight)
  if (target) router.push(target)
}

function actionRoute(insight: Insight): string | null {
  const data = insight.actionData || {}
  switch (insight.actionType) {
    case 'edit_item':
    case 'review_pricing':
      return data.itemId ? `/app/businesses/${insight.businessId}` : null
    case 'add_translation':
      return `/app/businesses/${insight.businessId}`
    case 'reorder_category':
      return `/app/businesses/${insight.businessId}`
    default:
      return null
  }
}

function actionLabel(insight: Insight): string | null {
  switch (insight.actionType) {
    case 'edit_item': return t('insights.actionEditItem')
    case 'review_pricing': return t('insights.actionReviewPricing')
    case 'add_translation': return t('insights.actionAddTranslation')
    case 'reorder_category': return t('insights.actionReorderCategory')
    default: return null
  }
}

function severityLabel(s: InsightSeverity): string {
  if (s === 'IMPORTANT') return t('insights.severityImportant')
  if (s === 'SUGGESTION') return t('insights.severitySuggestion')
  return t('insights.severityInfo')
}

function severityStyle(s: InsightSeverity): string {
  if (s === 'IMPORTANT') return 'bg-red-50 text-red-600'
  if (s === 'SUGGESTION') return 'bg-amber-50 text-amber-700'
  return 'bg-[#768dfb]/10 text-[#5b73e8]'
}

function severityDot(s: InsightSeverity): string {
  if (s === 'IMPORTANT') return 'bg-red-500'
  if (s === 'SUGGESTION') return 'bg-amber-500'
  return 'bg-[#768dfb]'
}

function intlLocale(): string {
  if (locale.value === 'tr') return 'tr-TR'
  if (locale.value === 'ar') return 'ar-SA'
  return 'en-US'
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString(intlLocale(), { day: 'numeric', month: 'long' })
}

function formatWeek(iso: string): string {
  return t('insights.weekOf', { date: formatDate(iso) })
}

watch(activeTab, () => load())
onMounted(() => load())
</script>

