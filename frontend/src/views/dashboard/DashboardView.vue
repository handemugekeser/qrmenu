<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useBusinessStore } from '@/stores/business'
import { businessApi } from '@/api'
import { useToast } from '@/composables/useToast'
import AppModal from '@/components/ui/AppModal.vue'
import UpgradeModal from '@/components/ui/UpgradeModal.vue'
import {
  Plus, Building2, UtensilsCrossed, QrCode, BarChart3, Loader2,
  TrendingUp, TrendingDown, Sparkles, ArrowUpRight, Activity,
  Crown, Settings
} from 'lucide-vue-next'

import { scansTrend, topMenus, topProducts } from '@/mocks/dashboardStats'
import { activityFeed } from '@/mocks/activityFeed'

const router = useRouter()
const auth = useAuthStore()
const businessStore = useBusinessStore()
const toast = useToast()

const PLAN_LIMITS = {
  FREE: { maxBusinesses: 1 },
  PRO: { maxBusinesses: 3 },
  PREMIUM: { maxBusinesses: -1 },
}

const showCreateBusiness = ref(false)
const creating = ref(false)
const showUpgrade = ref(false)
const upgradeMessage = ref('')
const slugStatus = ref<'available' | 'taken' | null>(null)
const newBiz = ref({ name: '', slug: '', phone: '' })

const firstName = computed(() => auth.user?.name?.split(' ')[0] || 'Kullanıcı')

const totalScans30d = computed(() => scansTrend.reduce((a, p) => a + p.scans, 0))
const todayScans = computed(() => scansTrend[scansTrend.length - 1]?.scans ?? 0)

const stats = computed(() => [
  {
    label: 'İŞLETMELER',
    value: businessStore.businesses.length,
    sub: 'toplam',
    icon: Building2,
  },
  {
    label: 'MENÜLER',
    value: businessStore.businesses.reduce((a, b) => a + (b._count?.menus || 0), 0),
    sub: 'aktif menü',
    icon: UtensilsCrossed,
  },
  {
    label: 'BU AY TARAMA',
    value: totalScans30d.value.toLocaleString('tr-TR'),
    sub: `bugün +${todayScans.value}`,
    icon: BarChart3,
  },
  {
    label: 'PLAN',
    value: auth.user?.plan || 'FREE',
    sub: 'mevcut abonelik',
    icon: Crown,
  },
])

// --- Chart helpers ---
const W = 700
const H = 160
const maxScan = computed(() => Math.max(...scansTrend.map(p => p.scans)) * 1.1)

const linePath = computed(() => {
  const n = scansTrend.length
  return scansTrend.map((p, i) => {
    const x = (i / (n - 1)) * W
    const y = H - (p.scans / maxScan.value) * H
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
  }).join(' ')
})
const areaPath = computed(() => `${linePath.value} L ${W} ${H} L 0 ${H} Z`)

const lastDate = computed(() => scansTrend[scansTrend.length - 1]?.date)
const firstDate = computed(() => scansTrend[0]?.date)

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })
}

async function openCreate() {
  const plan = (auth.user?.plan || 'FREE') as 'FREE' | 'PRO' | 'PREMIUM'
  const limit = PLAN_LIMITS[plan]?.maxBusinesses ?? 1
  const count = businessStore.businesses.length

  if (limit !== -1 && count >= limit) {
    upgradeMessage.value = `${plan === 'FREE' ? 'Free planda' : 'Pro planda'} en fazla ${limit} işletme ekleyebilirsiniz. Daha fazla işletme eklemek için aboneliğinizi yükseltin.`
    showUpgrade.value = true
    return
  }
  showCreateBusiness.value = true
}

function autoSlug() {
  newBiz.value.slug = newBiz.value.name
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  slugStatus.value = null
}

let slugTimer: any
watch(() => newBiz.value.slug, async (slug) => {
  if (!slug) return
  clearTimeout(slugTimer)
  slugTimer = setTimeout(async () => {
    try {
      const { data } = await businessApi.checkSlug(slug)
      slugStatus.value = data.available ? 'available' : 'taken'
    } catch {}
  }, 500)
})

