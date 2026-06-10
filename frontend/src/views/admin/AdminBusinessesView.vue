<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { adminApi, type AdminBusinessItem } from '@/api'
import { Search, Loader2, ChevronLeft, ChevronRight, ExternalLink, Building2 } from 'lucide-vue-next'

const router = useRouter()

const items = ref<AdminBusinessItem[]>([])
const total = ref(0)
const page = ref(1)
const totalPages = ref(1)
const loading = ref(false)
const search = ref('')

let searchTimer: any

async function load() {
  loading.value = true
  try {
    const { data } = await adminApi.businesses({
      search: search.value || undefined,
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

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>

<template>
  <div class="wrap">
    <div class="filters">
      <div class="search-box">
        <Search :size="15" class="search-ico" />
        <input v-model="search" placeholder="İşletme adı veya slug ara…" class="search-input" />
      </div>
      <div class="total-pill">{{ total }} işletme</div>
    </div>

    <div class="card">
      <div v-if="loading" class="loader"><Loader2 :size="22" class="spin" /></div>
      <div v-else-if="items.length === 0" class="empty">Sonuç bulunamadı.</div>
      <table v-else class="t">
        <thead>
          <tr>
            <th>İşletme</th>
            <th>Sahibi</th>
            <th>Plan</th>
            <th>Menü</th>
            <th>Durum</th>
            <th>Oluşturulma</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="b in items" :key="b.id" class="row">
            <td>
              <div class="biz-cell">
                <div class="biz-ico"><Building2 :size="15" /></div>
                <div>
                  <p class="b-name">{{ b.name }}</p>
                  <p class="b-slug">/menu/{{ b.slug }}</p>
                </div>
              </div>
            </td>
            <td>
              <div class="owner-cell" @click="router.push(`/admin/users/${b.user.id}`)">
                <p class="o-name">{{ b.user.name }}</p>
                <p class="o-mail">{{ b.user.email }}</p>
              </div>
            </td>
            <td><span :class="['pill', `pill-${b.user.plan.toLowerCase()}`]">{{ b.user.plan }}</span></td>
            <td class="num">{{ b._count.menus }}</td>
            <td>
              <span :class="['status', b.isActive ? 'on' : 'off']">
                <span class="dot"></span>{{ b.isActive ? 'Aktif' : 'Pasif' }}
              </span>
            </td>
            <td class="muted">{{ fmtDate(b.createdAt) }}</td>
            <td>
              <a class="ext" :href="`/menu/${b.slug}`" target="_blank" title="Menüyü aç">
                <ExternalLink :size="14" />
              </a>
            </td>
          </tr>
        </tbody>
      </table>
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
@import '../admin/_shared.css';

.biz-cell { display: flex; align-items: center; gap: 11px; }
.biz-ico { width: 32px; height: 32px; border-radius: 10px; background: rgba(59,91,219,0.10); color: #3b5bdb; display: inline-flex; align-items: center; justify-content: center; }
.b-name { font-weight: 600; color: #0d1b3e; margin: 0; }
.b-slug { font-size: 11.5px; color: rgba(13,27,62,0.5); margin: 2px 0 0; }
.owner-cell { cursor: pointer; transition: color .15s; }
.owner-cell:hover .o-name { color: #3b5bdb; }
.o-name { font-size: 13px; font-weight: 500; color: #0d1b3e; margin: 0; transition: color .15s; }
.o-mail { font-size: 11.5px; color: rgba(13,27,62,0.5); margin: 2px 0 0; }
.num { font-weight: 600; color: #0d1b3e; }
.ext { color: rgba(13,27,62,0.4); padding: 6px; display: inline-flex; transition: color .15s; }
.ext:hover { color: #3b5bdb; }
</style>
