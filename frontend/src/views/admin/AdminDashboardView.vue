<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { adminApi, type AdminStats } from '@/api'
import { Users, Building2, UtensilsCrossed, BarChart3, TrendingUp, Loader2 } from 'lucide-vue-next'

const router = useRouter()
const stats = ref<AdminStats | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const { data } = await adminApi.stats()
    stats.value = data
  } finally {
    loading.value = false
  }
})

const totalPlanned = computed(() => {
  if (!stats.value) return 0
  const p = stats.value.planDistribution
  return Math.max(1, p.FREE + p.PRO + p.PREMIUM)
})

function pct(n: number) {
  return Math.round((n / totalPlanned.value) * 100)
}

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>

<template>
  <div class="space">
    <!-- Hero -->
    <section class="hero">
      <div>
        <span class="tag">PLATFORM</span>
        <h2 class="hero-title">menusflow Yönetim Merkezi</h2>
        <p class="hero-sub">Tüm hesapların, işletmelerin ve menülerin gerçek zamanlı görünümü.</p>
      </div>
      <div class="hero-cta">
        <button class="btn-gold" @click="router.push('/admin/users')">Kullanıcılara Git</button>
      </div>
    </section>

    <!-- Loading -->
    <div v-if="loading" class="loader">
      <Loader2 :size="28" class="spin" />
    </div>

    <template v-else-if="stats">
      <!-- Stats grid -->
      <section class="stats">
        <div class="stat-card">
          <div class="stat-head">
            <span class="tag">KULLANICILAR</span>
            <div class="stat-ico"><Users :size="16" /></div>
          </div>
          <div class="stat-num">{{ stats.totalUsers }}</div>
          <div class="stat-foot"><TrendingUp :size="12" /> +{{ stats.newUsers7d }} bu hafta</div>
        </div>
        <div class="stat-card">
          <div class="stat-head">
            <span class="tag">İŞLETMELER</span>
            <div class="stat-ico"><Building2 :size="16" /></div>
          </div>
          <div class="stat-num">{{ stats.totalBusinesses }}</div>
          <div class="stat-foot">{{ (stats.totalBusinesses / Math.max(1, stats.totalUsers)).toFixed(1) }} / kullanıcı</div>
        </div>
        <div class="stat-card">
          <div class="stat-head">
            <span class="tag">MENÜLER</span>
            <div class="stat-ico"><UtensilsCrossed :size="16" /></div>
          </div>
          <div class="stat-num">{{ stats.totalMenus }}</div>
          <div class="stat-foot">toplam yayında</div>
        </div>
        <div class="stat-card">
          <div class="stat-head">
            <span class="tag">BUGÜN</span>
            <div class="stat-ico"><BarChart3 :size="16" /></div>
          </div>
          <div class="stat-num">{{ stats.todayScans }}</div>
          <div class="stat-foot">tüm zamanlar: {{ stats.totalScans }}</div>
        </div>
      </section>

      <!-- Plan distribution + recent users -->
      <section class="row">
        <div class="card">
          <div class="card-head">
            <span class="tag">PLAN DAĞILIMI</span>
            <h3 class="card-title">Abonelik bileşimi</h3>
          </div>
          <div class="plan-bars">
            <div class="plan-row">
              <div class="plan-label"><span class="dot dot-free"></span> FREE</div>
              <div class="plan-track"><div class="plan-fill plan-free" :style="{ width: pct(stats.planDistribution.FREE) + '%' }"></div></div>
              <div class="plan-count">{{ stats.planDistribution.FREE }}</div>
            </div>
            <div class="plan-row">
              <div class="plan-label"><span class="dot dot-pro"></span> PRO</div>
              <div class="plan-track"><div class="plan-fill plan-pro" :style="{ width: pct(stats.planDistribution.PRO) + '%' }"></div></div>
              <div class="plan-count">{{ stats.planDistribution.PRO }}</div>
            </div>
            <div class="plan-row">
              <div class="plan-label"><span class="dot dot-prem"></span> PREMIUM</div>
              <div class="plan-track"><div class="plan-fill plan-prem" :style="{ width: pct(stats.planDistribution.PREMIUM) + '%' }"></div></div>
              <div class="plan-count">{{ stats.planDistribution.PREMIUM }}</div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-head">
            <span class="tag">SON KAYITLAR</span>
            <h3 class="card-title">Yeni kullanıcılar</h3>
          </div>
          <ul class="recent-list">
            <li
              v-for="u in stats.recentUsers"
              :key="u.id"
              class="recent-item"
              @click="router.push(`/admin/users/${u.id}`)"
            >
              <div class="ru-avatar">{{ u.name[0]?.toUpperCase() }}</div>
              <div class="ru-info">
                <p class="ru-name">{{ u.name }}</p>
                <p class="ru-email">{{ u.email }}</p>
              </div>
              <div class="ru-meta">
                <span :class="['plan-pill', `plan-pill-${u.plan.toLowerCase()}`]">{{ u.plan }}</span>
                <span class="ru-date">{{ fmtDate(u.createdAt) }}</span>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.space { display: flex; flex-direction: column; gap: 22px; max-width: 1280px; margin: 0 auto; }