async function createBusiness() {
  if (slugStatus.value === 'taken') return
  creating.value = true
  try {
    await businessStore.create(newBiz.value)
    showCreateBusiness.value = false
    newBiz.value = { name: '', slug: '', phone: '' }
    toast.success('İşletme oluşturuldu!')
  } catch (e: any) {
    if (e.response?.status === 403) {
      showCreateBusiness.value = false
      upgradeMessage.value = e.response?.data?.message || 'Plan limitine ulaştınız.'
      showUpgrade.value = true
    } else {
      toast.error(e.response?.data?.message || 'Hata oluştu')
    }
  } finally {
    creating.value = false
  }
}

function goToFirstMenu() {
  const biz = businessStore.businesses[0]
  if (biz) router.push(`/app/businesses/${biz.id}`)
  else openCreate()
}

function goToFirstQr() {
  const biz = businessStore.businesses[0]
  if (biz) router.push(`/app/businesses/${biz.id}`)
  else openCreate()
}

const quickActions = [
  { label: 'Yeni İşletme', desc: 'Hızlıca ekle', icon: Building2, onClick: openCreate, accent: '#3b5bdb' },
  { label: 'Yeni Menü', desc: 'Menü oluştur', icon: UtensilsCrossed, onClick: goToFirstMenu, accent: '#10b981' },
  { label: 'QR Kodlar', desc: 'Masa yönet', icon: QrCode, onClick: goToFirstQr, accent: '#a855f7' },
  { label: 'AI Insights', desc: 'Öneriler', icon: Sparkles, onClick: () => router.push('/app/insights'), accent: '#f59e0b' },
]

onMounted(() => businessStore.fetchAll())
</script>

