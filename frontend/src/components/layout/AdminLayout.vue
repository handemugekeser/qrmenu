<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  LayoutDashboard, Users, Building2, UtensilsCrossed,
  LogOut, ArrowLeftCircle, ShieldCheck, Menu as MenuIcon
} from 'lucide-vue-next'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const sidebarOpen = ref(false)

const navItems = [
  { to: '/admin', name: 'admin-dashboard', icon: LayoutDashboard, label: 'Genel Bakış' },
  { to: '/admin/users', name: 'admin-users', icon: Users, label: 'Kullanıcılar' },
  { to: '/admin/businesses', name: 'admin-businesses', icon: Building2, label: 'İşletmeler' },
  { to: '/admin/menus', name: 'admin-menus', icon: UtensilsCrossed, label: 'Menüler' },
]

const pageTitle = computed(() => {
  const map: Record<string, string> = {
    'admin-dashboard': 'Admin Genel Bakış',
    'admin-users': 'Tüm Kullanıcılar',
    'admin-user-detail': 'Kullanıcı Detayı',
    'admin-businesses': 'Tüm İşletmeler',
    'admin-menus': 'Tüm Menüler',
  }
  return map[route.name as string] || 'Admin'
})

function isActive(name: string) {
  if (name === 'admin-users') return route.name === 'admin-users' || route.name === 'admin-user-detail'
  return route.name === name
}

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="admin">
    <!-- Sidebar -->
    <aside :class="['admin-side', { open: sidebarOpen }]">
      <div class="admin-brand">
        <span class="brand-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="2" width="13" height="18" rx="2" fill="#3b5bdb" opacity="0.9"/>
            <rect x="7" y="6" width="9" height="20" rx="2" fill="#3b5bdb" transform="rotate(-8 7 6)"/>
            <rect x="5" y="4" width="11" height="17" rx="2" fill="#3b5bdb" opacity="0.6" transform="rotate(5 5 4)"/>
          </svg>
        </span>
        <span class="brand-text">
          <span class="brand-gold">menus</span><span class="brand-white">flow</span>
        </span>
        <span class="admin-pill"><ShieldCheck :size="11" /> ADMIN</span>
      </div>

      <nav class="admin-nav">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :class="['nav-item', { active: isActive(item.name) }]"
        >
          <component :is="item.icon" :size="17" />
          <span>{{ item.label }}</span>
        </router-link>
      </nav>

      <div class="admin-side-footer">
        <router-link to="/app" class="back-link">
          <ArrowLeftCircle :size="15" /> Kullanıcı Paneli
        </router-link>
        <div class="user-card">
          <div class="user-avatar">{{ auth.user?.name?.[0]?.toUpperCase() }}</div>
          <div class="user-meta">
            <p class="user-name">{{ auth.user?.name }}</p>
            <p class="user-email">{{ auth.user?.email }}</p>
          </div>
          <button class="logout-btn" @click="logout" title="Çıkış">
            <LogOut :size="15" />
          </button>
        </div>
      </div>
    </aside>

    <div v-if="sidebarOpen" class="admin-overlay" @click="sidebarOpen = false" />

    <!-- Main -->
    <div class="admin-main">
      <header class="admin-top">
        <button class="menu-btn" @click="sidebarOpen = !sidebarOpen">
          <MenuIcon :size="20" />
        </button>
        <h1 class="top-title">{{ pageTitle }}</h1>
        <div class="top-pill">
          <span class="dot"></span> Admin Mode
        </div>
      </header>
      <main class="admin-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.admin {
  --bg: #f8f9ff;
  --sur: #ffffff;
  --ink: #0d1b3e;
  --ink-2: rgba(13,27,62,0.62);
  --ink-3: rgba(13,27,62,0.38);
  --brand: #3b5bdb;
  --brand-soft: rgba(59,91,219,0.10);
  --brand-line: rgba(59,91,219,0.18);
  --line: rgba(13,27,62,0.08);
  --side-bg: #0d1b3e;
  --side-line: rgba(255,255,255,0.08);
  --radius: 14px;
  --f-display: 'Geist', system-ui, sans-serif;
  --f-body: 'Inter', system-ui, sans-serif;
  display: flex;
  min-height: 100vh;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--f-body);
  font-feature-settings: 'cv11', 'ss01';
}

