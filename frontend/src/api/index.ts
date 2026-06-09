import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('qrmenu_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('qrmenu_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  },
)

// ─── Auth ───────────────────────────────────────────────────
export const authApi = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
}

// ─── Businesses ─────────────────────────────────────────────
export const businessApi = {
  list: () => api.get('/businesses'),
  get: (id: string) => api.get(`/businesses/${id}`),
  create: (data: any) => api.post('/businesses', data),
  update: (id: string, data: any) => api.patch(`/businesses/${id}`, data),
  delete: (id: string) => api.delete(`/businesses/${id}`),
  checkSlug: (slug: string) => api.get(`/businesses/check-slug?slug=${slug}`),
}

// ─── Menus ──────────────────────────────────────────────────
export const menuApi = {
  list: (businessId: string) => api.get(`/businesses/${businessId}/menus`),
  get: (businessId: string, id: string) => api.get(`/businesses/${businessId}/menus/${id}`),
  create: (businessId: string, data: any) => api.post(`/businesses/${businessId}/menus`, data),
  update: (businessId: string, id: string, data: any) => api.patch(`/businesses/${businessId}/menus/${id}`, data),
  delete: (businessId: string, id: string) => api.delete(`/businesses/${businessId}/menus/${id}`),
}

// ─── Categories ─────────────────────────────────────────────
export const categoryApi = {
  list: (menuId: string) => api.get(`/menus/${menuId}/categories`),
  create: (menuId: string, data: any) => api.post(`/menus/${menuId}/categories`, data),
  update: (menuId: string, id: string, data: any) => api.patch(`/menus/${menuId}/categories/${id}`, data),
  delete: (menuId: string, id: string) => api.delete(`/menus/${menuId}/categories/${id}`),
  reorder: (menuId: string, ids: string[]) => api.post(`/menus/${menuId}/categories/reorder`, { ids }),
}

// ─── Products ───────────────────────────────────────────────
export const productApi = {
  list: (categoryId: string) => api.get(`/categories/${categoryId}/products`),
  get: (categoryId: string, id: string) => api.get(`/categories/${categoryId}/products/${id}`),
  create: (categoryId: string, data: any) => api.post(`/categories/${categoryId}/products`, data),
  update: (categoryId: string, id: string, data: any) => api.patch(`/categories/${categoryId}/products/${id}`, data),
  delete: (categoryId: string, id: string) => api.delete(`/categories/${categoryId}/products/${id}`),
  reorder: (categoryId: string, ids: string[]) => api.post(`/categories/${categoryId}/products/reorder`, { ids }),
  addVariant: (categoryId: string, productId: string, data: any) =>
    api.post(`/categories/${categoryId}/products/${productId}/variants`, data),
  updateVariant: (categoryId: string, productId: string, variantId: string, data: any) =>
    api.patch(`/categories/${categoryId}/products/${productId}/variants/${variantId}`, data),
  deleteVariant: (categoryId: string, productId: string, variantId: string) =>
    api.delete(`/categories/${categoryId}/products/${productId}/variants/${variantId}`),
  addExtra: (categoryId: string, productId: string, data: any) =>
    api.post(`/categories/${categoryId}/products/${productId}/extras`, data),
  updateExtra: (categoryId: string, productId: string, extraId: string, data: any) =>
    api.patch(`/categories/${categoryId}/products/${productId}/extras/${extraId}`, data),
  deleteExtra: (categoryId: string, productId: string, extraId: string) =>
    api.delete(`/categories/${categoryId}/products/${productId}/extras/${extraId}`),
}

// ─── Translations ────────────────────────────────────────────
export const translationApi = {
  upsert: (data: any) => api.post('/translations', data),
  list: (entityType: string, entityId: string) => api.get(`/translations/${entityType}/${entityId}`),
  delete: (id: string) => api.delete(`/translations/${id}`),
}

// ─── QR Codes ────────────────────────────────────────────────
export const qrApi = {
  list: (menuId: string) => api.get(`/menus/${menuId}/qrcodes`),
  generate: (menuId: string, data: any) => api.post(`/menus/${menuId}/qrcodes`, data),
  delete: (menuId: string, id: string) => api.delete(`/menus/${menuId}/qrcodes/${id}`),
}

