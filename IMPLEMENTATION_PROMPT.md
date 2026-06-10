# QRmenu — Admin Panel + Dashboard Yenileme Implementation Prompt

## Bağlam

QRmenu çok dilli (TR/EN/AR) bir QR menü SaaS'i. Stack:
- **Backend**: NestJS + Prisma + PostgreSQL ([backend/](backend/))
- **Frontend**: Vue 3 + TypeScript + Pinia + Vue Router + TailwindCSS + vue-i18n ([frontend/](frontend/))
- **Auth**: JWT, `useAuthStore` ([frontend/src/stores/auth.ts](frontend/src/stores/auth.ts))
- **Plan tipleri**: `FREE | PRO | PREMIUM`

Mevcut işletme/menü/QR/analytics akışları çalışıyor. Landing page yeniden tasarlandı: koyu metin (`#191518`), primary mavi (`#3b5bdb`), accent (`#768dfb`), bg (`#fafafa`), border (`#d8d8d8`), font `Waldenburg, Bricolage Grotesque`. Panelin tipografi ve renk paleti landing ile tam uyumlu olmalı.

## Hedef

1. **Role tabanlı admin (menusflow kurucusu)**: User'a role enum eklenecek; `/admin` altında ayrı layout ile bir kontrol paneli (tüm kullanıcılar, tüm işletmeler, tüm aktif menüler görünür).
2. **Dashboard zenginleştirme**: Mevcut kullanıcı paneli landing tasarım diline taşınacak; aktivite akışı, 30 günlük tarama grafiği, top menü/ürün, hızlı eylemler eklenecek; dummy veri frontend mock'larından beslenecek.
3. **Tasarım tutarlılığı**: Tüm panel sayfaları landing'in tipografi/renk/spacing diline çekilecek.

---

## İş Paketi 1 — Backend: Role + Admin Module

### 1.1 Prisma schema
[backend/prisma/schema.prisma](backend/prisma/schema.prisma):
- `enum UserRole { USER ADMIN SUPER_ADMIN }`
- `User` modeline: `role UserRole @default(USER)`
- Migration: `npx prisma migrate dev --name add_user_role`
- [backend/prisma/seed.ts](backend/prisma/seed.ts): mevcut admin email'i (örn. `hasan.siwi@gmail.com`) `SUPER_ADMIN` olarak işaretle, ayrıca 15+ dummy user + işletme + menü seed et (admin ekranlarında gerçek veri görünsün diye).

### 1.2 Roles guard + decorator
- `backend/src/common/decorators/roles.decorator.ts` → `@Roles(...roles: UserRole[])`
- `backend/src/common/guards/roles.guard.ts` → request.user.role kontrolü
- Global `JwtAuthGuard`'tan sonra controller seviyesinde `RolesGuard` uygulanacak.

### 1.3 Admin module
`backend/src/modules/admin/` yeni modül:
- `admin.module.ts`, `admin.controller.ts`, `admin.service.ts`
- Endpoint'ler (hepsi `@Roles(ADMIN, SUPER_ADMIN)`):
  - `GET /admin/stats` → `{ totalUsers, totalBusinesses, totalMenus, totalScans, planDistribution: { FREE, PRO, PREMIUM }, newUsersLast7Days }`
  - `GET /admin/users?search=&plan=&role=&page=&limit=` → paginated user listesi (her user için `_count: { businesses }`)
  - `GET /admin/users/:id` → user + businesses (her birinin menus + `_count: { qrCodes, scans }`)
  - `PATCH /admin/users/:id` → `{ plan?, role?, isActive? }` (yalnızca `SUPER_ADMIN`)
  - `GET /admin/businesses?search=&page=&limit=` → paginated, owner info ile
  - `GET /admin/menus?active=true&page=&limit=` → tüm menüler, business + owner email + slug
- DTO'lar `class-validator` ile.
- `app.module.ts`'a kaydı ekle.