<template>
  <div class="dash">
    <!-- ── Hero / Welcome ─────────────────────────────────── -->
    <section class="hero">
      <div class="hero-text">
        <span class="tag">PANEL</span>
        <h1 class="hero-title">Merhaba, {{ firstName }}</h1>
        <p class="hero-sub">İşletmelerinizin son 30 günlük gerçek zamanlı görünümü.</p>
      </div>
      <div class="hero-actions">
        <button class="btn-primary" @click="openCreate">
          <Plus :size="15" /> Yeni İşletme
        </button>
      </div>
      <div class="hero-orbs"></div>
    </section>

    <!-- ── Stats row ──────────────────────────────────────── -->
    <section class="stats">
      <div v-for="s in stats" :key="s.label" class="stat-card">
        <div class="stat-head">
          <span class="tag">{{ s.label }}</span>
          <div class="stat-ico"><component :is="s.icon" :size="15" /></div>
        </div>
        <div class="stat-num">{{ s.value }}</div>
        <div class="stat-foot">{{ s.sub }}</div>
      </div>
    </section>

    <!-- ── Trend Chart ────────────────────────────────────── -->
    <section class="card chart-card">
      <div class="card-head">
        <div>
          <span class="tag">TARAMA TRENDİ</span>
          <h3 class="card-title">Son 30 gün</h3>
        </div>
        <div class="chart-stats">
          <div class="chart-stat">
            <div class="cs-num">{{ totalScans30d.toLocaleString('tr-TR') }}</div>
            <div class="cs-lab">toplam</div>
          </div>
          <div class="chart-stat">
            <div class="cs-num">{{ Math.round(totalScans30d / 30) }}</div>
            <div class="cs-lab">günlük ort.</div>
          </div>
        </div>
      </div>
      <div class="chart-wrap">
        <svg :viewBox="`0 0 ${W} ${H}`" preserveAspectRatio="none" class="chart-svg">
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#3b5bdb" stop-opacity="0.30" />
              <stop offset="100%" stop-color="#3b5bdb" stop-opacity="0" />
            </linearGradient>
          </defs>
          <path :d="areaPath" fill="url(#areaGrad)" />
          <path :d="linePath" fill="none" stroke="#3b5bdb" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <div class="chart-axis">
          <span>{{ fmtDate(firstDate) }}</span>
          <span>{{ fmtDate(scansTrend[Math.floor(scansTrend.length / 2)].date) }}</span>
          <span>{{ fmtDate(lastDate) }}</span>
        </div>
      </div>
    </section>

    <!-- ── Quick actions ──────────────────────────────────── -->
    <section class="qa-row">
      <div
        v-for="a in quickActions"
        :key="a.label"
        class="qa-card"
        @click="a.onClick"
      >
        <div class="qa-ico" :style="{ background: a.accent + '15', color: a.accent }">
          <component :is="a.icon" :size="18" />
        </div>
        <div class="qa-text">
          <p class="qa-title">{{ a.label }}</p>
          <p class="qa-desc">{{ a.desc }}</p>
        </div>
        <ArrowUpRight :size="15" class="qa-arrow" />
      </div>
    </section>

    <!-- ── Two-col: activity + top ───────────────────────── -->
    <section class="two-col">
      <!-- Activity feed -->
      <div class="card">
        <div class="card-head">
          <div>
            <span class="tag">AKTİVİTE</span>
            <h3 class="card-title">Son hareketler</h3>
          </div>
          <Activity :size="16" class="head-ico" />
        </div>
        <ul class="feed">
          <li v-for="a in activityFeed" :key="a.id" class="feed-item">
            <div class="feed-dot" :style="{ background: a.color }"></div>
            <div class="feed-body">
              <p class="feed-title">{{ a.title }}</p>
              <p class="feed-meta">{{ a.meta }}</p>
            </div>
            <span class="feed-ago">{{ a.ago }}</span>
          </li>
        </ul>
      </div>

      <!-- Top menus + products -->
      <div class="stacked">
        <div class="card">
          <div class="card-head">
            <div>
              <span class="tag">TOP MENÜLER</span>
              <h3 class="card-title">En çok izlenenler</h3>
            </div>
          </div>
          <ul class="top-menus">
            <li v-for="(m, i) in topMenus" :key="m.id" class="tm-item">
              <span class="tm-rank">#{{ i + 1 }}</span>
              <div class="tm-theme" :style="{ background: m.themeColor + '22', color: m.themeColor }">
                <UtensilsCrossed :size="14" />
              </div>
              <div class="tm-info">
                <p class="tm-name">{{ m.name }}</p>
                <p class="tm-biz">{{ m.business }}</p>
              </div>
              <div class="tm-meta">
                <div class="tm-scans">{{ m.scans.toLocaleString('tr-TR') }}</div>
                <div :class="['tm-trend', m.trend >= 0 ? 'up' : 'down']">
                  <TrendingUp v-if="m.trend >= 0" :size="11" />
                  <TrendingDown v-else :size="11" />
                  {{ Math.abs(m.trend) }}%
                </div>
              </div>
            </li>
          </ul>
        </div>

        <div class="card">
          <div class="card-head">
            <div>
              <span class="tag">TOP ÜRÜNLER</span>
              <h3 class="card-title">En çok görüntülenenler</h3>
            </div>
          </div>
          <ul class="top-products">
            <li v-for="(p, i) in topProducts" :key="p.id" class="tp-item">
              <span class="tp-rank">{{ i + 1 }}</span>
              <div class="tp-info">
                <p class="tp-name">{{ p.name }}</p>
                <p class="tp-cat">{{ p.category }}</p>
              </div>
              <div class="tp-meta">
                <span class="tp-views">{{ p.views }} görüntüleme</span>
                <span class="tp-price">{{ p.price }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- ── Existing businesses ─────────────────────────────── -->
    <section v-if="businessStore.businesses.length" class="card">
      <div class="card-head">
        <div>
          <span class="tag">İŞLETMELERİNİZ</span>
          <h3 class="card-title">{{ businessStore.businesses.length }} kayıt</h3>
        </div>
        <button class="link-btn" @click="router.push('/app/businesses')">
          Tümünü gör <ArrowUpRight :size="13" />
        </button>
      </div>
      <div class="biz-grid">
        <router-link
          v-for="biz in businessStore.businesses.slice(0, 6)"
          :key="biz.id"
          :to="`/app/businesses/${biz.id}`"
          class="biz-card"
        >
          <div class="biz-init">{{ biz.name[0]?.toUpperCase() }}</div>
          <div class="biz-info">
            <h4 class="biz-name">{{ biz.name }}</h4>
            <p class="biz-slug">/menu/{{ biz.slug }}</p>
            <div class="biz-pills">
              <span class="bp blue">{{ biz._count?.menus || 0 }} menü</span>
              <span :class="['bp', biz.isActive ? 'green' : 'gray']">
                {{ biz.isActive ? 'Aktif' : 'Pasif' }}
              </span>
            </div>
          </div>
        </router-link>
      </div>
    </section>

    <!-- Empty state -->
    <section v-else-if="!businessStore.loading" class="empty-card">
      <Building2 :size="38" class="empty-ico" />
      <h3 class="empty-title">Henüz işletmeniz yok</h3>
      <p class="empty-desc">İlk işletmenizi oluşturarak menü tasarlamaya başlayın.</p>
      <button class="btn-primary" @click="openCreate"><Plus :size="15" /> İlk İşletme</button>
    </section>

    <UpgradeModal v-model="showUpgrade" :message="upgradeMessage" />

    <AppModal v-model="showCreateBusiness" title="Yeni İşletme">
      <form @submit.prevent="createBusiness" class="space-y-4">
        <div>
          <label class="label">İşletme Adı</label>
          <input v-model="newBiz.name" @input="autoSlug" class="input" placeholder="Örn: Kebapçı Ahmet" required />
        </div>
        <div>
          <label class="label">URL Slug</label>
          <div class="flex">
            <span class="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl text-xs text-gray-400">
              /menu/
            </span>
            <input v-model="newBiz.slug" class="input rounded-l-none" placeholder="kebapci-ahmet" required
                   pattern="[a-z0-9-]+" />
          </div>
          <p v-if="slugStatus" :class="['text-xs mt-1', slugStatus === 'available' ? 'text-emerald-600' : 'text-red-500']">
            {{ slugStatus === 'available' ? '✓ Kullanılabilir' : '✗ Bu slug kullanılıyor' }}
          </p>
        </div>
        <div>
          <label class="label">Telefon (opsiyonel)</label>
          <input v-model="newBiz.phone" class="input" placeholder="+90 5XX XXX XX XX" />
        </div>
      </form>
      <template #footer>
        <button @click="showCreateBusiness = false" class="btn-secondary">İptal</button>
        <button @click="createBusiness" class="btn-primary" :disabled="creating">
          <Loader2 v-if="creating" :size="16" class="animate-spin" />
          Oluştur
        </button>
      </template>
    </AppModal>
  </div>
</template>

<style scoped>
.dash {
  --bg: #f8f9ff;
  --sur: #ffffff;
  --ink: #0d1b3e;
  --ink-2: rgba(13,27,62,0.62);
  --ink-3: rgba(13,27,62,0.42);
  --brand: #3b5bdb;
  --brand-soft: rgba(59,91,219,0.10);
  --line: rgba(13,27,62,0.08);
  --f-display: 'Geist', system-ui, sans-serif;
  --f-body: 'Inter', system-ui, sans-serif;
  padding: clamp(18px, 3vw, 28px);
  display: flex; flex-direction: column; gap: 18px;
  max-width: 1280px; margin: 0 auto;
  background: var(--bg);
  font-family: var(--f-body);
  color: var(--ink);
}

.tag {
  display: inline-flex; align-items: center;
  font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--brand);
  border: 1px solid rgba(59,91,219,0.22);
  background: rgba(59,91,219,0.05);
  border-radius: 100px; padding: 4px 10px;
}

