<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { adminApi, type AdminUserDetail, type Plan, type UserRole } from '@/api'
import { useAuthStore } from '@/stores/auth'
import { ArrowLeft, Loader2, Building2, UtensilsCrossed, QrCode, BarChart3, Save, ExternalLink } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const user = ref<AdminUserDetail | null>(null)
const loading = ref(true)
const saving = ref(false)
const saveMsg = ref('')

const draft = ref<{ plan: Plan; role: UserRole; isActive: boolean } | null>(null)

const canEdit = computed(() => auth.isSuperAdmin)

const openIds = ref<Set<string>>(new Set())
function toggle(id: string) {
  if (openIds.value.has(id)) openIds.value.delete(id); else openIds.value.add(id)
  openIds.value = new Set(openIds.value)
}

onMounted(async () => {
  try {
    const { data } = await adminApi.userDetail(route.params.id as string)
    user.value = data
    draft.value = { plan: data.plan, role: data.role, isActive: data.isActive }
  } finally {
    loading.value = false
  }
})

async function save() {
  if (!user.value || !draft.value) return
  saving.value = true
  saveMsg.value = ''
  try {
    await adminApi.updateUser(user.value.id, draft.value)
    Object.assign(user.value, draft.value)
    saveMsg.value = 'Kaydedildi.'
    setTimeout(() => saveMsg.value = '', 2500)
  } catch (e: any) {
    saveMsg.value = e?.response?.data?.message || 'Hata oluştu.'
  } finally {
    saving.value = false
  }
}

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>

<template>
  <div class="wrap">
    <div class="back-row">
      <button class="back-btn" @click="router.push('/admin/users')">
        <ArrowLeft :size="15" /> Kullanıcılara dön
      </button>
    </div>

    <div v-if="loading" class="loader"><Loader2 :size="26" class="spin" /></div>
    <div v-else-if="!user" class="empty">Kullanıcı bulunamadı.</div>

    <template v-else>
      <!-- Header -->
      <section class="hero">
        <div class="avatar">{{ user.name[0]?.toUpperCase() }}</div>
        <div class="hero-info">
          <span class="tag">KULLANICI</span>
          <h2 class="hero-title">{{ user.name }}</h2>
          <p class="hero-mail">{{ user.email }}</p>
          <div class="hero-meta">
            <span :class="['pill', `pill-${user.plan.toLowerCase()}`]">{{ user.plan }}</span>
            <span :class="['pill', `pill-${user.role === 'SUPER_ADMIN' ? 'super' : user.role === 'ADMIN' ? 'admin' : 'user'}`]">{{ user.role }}</span>
            <span class="hero-date">Kayıt: {{ fmtDate(user.createdAt) }}</span>
          </div>
        </div>
      </section>

      <!-- Edit panel (super admin only) -->
      <section v-if="canEdit && draft" class="card edit-card">
        <div class="card-head">
          <span class="tag">YÖNETİM</span>
          <h3 class="card-title">Hesap ayarları</h3>
        </div>
        <div class="edit-grid">
          <label class="field">
            <span class="field-label">Plan</span>
            <select v-model="draft.plan" class="select">
              <option value="FREE">FREE</option>
              <option value="PRO">PRO</option>
              <option value="PREMIUM">PREMIUM</option>
            </select>
          </label>
          <label class="field">
            <span class="field-label">Rol</span>
            <select v-model="draft.role" class="select">
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
            </select>
          </label>
          <label class="field">
            <span class="field-label">Durum</span>
            <div class="toggle-row">
              <button
                type="button"
                :class="['toggle', draft.isActive ? 'on' : 'off']"
                @click="draft.isActive = !draft.isActive"
              >
                <span class="toggle-knob"></span>
              </button>
              <span class="toggle-label">{{ draft.isActive ? 'Aktif' : 'Pasif' }}</span>
            </div>
          </label>
          <div class="save-area">
            <span v-if="saveMsg" class="save-msg">{{ saveMsg }}</span>
            <button class="btn-primary" :disabled="saving" @click="save">
              <Loader2 v-if="saving" :size="14" class="spin" />
              <Save v-else :size="14" /> Kaydet
            </button>
          </div>
        </div>
      </section>

      <!-- Businesses + menus -->
      <section class="card">
        <div class="card-head">
          <span class="tag">İŞLETMELER</span>
          <h3 class="card-title">{{ user.businesses.length }} işletme</h3>
        </div>
        <div v-if="user.businesses.length === 0" class="empty">Henüz işletme yok.</div>
        <ul class="biz-list">
          <li v-for="b in user.businesses" :key="b.id" class="biz">
            <div class="biz-head" @click="toggle(b.id)">
              <div class="biz-ico"><Building2 :size="16" /></div>
              <div class="biz-info">
                <p class="biz-name">{{ b.name }}</p>
                <p class="biz-slug">qrmenu.app/menu/{{ b.slug }}</p>
              </div>
              <div class="biz-stats">
                <span class="count">{{ b._count.menus }} menü</span>
                <span :class="['status', b.isActive ? 'on' : 'off']">
                  <span class="dot"></span>{{ b.isActive ? 'Aktif' : 'Pasif' }}
                </span>
              </div>
              <a class="ext" :href="`/menu/${b.slug}`" target="_blank" @click.stop>
                <ExternalLink :size="14" />
              </a>
            </div>
            <div v-if="openIds.has(b.id) && b.menus.length" class="menu-list">
              <div v-for="m in b.menus" :key="m.id" class="menu-row">
                <div class="menu-ico" :style="{ background: m.themeColor + '22', color: m.themeColor }"><UtensilsCrossed :size="13" /></div>
                <p class="menu-name">{{ m.name }}</p>
                <span class="menu-stat"><QrCode :size="12" /> {{ m._count.qrCodes }}</span>
                <span class="menu-stat"><BarChart3 :size="12" /> {{ m._count.analytics }}</span>
                <span :class="['status sm', m.isActive ? 'on' : 'off']">
                  <span class="dot"></span>{{ m.isActive ? 'Aktif' : 'Pasif' }}
                </span>
              </div>
            </div>
          </li>
        </ul>
      </section>
    </template>
  </div>