// ─── Analytics ───────────────────────────────────────────────
export type AnalyticsEventType =
  | 'SCAN_OPEN'
  | 'CATEGORY_VIEW'
  | 'ITEM_VIEW'
  | 'LANGUAGE_CHANGE'
  | 'SESSION_END'

export interface AnalyticsEventPayload {
  businessId: string
  menuId?: string
  type: AnalyticsEventType
  itemId?: string
  categoryId?: string
  language?: string
  sessionId: string
  tableNumber?: string
  metadata?: Record<string, any>
}

export const analyticsApi = {
  menu: (menuId: string) => api.get(`/analytics/menu/${menuId}`),
  business: (businessId: string) => api.get(`/analytics/business/${businessId}`),
  event: (payload: AnalyticsEventPayload) => api.post('/analytics/event', payload),
}

// ─── Subscriptions ───────────────────────────────────────────
export const subscriptionApi = {
  plans: () => api.get('/subscriptions/plans'),
  my: () => api.get('/subscriptions/my'),
  upgrade: (plan: string) => api.post('/subscriptions/upgrade', { plan }),
  createCheckout: (plan: string) => api.post('/subscriptions/create-checkout', { plan }),
  cancel: () => api.post('/subscriptions/cancel'),
}

// ─── Upload ──────────────────────────────────────────────────
export const uploadApi = {
  image: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post<{ url: string }>('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

// ─── Public ──────────────────────────────────────────────────
export const publicApi = {
  menu: (slug: string, lang = 'TR', table?: number, menuId?: string) =>
    api.get(`/public/menu/${slug}`, { params: { lang, table, menuId } }),
}

// ─── Insights ────────────────────────────────────────────────
export type InsightSeverity = 'INFO' | 'SUGGESTION' | 'IMPORTANT'
export type InsightStatus = 'NEW' | 'VIEWED' | 'APPLIED' | 'DISMISSED'
export type InsightStatusFilter = 'new' | 'viewed' | 'applied' | 'dismissed' | 'all'

export interface Insight {
  id: string
  businessId: string
  ruleId: string
  severity: InsightSeverity
  title: string
  body: string
  rawData: Record<string, any>
  actionType: string | null
  actionData: Record<string, any> | null
  status: InsightStatus
  weekOf: string
  createdAt: string
}

export interface InsightListResponse {
  items: Insight[]
  counts: { new: number; viewed: number; applied: number; dismissed: number }
}

export const insightsApi = {
  list: (status: InsightStatusFilter = 'new') =>
    api.get<InsightListResponse>('/insights', { params: { status } }),
  apply: (id: string) => api.post<Insight>(`/insights/${id}/apply`),
  dismiss: (id: string) => api.post<Insight>(`/insights/${id}/dismiss`),
  view: (id: string) => api.get<Insight>(`/insights/${id}/view`),
}

// ─── Notifications ───────────────────────────────────────────
export type NotificationType = 'WEEKLY_INSIGHTS_READY' | 'SYSTEM'

export interface AppNotification {
  id: string
  userId: string
  businessId: string | null
  type: NotificationType
  title: string
  body: string
  data: Record<string, any> | null
  readAt: string | null
  createdAt: string
}

export interface NotificationPreferences {
  weeklyInsightsEmail: boolean
  weeklyInsightsInApp: boolean
}

export const notificationsApi = {
  list: () => api.get<AppNotification[]>('/notifications'),
  unreadCount: () => api.get<{ count: number }>('/notifications/unread-count'),
  markAllRead: () => api.post<{ updated: number }>('/notifications/mark-read'),
  markRead: (id: string) => api.post<{ ok: boolean }>(`/notifications/${id}/read`),
  getPreferences: () => api.get<NotificationPreferences>('/notifications/preferences'),
  updatePreferences: (patch: Partial<NotificationPreferences>) =>
    api.patch<NotificationPreferences>('/notifications/preferences', patch),
}

export default api
