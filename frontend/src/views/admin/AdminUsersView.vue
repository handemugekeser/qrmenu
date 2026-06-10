<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { adminApi, type AdminUserListItem, type Plan, type UserRole } from '@/api'
import { Search, Loader2, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-vue-next'

const router = useRouter()

const items = ref<AdminUserListItem[]>([])
const total = ref(0)
const page = ref(1)
const totalPages = ref(1)
const loading = ref(false)

const search = ref('')
const planFilter = ref<Plan | ''>('')
const roleFilter = ref<UserRole | ''>('')

let searchTimer: any

async function load() {
  loading.value = true
  try {
    const { data } = await adminApi.users({
      search: search.value || undefined,
      plan: planFilter.value || undefined,
      role: roleFilter.value || undefined,
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
watch([planFilter, roleFilter], () => { page.value = 1; load() })

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>

<template>
  <div class="wrap">
    <!-- Filters -->
    <div class="filters">
      <div class="search-box">
        <Search :size="15" class="search-ico" />
        <input v-model="search" placeholder="Email veya isim ara…" class="search-input" />
      </div>
      <select v-model="planFilter" class="select">
        <option value="">Tüm Planlar</option>
        <option value="FREE">FREE</option>
        <option value="PRO">PRO</option>
        <option value="PREMIUM">PREMIUM</option>
      </select>
      <select v-model="roleFilter" class="select">
        <option value="">Tüm Roller</option>
        <option value="USER">USER</option>
        <option value="ADMIN">ADMIN</option>
        <option value="SUPER_ADMIN">SUPER_ADMIN</option>
      </select>
      <div class="total-pill">{{ total }} kullanıcı</div>
    </div>

    <!-- Table -->
    <div class="card">
      <div v-if="loading" class="loader"><Loader2 :size="22" class="spin" /></div>
      <div v-else-if="items.length === 0" class="empty">Sonuç bulunamadı.</div>
      <table v-else class="t">
        <thead>
          <tr>
            <th>Kullanıcı</th>
            <th>Plan</th>
            <th>Rol</th>
            <th>İşletme</th>
            <th>Durum</th>
            <th>Kayıt</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="u in items"
            :key="u.id"
            class="row"
            @click="router.push(`/admin/users/${u.id}`)"
          >
            <td>
              <div class="user-cell">
                <div class="avatar">{{ u.name[0]?.toUpperCase() }}</div>
                <div>
                  <p class="u-name">{{ u.name }}</p>
                  <p class="u-mail">{{ u.email }}</p>
                </div>
              </div>
            </td>
            <td><span :class="['pill', `pill-${u.plan.toLowerCase()}`]">{{ u.plan }}</span></td>
            <td><span :class="['pill', `pill-${u.role === 'SUPER_ADMIN' ? 'super' : u.role === 'ADMIN' ? 'admin' : 'user'}`]">{{ u.role }}</span></td>
            <td>{{ u._count.businesses }}</td>
            <td>
              <span :class="['status', u.isActive ? 'on' : 'off']">
                <span class="dot"></span>{{ u.isActive ? 'Aktif' : 'Pasif' }}
              </span>
            </td>
            <td class="muted">{{ fmtDate(u.createdAt) }}</td>
            <td><ExternalLink :size="14" class="ext-ico" /></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
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
.wrap { display: flex; flex-direction: column; gap: 16px; max-width: 1280px; margin: 0 auto; }

.filters { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
.search-box { position: relative; flex: 1; min-width: 220px; max-width: 360px; }
.search-ico { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: rgba(13,27,62,0.4); }
.search-input {
  width: 100%; padding: 10px 14px 10px 34px;
  background: #fff;
  border: 1px solid rgba(13,27,62,0.10);
  border-radius: 100px;
  font-size: 13.5px; font-family: inherit; color: #0d1b3e;
  outline: none; transition: border-color .15s, box-shadow .15s;
}
.search-input:focus { border-color: #3b5bdb; box-shadow: 0 0 0 4px rgba(59,91,219,0.10); }
.select {
  background: #fff;
  border: 1px solid rgba(13,27,62,0.10);
  border-radius: 100px;
  padding: 10px 30px 10px 14px;
  font-size: 13px; font-family: inherit; color: #0d1b3e;
  cursor: pointer; outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%230d1b3e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
}
.total-pill {
  margin-left: auto;
  font-size: 12px; font-weight: 600; color: rgba(13,27,62,0.55);
  padding: 6px 12px; border-radius: 100px;
  background: rgba(13,27,62,0.05);
}

.card {
  background: #fff;
  border: 1px solid rgba(13,27,62,0.08);
  border-radius: 16px;
  overflow: hidden;
}
.loader { padding: 50px 0; display: flex; justify-content: center; color: #3b5bdb; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.empty { padding: 50px; text-align: center; color: rgba(13,27,62,0.5); font-size: 14px; }

.t { width: 100%; border-collapse: collapse; font-size: 13.5px; }
.t thead th {
  text-align: left;
  font-size: 10.5px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
  color: rgba(13,27,62,0.5);
  padding: 14px 18px;
  border-bottom: 1px solid rgba(13,27,62,0.06);
  background: rgba(13,27,62,0.02);
}
.t tbody td { padding: 14px 18px; border-bottom: 1px solid rgba(13,27,62,0.05); vertical-align: middle; }
.t tbody tr:last-child td { border-bottom: none; }
.row { cursor: pointer; transition: background .12s; }
.row:hover { background: rgba(59,91,219,0.03); }

.user-cell { display: flex; align-items: center; gap: 11px; }
.avatar { width: 34px; height: 34px; border-radius: 10px; background: rgba(59,91,219,0.10); color: #3b5bdb; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; }
.u-name { font-weight: 600; color: #0d1b3e; margin: 0; }
.u-mail { font-size: 11.5px; color: rgba(13,27,62,0.5); margin: 2px 0 0; }
.muted { color: rgba(13,27,62,0.55); font-size: 12.5px; }
.ext-ico { color: rgba(13,27,62,0.35); }

.pill { display: inline-block; font-size: 10.5px; font-weight: 700; letter-spacing: 0.08em; padding: 3px 9px; border-radius: 100px; }
.pill-free { background: rgba(13,27,62,0.06); color: rgba(13,27,62,0.55); }
.pill-pro { background: rgba(59,91,219,0.12); color: #3b5bdb; }
.pill-premium { background: rgba(168,85,247,0.12); color: #a855f7; }
.pill-user { background: rgba(13,27,62,0.06); color: rgba(13,27,62,0.55); }
.pill-admin { background: rgba(16,185,129,0.12); color: #059669; }
.pill-super { background: linear-gradient(135deg, rgba(245,158,11,0.18), rgba(239,68,68,0.18)); color: #b45309; }

.status { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; }
.status .dot { width: 7px; height: 7px; border-radius: 100px; }
.status.on { color: #059669; }
.status.on .dot { background: #10b981; box-shadow: 0 0 0 3px rgba(16,185,129,0.18); }
.status.off { color: rgba(13,27,62,0.5); }
.status.off .dot { background: rgba(13,27,62,0.35); }

.pagination { display: flex; align-items: center; justify-content: center; gap: 14px; padding: 4px; }
.page-btn {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 13px; font-weight: 500;
  background: #fff; color: #0d1b3e;
  border: 1px solid rgba(13,27,62,0.10);
  border-radius: 100px;
  padding: 8px 16px; cursor: pointer;
  transition: border-color .15s, background .15s;
}
.page-btn:hover:not(:disabled) { border-color: #3b5bdb; background: rgba(59,91,219,0.05); }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.page-info { font-size: 12px; color: rgba(13,27,62,0.55); font-weight: 500; }
</style>