</template>

<style scoped>
.wrap { display: flex; flex-direction: column; gap: 18px; max-width: 1280px; margin: 0 auto; }

.tag {
  display: inline-flex; align-items: center;
  font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
  color: #3b5bdb;
  border: 1px solid rgba(59,91,219,0.22);
  background: rgba(59,91,219,0.05);
  border-radius: 100px; padding: 4px 10px;
}

.back-row { }
.back-btn {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 12.5px; color: rgba(13,27,62,0.6);
  background: none; border: none; cursor: pointer; padding: 0;
  font-family: inherit;
}
.back-btn:hover { color: #3b5bdb; }

.loader { padding: 60px 0; display: flex; justify-content: center; color: #3b5bdb; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.empty { padding: 36px; text-align: center; color: rgba(13,27,62,0.5); font-size: 13px; }

.hero {
  display: flex; gap: 22px; align-items: center;
  padding: 26px;
  background: #fff;
  border: 1px solid rgba(13,27,62,0.08);
  border-radius: 18px;
}
.avatar {
  width: 70px; height: 70px; border-radius: 18px;
  background: linear-gradient(135deg, #3b5bdb, #768dfb);
  color: #fff; font-weight: 800; font-size: 26px;
  display: inline-flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.hero-info { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.hero-title { font-family: 'Geist', system-ui, sans-serif; font-weight: 800; font-size: 24px; letter-spacing: -0.02em; margin: 6px 0 0; color: #0d1b3e; }
.hero-mail { font-size: 13px; color: rgba(13,27,62,0.55); margin: 0; }
.hero-meta { display: flex; align-items: center; gap: 10px; margin-top: 10px; flex-wrap: wrap; }
.hero-date { font-size: 11.5px; color: rgba(13,27,62,0.5); }

.card {
  background: #fff;
  border: 1px solid rgba(13,27,62,0.08);
  border-radius: 16px;
  padding: 22px;
}
.card-head { margin-bottom: 18px; display: flex; align-items: center; gap: 12px; }
.card-title { font-family: 'Geist', system-ui, sans-serif; font-weight: 700; font-size: 16px; letter-spacing: -0.02em; margin: 0; color: #0d1b3e; }

.edit-card .edit-grid {
  display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 16px; align-items: end;
}
@media (max-width: 800px) { .edit-card .edit-grid { grid-template-columns: 1fr 1fr; } }
.field { display: flex; flex-direction: column; gap: 6px; }
.field-label { font-size: 11px; font-weight: 600; letter-spacing: 0.10em; text-transform: uppercase; color: rgba(13,27,62,0.5); }
.select {
  background: #fff;
  border: 1px solid rgba(13,27,62,0.10);
  border-radius: 10px;
  padding: 10px 30px 10px 12px;
  font-size: 13px; font-family: inherit; color: #0d1b3e;
  cursor: pointer; outline: none; appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%230d1b3e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
}
.toggle-row { display: flex; align-items: center; gap: 10px; padding: 6px 0; }
.toggle {
  width: 40px; height: 22px; border-radius: 100px;
  background: rgba(13,27,62,0.15);
  border: none; cursor: pointer;
  display: inline-flex; align-items: center; padding: 2px;
  transition: background .15s;
}
.toggle.on { background: #3b5bdb; }
.toggle-knob {
  width: 18px; height: 18px; border-radius: 100px;
  background: #fff;
  transition: transform .15s;
}
.toggle.on .toggle-knob { transform: translateX(18px); }
.toggle-label { font-size: 13px; color: #0d1b3e; font-weight: 500; }
.save-area { display: flex; align-items: center; gap: 12px; }
.save-msg { font-size: 12px; color: #059669; font-weight: 500; }
.btn-primary {
  display: inline-flex; align-items: center; gap: 6px;
  background: #3b5bdb; color: #fff;
  border: none; border-radius: 100px;
  padding: 10px 18px; font-size: 13px; font-weight: 600;
  cursor: pointer; font-family: inherit;
  transition: opacity .15s, transform .15s;
}
.btn-primary:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

.biz-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
.biz {
  border: 1px solid rgba(13,27,62,0.07);
  border-radius: 12px;
  overflow: hidden;
}
.biz-head {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 14px;
  cursor: pointer;
  transition: background .12s;
}
.biz-head:hover { background: rgba(59,91,219,0.04); }
.biz-ico {
  width: 34px; height: 34px; border-radius: 10px;
  background: rgba(59,91,219,0.10); color: #3b5bdb;
  display: inline-flex; align-items: center; justify-content: center;
}
.biz-info { flex: 1; min-width: 0; }
.biz-name { font-size: 13.5px; font-weight: 600; color: #0d1b3e; margin: 0; }
.biz-slug { font-size: 11px; color: rgba(13,27,62,0.5); margin: 2px 0 0; }
.biz-stats { display: flex; align-items: center; gap: 12px; }
.count { font-size: 12px; font-weight: 600; color: rgba(13,27,62,0.6); }
.ext {
  color: rgba(13,27,62,0.4); padding: 6px;
  display: inline-flex; align-items: center;
  transition: color .15s;
}
.ext:hover { color: #3b5bdb; }

.menu-list { padding: 4px 14px 12px; display: flex; flex-direction: column; gap: 4px; border-top: 1px solid rgba(13,27,62,0.05); background: rgba(13,27,62,0.02); }
.menu-row { display: flex; align-items: center; gap: 10px; padding: 8px 10px; }
.menu-ico { width: 26px; height: 26px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; }
.menu-name { font-size: 12.5px; font-weight: 500; color: #0d1b3e; margin: 0; flex: 1; }
.menu-stat { font-size: 11.5px; color: rgba(13,27,62,0.55); display: inline-flex; align-items: center; gap: 4px; }

.pill { display: inline-block; font-size: 10.5px; font-weight: 700; letter-spacing: 0.08em; padding: 3px 9px; border-radius: 100px; }
.pill-free { background: rgba(13,27,62,0.06); color: rgba(13,27,62,0.55); }
.pill-pro { background: rgba(59,91,219,0.12); color: #3b5bdb; }
.pill-premium { background: rgba(168,85,247,0.12); color: #a855f7; }
.pill-user { background: rgba(13,27,62,0.06); color: rgba(13,27,62,0.55); }
.pill-admin { background: rgba(16,185,129,0.12); color: #059669; }
.pill-super { background: linear-gradient(135deg, rgba(245,158,11,0.18), rgba(239,68,68,0.18)); color: #b45309; }

.status { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; }
.status.sm { font-size: 11px; }
.status .dot { width: 7px; height: 7px; border-radius: 100px; }
.status.on { color: #059669; }
.status.on .dot { background: #10b981; box-shadow: 0 0 0 3px rgba(16,185,129,0.18); }
.status.off { color: rgba(13,27,62,0.5); }
.status.off .dot { background: rgba(13,27,62,0.35); }
</style>
