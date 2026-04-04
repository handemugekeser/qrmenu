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

  return true
})

export default router