### 1.4 Auth response güncellemesi
- `auth.service.ts` login/register/me response'larında `role` döndür.
- Tip senkronizasyonu için frontend'de `User` interface güncellenecek.

---

## İş Paketi 2 — Frontend: Admin Panel

### 2.1 Auth store
[frontend/src/stores/auth.ts](frontend/src/stores/auth.ts):
- `User` interface'ine `role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'`
- Computed: `isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN'`, `isSuperAdmin`

### 2.2 Router + guard
[frontend/src/router/index.ts](frontend/src/router/index.ts):
- Yeni route grubu:
  ```
  /admin                       → AdminLayout
    ''                         → admin-dashboard      (AdminDashboardView)
    'users'                    → admin-users          (AdminUsersView)
    'users/:id'                → admin-user-detail    (AdminUserDetailView)
    'businesses'               → admin-businesses     (AdminBusinessesView)
    'menus'                    → admin-menus          (AdminMenusView)
  ```
- `meta: { requiresAuth: true, requiresRole: ['ADMIN','SUPER_ADMIN'] }`
- `beforeEach` guard: `requiresRole` varsa `auth.user.role` kontrolü, yoksa `/app`'e yönlendir.

### 2.3 Yeni layout: `frontend/src/components/layout/AdminLayout.vue`
Landing dilinde:
- Font: `'Waldenburg', 'Bricolage Grotesque', sans-serif` (global)
- Renkler: bg `#fafafa`, sidebar `#191518` (koyu — admin moduna işaret), aktif link `#3b5bdb`
- Sol sidebar: Logo + "Admin" rozeti, nav linkleri (Genel Bakış / Kullanıcılar / İşletmeler / Menüler), alt kısımda user info + logout
- Top bar: sayfa başlığı, "Admin Mode" pill, normal panele dön linki (`/app`)

### 2.4 API katmanı
`frontend/src/api/admin.ts` yeni dosya:
- `adminApi.stats()`, `users(params)`, `userDetail(id)`, `updateUser(id, dto)`, `businesses(params)`, `menus(params)`

### 2.5 Sayfalar
- **AdminDashboardView**: 4'lü stat kartı (toplam user/business/menu/today scans), plan dağılım donut/bar, son 5 user listesi, plan ramp bar (FREE/PRO/PREMIUM yüzde).
- **AdminUsersView**: Tablo (Email, İsim, Plan, Role, İşletme sayısı, Kayıt tarihi, Durum, Aksiyon → detail). Search input + plan/role filter + pagination.
- **AdminUserDetailView**: User bilgi kartı, plan/role/isActive değiştirme paneli (`SUPER_ADMIN` ise), işletmeler accordion (her biri menüleri ile).
- **AdminBusinessesView**: Tablo (İşletme adı, Owner email, Slug, Menu sayısı, Aktif/Pasif, Oluşturma), `/menu/:slug` preview butonu.
- **AdminMenusView**: Liste/tablo (Menü adı, İşletme, Owner, Tema, Aktif, QR sayısı, Preview).

### 2.6 i18n
TR/EN/AR çevirileri `frontend/src/i18n/locales/*.ts` içine `admin.*` namespace'i altında.

---

## İş Paketi 3 — Dashboard Yenileme

### 3.1 Tasarım uyumu
[frontend/src/components/layout/DashboardLayout.vue](frontend/src/components/layout/DashboardLayout.vue) & [frontend/src/views/dashboard/DashboardView.vue](frontend/src/views/dashboard/DashboardView.vue):
- Primary mavi → `#3b5bdb` (landing ile aynı), accent → `#768dfb`
- Tipografi: section "tag" + "sec-title" stilini panele uyarla
- Spacing/border-radius: landing card stilleri ile aynı (12-16px radius, soft shadow)
- Tailwind config (`frontend/tailwind.config.js`) custom color tokens: `brand: { primary: '#3b5bdb', accent: '#768dfb', ink: '#191518', surface: '#fafafa', line: '#d8d8d8' }`

