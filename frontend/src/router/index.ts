import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // ─── Landing page ─────────────────────────────────────────
    {
      path: '/',
      name: 'landing',
      component: () => import('@/views/landing/LandingView.vue'),
      meta: { public: true },
    },

    // ─── Public menu (no auth needed) ────────────────────────
    {
      path: '/menu/:slug',
      name: 'public-menu',
      component: () => import('@/views/public/PublicMenuView.vue'),
      meta: { public: true },
    },

    // ─── Auth ────────────────────────────────────────────────
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { guest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: { guest: true },
    },

    // ─── Dashboard (requires auth) ───────────────────────────
    {
      path: '/app',
      component: () => import('@/components/layout/DashboardLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/dashboard/DashboardView.vue'),
        },
        {
          path: 'businesses',
          name: 'businesses',
          component: () => import('@/views/dashboard/BusinessesView.vue'),
        },
        {
          path: 'businesses/:businessId',
          name: 'business-detail',
          component: () => import('@/views/dashboard/BusinessDetailView.vue'),
        },
        {
          path: 'businesses/:businessId/menus/:menuId',
          name: 'menu-builder',
          component: () => import('@/views/menu/MenuBuilderView.vue'),
        },
        {
          path: 'businesses/:businessId/menus/:menuId/qrcodes',
          name: 'qrcodes',
          component: () => import('@/views/menu/QrCodesView.vue'),
        },
        {
          path: 'businesses/:businessId/menus/:menuId/analytics',
          name: 'analytics',
          component: () => import('@/views/menu/AnalyticsView.vue'),
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/views/settings/SettingsView.vue'),
        },
        {
          path: 'subscription',
          name: 'subscription',
          component: () => import('@/views/settings/SubscriptionView.vue'),
        },
        {
          path: 'insights',
          name: 'insights',
          component: () => import('@/views/dashboard/InsightsView.vue'),
          meta: { requiresAuth: true, requiresPlan: ['PRO', 'PREMIUM'] },
        },
      ],
    },

    // ─── Admin (SUPER_ADMIN/ADMIN only) ──────────────────────
    {
      path: '/admin',
      component: () => import('@/components/layout/AdminLayout.vue'),
      meta: { requiresAuth: true, requiresRole: ['ADMIN', 'SUPER_ADMIN'] },
      children: [
        {
          path: '',
          name: 'admin-dashboard',
          component: () => import('@/views/admin/AdminDashboardView.vue'),
        },
        {
          path: 'users',
          name: 'admin-users',
          component: () => import('@/views/admin/AdminUsersView.vue'),
        },
        {
          path: 'users/:id',
          name: 'admin-user-detail',
          component: () => import('@/views/admin/AdminUserDetailView.vue'),
        },
        {
          path: 'businesses',
          name: 'admin-businesses',
          component: () => import('@/views/admin/AdminBusinessesView.vue'),
        },
        {
          path: 'menus',
          name: 'admin-menus',
          component: () => import('@/views/admin/AdminMenusView.vue'),
        },
      ],
    },

    // ─── 404 ─────────────────────────────────────────────────
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if (to.meta.public) {
    // Redirect authenticated users away from landing to dashboard
    if (to.name === 'landing' && auth.token) {
      await auth.fetchMe()
      if (auth.isAuthenticated) return { name: 'dashboard' }
    }
    return true
  }

  // Init user if token exists but user not loaded
  if (auth.token && !auth.user) {
    await auth.fetchMe()
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.guest && auth.isAuthenticated) {
    return { name: 'dashboard' }
  }

  const requiredRoles = to.meta.requiresRole as string[] | undefined
  if (requiredRoles?.length) {
    const role = auth.user?.role
    if (!role || !requiredRoles.includes(role)) {
      return { name: 'dashboard' }
    }
  }

  return true
})

export default router