/* Sidebar */
.admin-side {
  width: 260px;
  background: var(--side-bg);
  color: #fff;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 40;
}
.admin-brand {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 20px 22px;
  border-bottom: 1px solid var(--side-line);
}
.brand-icon { width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; }
.brand-text { font-family: var(--f-display); font-weight: 700; font-size: 17px; letter-spacing: -0.03em; }
.brand-gold { color: #8aa0fc; }
.brand-white { color: #fff; }
.admin-pill {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.14em;
  background: rgba(255,255,255,0.10);
  padding: 4px 8px;
  border-radius: 100px;
  color: #fff;
}

.admin-nav {
  flex: 1;
  padding: 18px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 13.5px;
  font-weight: 500;
  color: rgba(255,255,255,0.72);
  text-decoration: none;
  transition: color .15s, background .15s;
}
.nav-item:hover { color: #fff; background: rgba(255,255,255,0.05); }
.nav-item.active {
  background: var(--brand);
  color: #fff;
  box-shadow: 0 6px 18px rgba(59,91,219,0.35);
}

.admin-side-footer {
  padding: 12px;
  border-top: 1px solid var(--side-line);
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  color: rgba(255,255,255,0.55);
  text-decoration: none;
  padding: 6px 10px;
  border-radius: 8px;
  transition: color .15s, background .15s;
}
.back-link:hover { color: #fff; background: rgba(255,255,255,0.05); }
.user-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: rgba(255,255,255,0.04);
  border-radius: 12px;
}
.user-avatar {
  width: 34px; height: 34px;
  border-radius: 10px;
  background: var(--brand);
  display: inline-flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 14px;
}
.user-meta { flex: 1; min-width: 0; }
.user-name { font-size: 13px; font-weight: 600; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.user-email { font-size: 11px; color: rgba(255,255,255,0.5); margin: 2px 0 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.logout-btn {
  background: none; border: none; color: rgba(255,255,255,0.55); cursor: pointer; padding: 6px;
  border-radius: 8px; transition: color .15s, background .15s;
}
.logout-btn:hover { color: #fff; background: rgba(255,255,255,0.08); }

/* Main area */
.admin-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.admin-top {
  height: 64px;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 clamp(16px, 3vw, 32px);
  background: var(--sur);
  border-bottom: 1px solid var(--line);
}
.menu-btn { display: none; background: none; border: none; cursor: pointer; color: var(--ink); padding: 8px; border-radius: 8px; }
.top-title { flex: 1; font-family: var(--f-display); font-weight: 700; font-size: 18px; letter-spacing: -0.02em; margin: 0; }
.top-pill {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 11px; font-weight: 600; letter-spacing: 0.10em; text-transform: uppercase;
  color: var(--brand);
  background: var(--brand-soft);
  border: 1px solid var(--brand-line);
  border-radius: 100px;
  padding: 6px 12px;
}
.top-pill .dot { width: 7px; height: 7px; border-radius: 100px; background: var(--brand); box-shadow: 0 0 0 4px rgba(59,91,219,0.15); }
.admin-content { flex: 1; padding: clamp(18px, 3vw, 32px); overflow-y: auto; }
.admin-overlay { position: fixed; inset: 0; background: rgba(13,27,62,0.5); z-index: 35; }

@media (max-width: 900px) {
  .admin-side { position: fixed; transform: translateX(-100%); transition: transform .25s; }
  .admin-side.open { transform: translateX(0); }
  .menu-btn { display: inline-flex; }
}
</style>
