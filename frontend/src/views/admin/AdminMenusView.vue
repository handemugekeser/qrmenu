<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { adminApi, type AdminMenuItem } from '@/api'
import { Search, Loader2, ChevronLeft, ChevronRight, ExternalLink, QrCode, BarChart3, FolderTree } from 'lucide-vue-next'

const items = ref<AdminMenuItem[]>([])
const total = ref(0)
const page = ref(1)
const totalPages = ref(1)
const loading = ref(false)
const search = ref('')
const activeFilter = ref<'all' | 'active' | 'inactive'>('all')

let searchTimer: any

async function load() {
  loading.value = true
  try {
    const { data } = await adminApi.menus({
      search: search.value || undefined,
      active: activeFilter.value === 'all' ? undefined : activeFilter.value === 'active',
      page: page.value,
      limit: 20,
    })
    items.value = data.items
    total.value = data.total
    totalPages.value = data.totalPages
  } finally {
    loading.value = false
  }
}

onMounted(load)

watch(search, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => { page.value = 1; load() }, 350)
})
watch(activeFilter, () => { page.value = 1; load() })

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>

<template>
  <div class="wrap">
    <div class="filters">
      <div class="search-box">
        <Search :size="15" class="search-ico" />
        <input v-model="search" placeholder="Menü adı ara…" class="search-input" />
      </div>
      <select v-model="activeFilter" class="select">
        <option value="all">Hepsi</option>
        <option value="active">Yalnızca aktif</option>
        <option value="inactive">Yalnızca pasif</option>
      </select>
      <div class="total-pill">{{ total }} menü</div>
    </div>

    <div class="card">
      <div v-if="loading" class="loader"><Loader2 :size="22" class="spin" /></div>
      <div v-else-if="items.length === 0" class="empty">Sonuç bulunamadı.</div>
      <div v-else class="grid">
        <article v-for="m in items" :key="m.id" class="menu-card">
          <div class="m-head">
            <div class="m-theme" :style="{ background: m.themeColor + '22', color: m.themeColor }">
              <FolderTree :size="16" />
            </div>
            <a class="m-ext" :href="`/menu/${m.business.slug}`" target="_blank">
              <ExternalLink :size="14" />
            </a>
          </div>
          <h3 class="m-name">{{ m.name }}</h3>
          <p class="m-biz">{{ m.business.name }}</p>
          <p class="m-owner">{{ m.business.user.email }}</p>
          <div class="m-stats">
            <span class="m-stat"><FolderTree :size="12" /> {{ m._count.categories }}</span>
            <span class="m-stat"><QrCode :size="12" /> {{ m._count.qrCodes }}</span>
            <span class="m-stat"><BarChart3 :size="12" /> {{ m._count.analytics }}</span>
          </div>
          <div class="m-foot">
            <span :class="['status', m.isActive ? 'on' : 'off']">
              <span class="dot"></span>{{ m.isActive ? 'Aktif' : 'Pasif' }}
            </span>
            <span class="m-date">{{ fmtDate(m.createdAt) }}</span>
          </div>
        </article>
      </div>
    </div>

    <div v-if="totalPages > 1" class="pagination">
      <button class="page-btn" :disabled="page <= 1" @click="page > 1 && (page--, load())">
        <ChevronLeft :size="14" /> Önceki
      </button>
      <span class="page-info">Sayfa {{ page }} / {{ totalPages }}</span>
      <button class="page-btn" :disabled="page >= totalPages" @click="page < totalPages && (page++, load())">
        Sonraki <ChevronRight :size="14" />
      </button>
    </div>
  </div>
</template>

<style scoped>
@import './_shared.css';

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 14px;
  padding: 18px;
}
.menu-card {
  background: #fff;
  border: 1px solid rgba(13,27,62,0.08);
  border-radius: 14px;
  padding: 16px;
  display: flex; flex-direction: column; gap: 6px;
  transition: transform .2s, box-shadow .2s;
}
.menu-card:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(13,27,62,0.06); }
.m-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.m-theme { width: 34px; height: 34px; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; }
.m-ext { color: rgba(13,27,62,0.4); display: inline-flex; transition: color .15s; }
.m-ext:hover { color: #3b5bdb; }
.m-name { font-family: 'Geist', system-ui, sans-serif; font-weight: 700; font-size: 15px; letter-spacing: -0.01em; margin: 0; color: #0d1b3e; }
.m-biz { font-size: 12px; color: rgba(13,27,62,0.65); margin: 0; }
.m-owner { font-size: 11px; color: rgba(13,27,62,0.45); margin: 0; }
.m-stats { display: flex; gap: 10px; margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(13,27,62,0.06); }
.m-stat { display: inline-flex; align-items: center; gap: 4px; font-size: 11.5px; color: rgba(13,27,62,0.6); font-weight: 500; }
.m-foot { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; }
.m-date { font-size: 10.5px; color: rgba(13,27,62,0.4); }
</style>