/* Hero */
.hero {
  position: relative;
  display: flex; align-items: center; justify-content: space-between; gap: 20px;
  padding: 28px 32px;
  border-radius: 20px;
  background: linear-gradient(135deg, #0d1b3e 0%, #1a2f6b 100%);
  color: #fff;
  overflow: hidden;
  box-shadow: 0 12px 32px rgba(13,27,62,0.18);
}
.hero .tag { color: #8aa0fc; border-color: rgba(255,255,255,0.18); background: rgba(255,255,255,0.06); }
.hero-text { position: relative; z-index: 2; }
.hero-title { font-family: var(--f-display); font-weight: 800; font-size: clamp(22px, 3vw, 30px); letter-spacing: -0.025em; margin: 10px 0 6px; }
.hero-sub { color: rgba(255,255,255,0.72); font-size: 14px; margin: 0; }
.hero-actions { position: relative; z-index: 2; }
.hero-orbs {
  position: absolute; right: -40px; top: -30px; width: 320px; height: 320px;
  background: radial-gradient(circle at center, rgba(138,160,252,0.30), transparent 60%);
  pointer-events: none;
}

.btn-primary {
  display: inline-flex; align-items: center; gap: 6px;
  background: #fff; color: #0d1b3e;
  border: none; border-radius: 100px;
  padding: 11px 20px; font-size: 13px; font-weight: 600;
  cursor: pointer; font-family: inherit;
  transition: opacity .15s, transform .15s;
}
.btn-primary:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

/* Stats */
.stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; }
.stat-card {
  background: var(--sur);
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 18px 20px;
  transition: transform .2s, box-shadow .2s;
}
.stat-card:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(13,27,62,0.05); }
.stat-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.stat-ico { width: 30px; height: 30px; border-radius: 10px; background: var(--brand-soft); color: var(--brand); display: inline-flex; align-items: center; justify-content: center; }
.stat-num { font-family: var(--f-display); font-weight: 800; font-size: 28px; letter-spacing: -0.02em; line-height: 1.05; color: var(--ink); }
.stat-foot { font-size: 11.5px; color: var(--ink-2); margin-top: 6px; }