.tag {
  display: inline-flex; align-items: center;
  font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
  color: #3b5bdb;
  border: 1px solid rgba(59,91,219,0.22);
  background: rgba(59,91,219,0.05);
  border-radius: 100px; padding: 4px 10px;
}

.hero {
  display: flex; align-items: center; justify-content: space-between; gap: 20px;
  padding: 28px 30px; border-radius: 18px;
  background: linear-gradient(135deg, #0d1b3e 0%, #1a2f6b 100%);
  color: #fff;
  box-shadow: 0 10px 30px rgba(13,27,62,0.18);
}
.hero .tag { color: #8aa0fc; border-color: rgba(255,255,255,0.18); background: rgba(255,255,255,0.05); }
.hero-title { font-family: 'Geist', system-ui, sans-serif; font-weight: 800; font-size: clamp(22px, 3vw, 30px); letter-spacing: -0.02em; margin: 10px 0 6px; }
.hero-sub { color: rgba(255,255,255,0.7); font-size: 14px; margin: 0; }
.btn-gold {
  background: #fff; color: #0d1b3e;
  border: none; border-radius: 100px;
  font-weight: 600; font-size: 13px;
  padding: 11px 22px; cursor: pointer;
  transition: opacity .2s, transform .2s;
}
.btn-gold:hover { opacity: 0.92; transform: translateY(-1px); }

.loader { display: flex; justify-content: center; padding: 60px 0; color: #3b5bdb; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; }
.stat-card {
  background: #fff;
  border: 1px solid rgba(13,27,62,0.08);
  border-radius: 16px;
  padding: 20px;
  transition: transform .2s, box-shadow .2s;
}
.stat-card:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(13,27,62,0.06); }
.stat-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
.stat-ico {
  width: 32px; height: 32px; border-radius: 10px;
  background: rgba(59,91,219,0.10); color: #3b5bdb;
  display: inline-flex; align-items: center; justify-content: center;
}
.stat-num { font-family: 'Geist', system-ui, sans-serif; font-weight: 800; font-size: 30px; letter-spacing: -0.02em; line-height: 1.05; color: #0d1b3e; }
.stat-foot { display: inline-flex; align-items: center; gap: 5px; margin-top: 8px; font-size: 11.5px; color: rgba(13,27,62,0.55); }

.row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
@media (max-width: 900px) { .row { grid-template-columns: 1fr; } }
.card {
  background: #fff;
  border: 1px solid rgba(13,27,62,0.08);
  border-radius: 16px;
  padding: 22px;
}
.card-head { margin-bottom: 18px; }
.card-title { font-family: 'Geist', system-ui, sans-serif; font-weight: 700; font-size: 17px; letter-spacing: -0.02em; margin: 8px 0 0; color: #0d1b3e; }

.plan-bars { display: flex; flex-direction: column; gap: 14px; }
.plan-row { display: grid; grid-template-columns: 90px 1fr 36px; align-items: center; gap: 12px; font-size: 13px; }
.plan-label { display: inline-flex; align-items: center; gap: 7px; font-weight: 600; color: #0d1b3e; }
.dot { width: 9px; height: 9px; border-radius: 100px; display: inline-block; }
.dot-free { background: #94a3b8; }
.dot-pro { background: #3b5bdb; }
.dot-prem { background: #a855f7; }
.plan-track { height: 8px; background: rgba(13,27,62,0.06); border-radius: 100px; overflow: hidden; }
.plan-fill { height: 100%; border-radius: 100px; transition: width .5s ease; }
.plan-free { background: #94a3b8; }
.plan-pro { background: #3b5bdb; }
.plan-prem { background: linear-gradient(90deg, #a855f7, #d946ef); }
.plan-count { font-weight: 700; text-align: right; color: #0d1b3e; }

.recent-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
.recent-item {
  display: flex; align-items: center; gap: 12px;
  padding: 10px;
  border-radius: 12px;
  cursor: pointer;
  transition: background .15s;
}
.recent-item:hover { background: rgba(59,91,219,0.05); }
.ru-avatar {
  width: 36px; height: 36px; border-radius: 10px;
  background: rgba(59,91,219,0.10); color: #3b5bdb;
  display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px;
}
.ru-info { flex: 1; min-width: 0; }
.ru-name { font-size: 13.5px; font-weight: 600; margin: 0; color: #0d1b3e; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ru-email { font-size: 11.5px; color: rgba(13,27,62,0.55); margin: 2px 0 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ru-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 3px; }
.plan-pill { font-size: 10px; font-weight: 700; letter-spacing: 0.08em; padding: 3px 8px; border-radius: 100px; }
.plan-pill-free { background: rgba(13,27,62,0.06); color: rgba(13,27,62,0.6); }
.plan-pill-pro { background: rgba(59,91,219,0.12); color: #3b5bdb; }
.plan-pill-premium { background: rgba(168,85,247,0.12); color: #a855f7; }
.ru-date { font-size: 11px; color: rgba(13,27,62,0.45); }
</style>