### 3.2 Yeni dashboard bölümleri (`DashboardView.vue`)
1. **Welcome banner**: Landing hero diline benzer koyu mini-band, gradient detay
2. **Stat row** (mevcut 4 kart — yeniden stillenmiş)
3. **30 günlük tarama trendi**: Saf SVG line chart (Chart.js yok), mock data'dan
4. **Aktivite akışı**: Son 10 olay (yeni menü, QR taraması, plan upgrade vb.) — ikonlu timeline
5. **Top menüler & ürünler**: Top 3 menu kartı + Top 5 product listesi
6. **Hızlı eylemler**: Yeni İşletme / Yeni Menü / Yeni QR / Insights butonları (grid)

### 3.3 Mock data
`frontend/src/mocks/` yeni klasör:
- `dashboardStats.ts` — `scansTrend: { date: string, count: number }[]` (30 nokta), `topMenus`, `topProducts`
- `activityFeed.ts` — `ActivityItem[]` (type, title, meta, timestamp, icon)
- `adminUsers.ts` — 18-20 dummy user (her biri 1-3 işletme, her işletme 1-2 menü)
- `adminBusinesses.ts` — adminUsers'tan flatten
- `adminMenus.ts` — adminBusinesses'tan flatten

Her mock dosyası `export const ...` ile pure veri export'lar; component'lerde TypeScript tipleriyle import edilir. Sonra backend'e bağlanırken sadece import → `api` çağrısı değiştirilir.

---

## Sıra

1. **Sprint 1 — Backend role + admin endpoints + seed dummy data**
2. **Sprint 2 — Admin frontend: layout + dashboard + users + user detail**
3. **Sprint 3 — Dashboard yenileme (tasarım + mock + yeni bölümler)**
4. **Sprint 4 — Admin businesses + menus sayfaları + responsive cila + i18n**

Her sprint sonunda: `npm run build` (frontend) + `npm run build` (backend) hatasız geçmeli; `prisma migrate` temiz.

---

## Kabul kriterleri

- [ ] `SUPER_ADMIN` user `/admin` route'una girebiliyor, `USER` giremiyor (yönlendirme `/app`).
- [ ] `/admin/users` 20+ dummy user gösteriyor, search/filter/pagination çalışıyor.
- [ ] `/admin/users/:id` user detayında işletmeler + menüler drill-down çalışıyor.
- [ ] `SUPER_ADMIN` user detayında plan/role/isActive değiştirebiliyor.
- [ ] Yenilenen `/app` dashboard'unda landing tipografi/renkleri uygulanmış, 4 yeni bölüm (trend grafiği, aktivite, top, hızlı eylemler) render oluyor.
- [ ] Mobile (375px) ve desktop (1440px) ekranlarda admin + dashboard responsive.
- [ ] i18n TR/EN/AR tüm yeni metinler için var; AR RTL bozulmamış.
- [ ] Backend testleri (`admin.controller`, `roles.guard`) yeşil.

---

## Önemli notlar

- **Tasarım dilinin kaynağı**: [frontend/src/views/landing/LandingView.vue](frontend/src/views/landing/LandingView.vue) — class isimleri (`tag`, `sec-title`, `sec-sub`, `reveal`, `nav`, vb.) ve renk değerleri buradan birebir alınmalı.
- **Plan limitleri**: Mevcut `PLAN_LIMITS` mantığını koru, admin override etmeyecek (kullanıcının planına saygı duy).
- **Güvenlik**: Admin endpoint'lerinde her zaman role check; password/hassas alanlar response'tan exclude.
- **Mock → API geçişi**: Mock dosyaları kaldırılmayacak — backend bağlanınca sadece import değişecek (mock dosyaları future use için kalsın).
- **Frontend dist klasörü**: `frontend/dist/` build artifact'ları — commit'lere dahil etme.