/* Card base */
.card {
  background: var(--sur);
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 22px;
}
.card-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 16px; }
.card-title { font-family: var(--f-display); font-weight: 700; font-size: 16px; letter-spacing: -0.02em; margin: 8px 0 0; color: var(--ink); }
.head-ico { color: var(--ink-3); }
.link-btn {
  background: none; border: none; cursor: pointer;
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 12px; font-weight: 600; color: var(--brand);
  font-family: inherit;
}
.link-btn:hover { text-decoration: underline; }

/* Chart */
.chart-card .chart-stats { display: flex; gap: 22px; }
.chart-stat { text-align: right; }
.cs-num { font-family: var(--f-display); font-weight: 700; font-size: 18px; color: var(--ink); line-height: 1; }
.cs-lab { font-size: 10.5px; color: var(--ink-2); margin-top: 4px; text-transform: uppercase; letter-spacing: 0.08em; }

.chart-wrap { position: relative; }
.chart-svg { width: 100%; height: 180px; display: block; }
.chart-axis { display: flex; justify-content: space-between; font-size: 11px; color: var(--ink-2); margin-top: 6px; padding: 0 4px; }

/* Quick actions */
.qa-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; }
.qa-card {
  display: flex; align-items: center; gap: 12px;
  background: var(--sur);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 14px 16px;
  cursor: pointer;
  transition: transform .15s, box-shadow .15s, border-color .15s;
}
.qa-card:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(13,27,62,0.06); border-color: rgba(59,91,219,0.22); }
.qa-ico { width: 38px; height: 38px; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
.qa-text { flex: 1; min-width: 0; }
.qa-title { font-size: 13.5px; font-weight: 600; color: var(--ink); margin: 0; }
.qa-desc { font-size: 11.5px; color: var(--ink-2); margin: 2px 0 0; }
.qa-arrow { color: var(--ink-3); }

/* Two col */
.two-col { display: grid; grid-template-columns: 1.2fr 1fr; gap: 14px; }
@media (max-width: 1000px) { .two-col { grid-template-columns: 1fr; } }
.stacked { display: flex; flex-direction: column; gap: 14px; }

/* Feed */
.feed { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
.feed-item { display: flex; align-items: center; gap: 12px; padding: 11px 0; border-bottom: 1px solid var(--line); }
.feed-item:last-child { border-bottom: none; }
.feed-dot { width: 8px; height: 8px; border-radius: 100px; flex-shrink: 0; box-shadow: 0 0 0 3px rgba(13,27,62,0.04); }
.feed-body { flex: 1; min-width: 0; }
.feed-title { font-size: 13px; font-weight: 600; color: var(--ink); margin: 0; }
.feed-meta { font-size: 11.5px; color: var(--ink-2); margin: 2px 0 0; }
.feed-ago { font-size: 11px; color: var(--ink-3); white-space: nowrap; }

/* Top menus */
.top-menus { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
.tm-item { display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 12px; transition: background .12s; }
.tm-item:hover { background: rgba(59,91,219,0.04); }
.tm-rank { font-family: var(--f-display); font-weight: 700; font-size: 13px; color: var(--ink-3); width: 24px; }
.tm-theme { width: 32px; height: 32px; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
.tm-info { flex: 1; min-width: 0; }
.tm-name { font-size: 13px; font-weight: 600; color: var(--ink); margin: 0; }
.tm-biz { font-size: 11px; color: var(--ink-2); margin: 2px 0 0; }
.tm-meta { text-align: right; }
.tm-scans { font-family: var(--f-display); font-weight: 700; font-size: 13px; color: var(--ink); line-height: 1; }
.tm-trend { display: inline-flex; align-items: center; gap: 3px; font-size: 10.5px; font-weight: 600; margin-top: 4px; }
.tm-trend.up { color: #059669; }
.tm-trend.down { color: #dc2626; }

/* Top products */
.top-products { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
.tp-item { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid var(--line); }
.tp-item:last-child { border-bottom: none; }
.tp-rank {
  font-family: var(--f-display); font-weight: 700; font-size: 11px;
  width: 22px; height: 22px;
  border-radius: 100px;
  background: var(--brand-soft); color: var(--brand);
  display: inline-flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.tp-info { flex: 1; min-width: 0; }
.tp-name { font-size: 12.5px; font-weight: 600; color: var(--ink); margin: 0; }
.tp-cat { font-size: 11px; color: var(--ink-2); margin: 2px 0 0; }
.tp-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }
.tp-views { font-size: 11px; color: var(--ink-2); }
.tp-price { font-family: var(--f-display); font-weight: 700; font-size: 12.5px; color: var(--brand); }

/* Businesses grid */
.biz-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 12px; }
.biz-card {
  display: flex; gap: 12px; padding: 14px;
  background: rgba(13,27,62,0.02);
  border: 1px solid var(--line);
  border-radius: 14px;
  text-decoration: none;
  transition: transform .15s, border-color .15s, box-shadow .15s;
}
.biz-card:hover { transform: translateY(-2px); border-color: rgba(59,91,219,0.25); box-shadow: 0 8px 20px rgba(13,27,62,0.05); }
.biz-init {
  width: 44px; height: 44px; border-radius: 13px;
  background: linear-gradient(135deg, #3b5bdb, #768dfb);
  color: #fff; font-weight: 800; font-size: 17px;
  display: inline-flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.biz-info { flex: 1; min-width: 0; }
.biz-name { font-size: 14px; font-weight: 600; color: var(--ink); margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.biz-slug { font-size: 11px; color: var(--ink-2); margin: 2px 0 0; }
.biz-pills { display: flex; gap: 6px; margin-top: 8px; }
.bp { font-size: 10.5px; font-weight: 600; padding: 3px 8px; border-radius: 100px; }
.bp.blue { background: var(--brand-soft); color: var(--brand); }
.bp.green { background: rgba(16,185,129,0.12); color: #059669; }
.bp.gray { background: rgba(13,27,62,0.06); color: var(--ink-2); }

/* Empty */
.empty-card {
  background: var(--sur);
  border: 1px dashed rgba(59,91,219,0.25);
  border-radius: 16px;
  padding: 56px 20px;
  text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: 12px;
}
.empty-ico { color: rgba(59,91,219,0.4); }
.empty-title { font-family: var(--f-display); font-weight: 700; font-size: 18px; color: var(--ink); margin: 0; }
.empty-desc { font-size: 13px; color: var(--ink-2); margin: 0 0 8px; }
.empty-card .btn-primary { background: var(--brand); color: #fff; }
</style>
