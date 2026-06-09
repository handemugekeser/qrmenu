<template>
  <div class="menu-root" :class="{ 'rtl-layout': currentLang === 'AR' }" :style="themeStyle">

    <!-- ── Loading ──────────────────────────────────────────────── -->
    <div v-if="loading" class="state-screen">
      <div class="loader-ring">
        <svg viewBox="0 0 50 50" class="spinner">
          <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="2.5"
            stroke-linecap="round" stroke-dasharray="90 60" />
        </svg>
      </div>
      <p class="state-label">Menü yükleniyor…</p>
    </div>

    <!-- ── 404 ─────────────────────────────────────────────────── -->
    <div v-else-if="!data" class="state-screen">
      <div class="notfound-code">404</div>
      <h1 class="notfound-title">Menü Bulunamadı</h1>
      <p class="state-label">Bu adrese ait aktif bir menü yok.</p>
    </div>

    <!-- ── Main ─────────────────────────────────────────────────── -->
    <div v-else class="menu-main">

      <!-- ── Top Header ──────────────────────────────────────────── -->
      <header class="top-header" :class="{ 'has-cover': !!data.business.coverUrl }">
        <!-- Blurred cover as background when available -->
        <div v-if="data.business.coverUrl" class="header-cover-bg">
          <img :src="data.business.coverUrl" class="cover-blur-img" alt="" />
          <div class="cover-blur-overlay" />
        </div>
        <!-- Subtle accent mesh when no cover -->
        <div v-else class="header-mesh" />

        <div class="header-inner">
          <!-- Business identity -->
          <div class="biz-row">
            <div class="biz-logo-wrap">
              <img v-if="data.business.logoUrl" :src="data.business.logoUrl" class="biz-logo" alt="" />
              <span v-else class="biz-logo-letter">{{ data.business.name[0] }}</span>
            </div>
            <div class="biz-info">
              <h1 class="biz-name">{{ data.business.name }}</h1>
              <p v-if="data.business.phone" class="biz-phone">
                <svg viewBox="0 0 14 14" width="11" height="11" fill="currentColor"><path d="M3.2 1.3a.6.6 0 0 0-.9-.05L1.4 2.15c-.43.43-.58 1.04-.4 1.58a15.6 15.6 0 0 0 3.71 5.87 15.6 15.6 0 0 0 5.87 3.71c.54.18 1.15.03 1.58-.4l.9-.9a.6.6 0 0 0-.06-.9L10.95 9.6a.6.6 0 0 0-.52-.11l-1.94.49a1.55 1.55 0 0 1-1.47-.41L5.43 7.98a1.55 1.55 0 0 1-.41-1.47l.49-1.94a.6.6 0 0 0-.11-.52L3.2 1.3z"/></svg>
                {{ data.business.phone }}
              </p>
            </div>
          </div>

          <!-- Actions row -->
          <div class="header-actions">
            <div v-if="tableNumber" class="table-badge">
              <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor"><rect x="1" y="4" width="14" height="2" rx="1"/><rect x="4" y="6" width="1.5" height="6" rx="0.75"/><rect x="10.5" y="6" width="1.5" height="6" rx="0.75"/><rect x="2" y="11" width="12" height="1.5" rx="0.75"/></svg>
              Masa {{ tableNumber }}
            </div>
            <div class="lang-dropdown" v-click-outside="() => langOpen = false">
              <button class="lang-selected" @click="langOpen = !langOpen">
                {{ currentLang }}
                <svg :class="['lang-chevron', { open: langOpen }]" viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 4l4 4 4-4"/></svg>
              </button>
              <div v-if="langOpen" class="lang-options">
                <button v-for="l in langs" :key="l.code"
                  :class="['lang-option', { active: currentLang === l.code }]"
                  @click="switchLang(l.code); langOpen = false">
                  {{ l.flag }}
                  <svg v-if="currentLang === l.code" viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M2 6l3 3 5-5"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- ── Search bar ──────────────────────────────────────────── -->
      <div class="search-wrap">
        <div class="search-bar" :class="{ focused: searchFocused }">
          <svg class="search-icon" viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="8.5" cy="8.5" r="5.5"/><path d="M15 15l-3-3"/></svg>
          <input
            v-model="searchQuery"
            @focus="searchFocused = true"
            @blur="searchFocused = false"
            class="search-input"
            :placeholder="currentLang === 'AR' ? 'ابحث في القائمة...' : currentLang === 'EN' ? 'Search menu...' : 'Menüde ara...'"
            autocomplete="off"
          />
          <button v-if="searchQuery" @click="searchQuery = ''" class="search-clear">
            <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 1l12 12M13 1L1 13"/></svg>
          </button>
        </div>
      </div>

      <!-- ── Search results ─────────────────────────────────────── -->
      <template v-if="searchQuery">
        <div v-if="searchResults.length" class="search-results-wrap">
          <p class="search-count">{{ searchResults.length }} sonuç</p>
          <div class="product-list padded">
            <button v-for="(prod, idx) in searchResults" :key="prod.id"
              @click="openProduct(prod)"
              class="prod-card"
              :style="`animation-delay:${Number(idx) * 40}ms`">
              <div class="prod-body">
                <div class="prod-top">
                  <span class="prod-name">{{ prod.name }}</span>
                  <span v-if="prod.isPopular" class="popular-badge">
                    <svg viewBox="0 0 10 10" width="8" height="8" fill="currentColor"><path d="M5 1l.9 1.8 2 .3-1.45 1.4.34 2L5 5.5l-1.8.95.35-2L2.1 3.1l2-.3z"/></svg>
                    Popüler
                  </span>
                </div>
                <p v-if="prod.description" class="prod-desc">{{ prod.description }}</p>
                <div class="prod-meta-row">
                  <span class="prod-price">{{ fmt(prod.basePrice) }}</span>
                  <span v-if="prod.calories" class="calorie-chip">{{ prod.calories }} kcal</span>
                </div>
              </div>
              <div class="prod-img-wrap">
                <img v-if="prod.imageUrl" :src="prod.imageUrl" class="prod-img" :alt="prod.name" />
                <div v-else class="prod-img-placeholder">🍽️</div>
              </div>
            </button>
          </div>
        </div>
        <div v-else class="no-results">
          <div class="no-results-icon">🔍</div>
          <p class="no-results-title">Sonuç bulunamadı</p>
          <p class="no-results-sub">«{{ searchQuery }}» ile eşleşen ürün yok</p>
        </div>
      </template>

      <!-- ── Normal content (not searching) ────────────────────── -->
      <template v-else>

        <!-- ── Promo / Featured banner ─────────────────────────── -->
        <div v-if="featuredProducts.length" class="promo-section">
          <div class="promo-header-row">
            <span class="promo-eyebrow">Öne Çıkanlar</span>
            <span class="promo-sub">Bugünün favorileri</span>
          </div>
          <div class="promo-scroll">
            <button
              v-for="(prod, idx) in featuredProducts"
              :key="prod.id"
              @click="openProduct(prod)"
              class="promo-card"
              :style="`--card-idx:${Number(idx)}; animation-delay:${Number(idx) * 80}ms`">
              <!-- Glass blur background layer -->
              <div class="promo-card-bg" />
              <!-- Decorative blobs -->
              <div class="promo-blob promo-blob-1" />
              <div class="promo-blob promo-blob-2" />
              <!-- Content -->
              <div class="promo-card-content">
                <span class="promo-tag">
                  <svg viewBox="0 0 10 10" width="8" height="8" fill="currentColor"><path d="M5 1l.9 1.8 2 .3-1.45 1.4.34 2L5 5.5l-1.8.95.35-2L2.1 3.1l2-.3z"/></svg>
                  Popüler
                </span>
                <p class="promo-name">{{ prod.name }}</p>
                <p v-if="prod.description" class="promo-desc">{{ prod.description }}</p>
                <p class="promo-price">{{ fmt(prod.basePrice) }}</p>
              </div>
              <!-- Product image -->
              <div class="promo-img-wrap">
                <img v-if="prod.imageUrl" :src="prod.imageUrl" class="promo-img" :alt="prod.name" />
                <div v-else class="promo-img-fallback">🍽️</div>
              </div>
            </button>
          </div>
        </div>

        <!-- ── Category nav ────────────────────────────────────── -->
        <nav class="cat-nav" ref="navRef">
          <div class="cat-nav-inner">
            <button v-for="cat in activeCategories" :key="cat.id"
              @click="scrollTo(cat.id)"
              :class="['cat-btn', { active: activeCat === cat.id }]">
              {{ cat.name }}
            </button>
          </div>
        </nav>

        <!-- ── Product sections ───────────────────────────────── -->
        <div class="sections-wrap">
          <section v-for="cat in activeCategories" :key="cat.id" :id="`cat-${cat.id}`" class="cat-section">
            <div class="cat-header">
              <h2 class="cat-title">{{ cat.name }}</h2>
              <span class="cat-count">{{ cat.products.length }} ürün</span>
            </div>
            <div class="product-list">
              <button v-for="(prod, idx) in cat.products" :key="prod.id"
                @click="openProduct(prod)"
                class="prod-card"
                :style="`animation-delay:${Number(idx) * 50}ms`">
                <div class="prod-body">
                  <div class="prod-top">
                    <span class="prod-name">{{ prod.name }}</span>
                    <span v-if="prod.isPopular" class="popular-badge">
                      <svg viewBox="0 0 10 10" width="8" height="8" fill="currentColor"><path d="M5 1l.9 1.8 2 .3-1.45 1.4.34 2L5 5.5l-1.8.95.35-2L2.1 3.1l2-.3z"/></svg>
                      Popüler
                    </span>
                  </div>
                  <p v-if="prod.description" class="prod-desc">{{ prod.description }}</p>
                  <div class="prod-meta-row">
                    <span class="prod-price">{{ fmt(prod.basePrice) }}</span>
                    <span v-if="prod.variants?.length" class="variants-hint">+seçenek</span>
                    <span v-if="prod.calories" class="calorie-chip">{{ prod.calories }} kcal</span>
                  </div>
                  <div v-if="prod.allergens?.length" class="allergen-mini-row">
                    <span v-for="a in prod.allergens.slice(0, 5)" :key="a" class="allergen-mini" :title="getAllergenLabel(a)">{{ getAllergenEmoji(a) }}</span>
                    <span v-if="prod.allergens.length > 5" class="allergen-more">+{{ prod.allergens.length - 5 }}</span>
                  </div>
                </div>
                <div class="prod-img-wrap">
                  <img v-if="prod.imageUrl" :src="prod.imageUrl" class="prod-img" :alt="prod.name" />
                  <div v-else class="prod-img-placeholder">🍽️</div>
                  <div v-if="prod.variants?.length" class="prod-badge-img">{{ prod.variants.length }}</div>
                </div>
              </button>
            </div>
          </section>
        </div>

        <!-- ── Social media footer ───────────────────────────── -->
        <footer v-if="hasSocialLinks" class="social-footer">
          <p class="social-title">Bizi takip edin</p>
          <div class="social-links">
            <a v-for="s in activeSocialLinks" :key="s.key"
              :href="s.url" target="_blank" rel="noopener noreferrer"
              class="social-btn" :style="`--s-color:${s.color}`"
              :title="s.label">
              <span class="social-icon" v-html="s.svg" />
            </a>
          </div>
        </footer>
        <div style="height: 32px" />
      </template>
    </div>

    <!-- ── Product detail sheet ──────────────────────────────── -->
    <Transition name="sheet">
      <div v-if="selProd" class="sheet-backdrop" @click.self="closeSheet">
        <div class="sheet">
          <div class="sheet-drag-handle" />
          <button class="sheet-close" @click="closeSheet">
            <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 1l12 12M13 1L1 13"/></svg>
          </button>

          <div class="sheet-scroll">
            <div v-if="selProd.imageUrl" class="sheet-img-wrap">
              <img :src="selProd.imageUrl" class="sheet-img" :alt="selProd.name" />
              <div class="sheet-img-fade" />
            </div>
            <div v-else class="sheet-img-placeholder-wrap">
              <div class="sheet-img-placeholder-inner">🍽️</div>
            </div>

            <div class="sheet-content">
              <div class="sheet-title-row">
                <h3 class="sheet-name">{{ selProd.name }}</h3>
                <span v-if="selProd.isPopular" class="popular-badge">
                  <svg viewBox="0 0 10 10" width="8" height="8" fill="currentColor"><path d="M5 1l.9 1.8 2 .3-1.45 1.4.34 2L5 5.5l-1.8.95.35-2L2.1 3.1l2-.3z"/></svg>
                  Popüler
                </span>
              </div>

              <p v-if="selProd.description" class="sheet-desc">{{ selProd.description }}</p>

              <div v-if="selProd.calories" class="calorie-banner">
                <div class="calorie-icon-wrap">
                  <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor"><path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd"/></svg>
                </div>
                <div class="calorie-main">
                  <span class="calorie-num">{{ selProd.calories }}</span>
                  <span class="calorie-unit">kcal</span>
                </div>
                <span class="calorie-note">100g başına tahmini değer</span>
              </div>

              <div v-if="selProd.allergens?.length" class="section-block">
                <h4 class="section-label">Alerjenler</h4>
                <div class="allergen-grid">
                  <div v-for="a in selProd.allergens" :key="a" class="allergen-tag">
                    <span class="allergen-emoji">{{ getAllergenEmoji(a) }}</span>
                    <span class="allergen-label">{{ getAllergenLabel(a) }}</span>
                  </div>
                </div>
              </div>

              <div v-if="selProd.variants?.length" class="section-block">
                <h4 class="section-label">Seçenek</h4>
                <div class="option-list">
                  <label v-for="v in selProd.variants" :key="v.id"
                    class="option-item" :class="{ selected: selVariant?.id === v.id }"
                    @click="selVariant = v">
                    <div class="option-radio" :class="{ active: selVariant?.id === v.id }">
                      <div v-if="selVariant?.id === v.id" class="option-radio-dot" />
                    </div>
                    <span class="option-name">{{ v.name }}</span>
                    <span class="option-price">{{ fmt(v.price) }}</span>
                  </label>
                </div>
              </div>

              <div v-if="selProd.extras?.length" class="section-block">
                <h4 class="section-label">Ekstralar</h4>
                <div class="option-list">
                  <label v-for="e in selProd.extras" :key="e.id"
                    class="option-item" :class="{ selected: selExtras.includes(e.id) }"
                    @click="toggleExtra(e.id)">
                    <div class="option-check" :class="{ active: selExtras.includes(e.id) }">
                      <svg v-if="selExtras.includes(e.id)" viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="M2 6l3 3 5-5"/></svg>
                    </div>
                    <span class="option-name">{{ e.name }}</span>
                    <span class="option-price">+{{ fmt(e.price) }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="sheet-footer">
            <div class="total-row">
              <div class="total-info">
                <p class="total-label">Toplam</p>
                <p class="total-price">{{ fmt(totalPrice) }}</p>
              </div>
              <button @click="closeSheet" class="confirm-btn">Tamam</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const vClickOutside = {
  mounted(el: HTMLElement, binding: any) {
    el._clickOutside = (e: MouseEvent) => { if (!el.contains(e.target as Node)) binding.value(e) }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el: HTMLElement) { document.removeEventListener('click', el._clickOutside) },
}
import { useRoute } from 'vue-router'
import { publicApi, analyticsApi, type AnalyticsEventPayload, type AnalyticsEventType } from '@/api'

const SESSION_KEY = 'qrmenu_session_id'
function getSessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY)
    if (!id) {
      id = (crypto as any).randomUUID?.() ?? `s_${Date.now()}_${Math.random().toString(36).slice(2)}`
      sessionStorage.setItem(SESSION_KEY, id)
    }
    return id
  } catch {
    return `s_${Date.now()}_${Math.random().toString(36).slice(2)}`
  }
}
const sessionId = getSessionId()

const ALLERGEN_MAP: Record<string, { emoji: string; label: string }> = {
  GLUTEN:    { emoji: '🌾', label: 'Gluten' },
  MILK:      { emoji: '🥛', label: 'Süt' },
  EGGS:      { emoji: '🥚', label: 'Yumurta' },
  PEANUTS:   { emoji: '🥜', label: 'Fıstık' },
  SOY:       { emoji: '🫘', label: 'Soya' },
  FISH:      { emoji: '🐟', label: 'Balık' },
  SHELLFISH: { emoji: '🦐', label: 'Kabuklu Deniz' },
  SESAME:    { emoji: '⚫', label: 'Susam' },
  NUTS:      { emoji: '🌰', label: 'Kuruyemiş' },
  CELERY:    { emoji: '🥬', label: 'Kereviz' },
  MUSTARD:   { emoji: '🌻', label: 'Hardal' },
  SULFITES:  { emoji: '🧪', label: 'Sülfitler' },
}

const route       = useRoute()
const data        = ref<any>(null)
const loading     = ref(true)
const currentLang = ref('TR')
const selProd     = ref<any>(null)
const selVariant  = ref<any>(null)
const selExtras   = ref<string[]>([])
const activeCat   = ref('')
const navRef      = ref<HTMLElement | null>(null)
const searchQuery = ref('')
const searchFocused = ref(false)
const langOpen = ref(false)

const langs = [
  { code: 'TR', flag: 'TR' },
  { code: 'EN', flag: 'EN' },
  { code: 'AR', flag: 'AR' },
]

const tableNumber = computed(() => {
  const t = route.query.table
  return t ? parseInt(t as string) : null
})
const menuId = computed(() => route.query.menuId as string | undefined)

const themeStyle = computed(() => {
  const color = data.value?.menu?.themeColor
  if (!color) return {}
  const r = parseInt(color.slice(1, 3), 16)
  const g = parseInt(color.slice(3, 5), 16)
  const b = parseInt(color.slice(5, 7), 16)
  return {
    '--accent':        color,
    '--accent-rgb':    `${r},${g},${b}`,
    '--accent-soft':   `rgba(${r},${g},${b},0.08)`,
    '--accent-medium': `rgba(${r},${g},${b},0.18)`,
    '--accent-glow':   `rgba(${r},${g},${b},0.30)`,
  }
})

const activeCategories = computed(() =>
  (data.value?.menu?.categories || []).filter((c: any) => c.products?.length > 0)
)

const featuredProducts = computed(() => {
  const all: any[] = []
  for (const cat of activeCategories.value) {
    for (const p of cat.products) {
      if (p.isPopular) all.push(p)
    }
  }
  return all.slice(0, 6)
})

const SOCIAL_DEFS = [
  { key: 'instagram', label: 'Instagram', color: '#E1306C', svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>` },
  { key: 'facebook',  label: 'Facebook',  color: '#1877F2', svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>` },
  { key: 'twitter',   label: 'X',         color: '#000000', svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.258 5.63 5.906-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>` },
  { key: 'tiktok',    label: 'TikTok',    color: '#010101', svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/></svg>` },
  { key: 'youtube',   label: 'YouTube',   color: '#FF0000', svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>` },
  { key: 'whatsapp',  label: 'WhatsApp',  color: '#25D366', svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>` },
]

const activeSocialLinks = computed(() => {
  const links = data.value?.business?.socialLinks || {}
  return SOCIAL_DEFS.filter(s => links[s.key]?.trim()).map(s => ({ ...s, url: links[s.key].trim() }))
})

const hasSocialLinks = computed(() => activeSocialLinks.value.length > 0)

const searchResults = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return []
  const results: any[] = []
  for (const cat of activeCategories.value) {
    for (const p of cat.products) {
      if (
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      ) results.push(p)
    }
  }
  return results
})

const totalPrice = computed(() => {
  if (!selProd.value) return 0
  let base = selVariant.value ? Number(selVariant.value.price) : Number(selProd.value.basePrice)
  for (const eid of selExtras.value) {
    const e = selProd.value.extras?.find((x: any) => x.id === eid)
    if (e) base += Number(e.price)
  }
  return base
})

function getAllergenEmoji(id: string) { return ALLERGEN_MAP[id]?.emoji ?? '⚠️' }
function getAllergenLabel(id: string) { return ALLERGEN_MAP[id]?.label ?? id }

const scanTracked = ref(false)

function buildEvent(type: AnalyticsEventType, extra: Partial<AnalyticsEventPayload> = {}): AnalyticsEventPayload | null {
  const businessId = data.value?.menu?.businessId
  if (!businessId) return null
  return {
    businessId,
    menuId: data.value?.menu?.id,
    type,
    language: currentLang.value,
    sessionId,
    tableNumber: tableNumber.value ? String(tableNumber.value) : undefined,
    ...extra,
  }
}

function trackEvent(type: AnalyticsEventType, extra: Partial<AnalyticsEventPayload> = {}) {
  const payload = buildEvent(type, extra)
  if (!payload) return
  analyticsApi.event(payload).catch(() => {})
}

function trackSessionEnd() {
  const payload = buildEvent('SESSION_END')
  if (!payload) return
  try {
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
    if (!navigator.sendBeacon('/api/analytics/event', blob)) {
      analyticsApi.event(payload).catch(() => {})
    }
  } catch {
    analyticsApi.event(payload).catch(() => {})
  }
}

onMounted(() => {
  loadMenu()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('beforeunload', trackSessionEnd)
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('beforeunload', trackSessionEnd)
})

function onScroll() {
  const cats = activeCategories.value
  for (let i = cats.length - 1; i >= 0; i--) {
    const el = document.getElementById(`cat-${cats[i].id}`)
    if (el && el.getBoundingClientRect().top <= 120) {
      activeCat.value = cats[i].id
      return
    }
  }
  if (cats.length) activeCat.value = cats[0].id
}

async function loadMenu() {
  loading.value = true
  try {
    const { data: res } = await publicApi.menu(
      route.params.slug as string,
      currentLang.value,
      tableNumber.value || undefined,
      menuId.value,
    )
    data.value = res
    if (activeCategories.value.length) activeCat.value = activeCategories.value[0].id
    if (!scanTracked.value) {
      scanTracked.value = true
      trackEvent('SCAN_OPEN')
    }
  } catch { data.value = null }
  finally { loading.value = false }
}

async function switchLang(lang: string) {
  const prev = currentLang.value
  currentLang.value = lang
  trackEvent('LANGUAGE_CHANGE', { metadata: { from: prev, to: lang } })
  await loadMenu()
}

function openProduct(prod: any) {
  selProd.value    = prod
  selVariant.value = prod.variants?.find((v: any) => v.isDefault) || prod.variants?.[0] || null
  selExtras.value  = []
  document.body.style.overflow = 'hidden'
  trackEvent('ITEM_VIEW', { itemId: prod.id, categoryId: prod.categoryId })
}

function closeSheet() {
  selProd.value = null
  document.body.style.overflow = ''
}

function toggleExtra(id: string) {
  const idx = selExtras.value.indexOf(id)
  if (idx === -1) selExtras.value.push(id)
  else selExtras.value.splice(idx, 1)
}

function scrollTo(id: string) {
  activeCat.value = id
  trackEvent('CATEGORY_VIEW', { categoryId: id })
  const el = document.getElementById(`cat-${id}`)
  if (!el) return
  const navH = navRef.value?.offsetHeight ?? 56
  const top = el.getBoundingClientRect().top + window.scrollY - navH - 8
  window.scrollTo({ top, behavior: 'smooth' })
}

function fmt(price: any) {
  const currency = data.value?.business?.currency || 'TRY'
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency }).format(Number(price))
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

/* ── Design tokens ─────────────────────────────────────────────── */
.menu-root {
  --accent:        #E67E22;
  --accent-rgb:    230,126,34;
  --accent-soft:   rgba(230,126,34,0.08);
  --accent-medium: rgba(230,126,34,0.18);
  --accent-glow:   rgba(230,126,34,0.30);

  --bg:            #F5F6FA;
  --surface:       #FFFFFF;
  --surface-2:     #EFF1F8;
  --surface-3:     #E4E7F2;
  --border:        rgba(0,0,0,0.06);
  --border-strong: rgba(0,0,0,0.12);

  --text:          #0F172A;
  --text-2:        #334155;
  --text-muted:    #94A3B8;

  --radius-sm:    10px;
  --radius-md:    16px;
  --radius-lg:    22px;
  --radius-xl:    28px;

  --shadow-xs:  0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.05);
  --shadow-sm:  0 2px 8px rgba(0,0,0,0.06);
  --shadow-md:  0 8px 24px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04);
  --shadow-lg:  0 20px 52px rgba(0,0,0,0.14), 0 8px 16px rgba(0,0,0,0.06);

  min-height: 100svh;
  background: var(--bg);
  color: var(--text);
  font-family: 'Poppins', system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

.rtl-layout { direction: rtl; }
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
button { cursor: pointer; border: none; background: none; font: inherit; color: inherit; }
img { display: block; }

/* ── State screens ─────────────────────────────────────────────── */
.state-screen {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: var(--bg);
}
.loader-ring {
  width: 54px; height: 54px;
  background: var(--surface);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  box-shadow: var(--shadow-md);
  color: var(--accent);
}
.spinner { animation: spin 1.1s linear infinite; width: 26px; height: 26px; }
@keyframes spin { to { transform: rotate(360deg); } }
.state-label { color: var(--text-muted); font-size: 13px; font-weight: 500; }
.notfound-code { font-size: 80px; font-weight: 800; color: var(--accent); line-height: 1; letter-spacing: -4px; }
.notfound-title { font-size: 20px; font-weight: 700; color: var(--text); }

/* ── Top header ────────────────────────────────────────────────── */
.top-header {
  position: relative;
  padding: 14px 16px 14px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}

/* When a cover image exists: taller, blurred bg */
.top-header.has-cover { padding-top: 18px; padding-bottom: 18px; }

.header-cover-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
}
.cover-blur-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(28px) saturate(1.2);
  transform: scale(1.1);
}
.cover-blur-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.82);
  backdrop-filter: blur(1px);
}

/* Accent mesh when no cover */
.header-mesh {
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse 60% 80% at 95% 50%, rgba(var(--accent-rgb),0.07) 0%, transparent 70%),
    radial-gradient(ellipse 40% 60% at 5% 50%, rgba(var(--accent-rgb),0.04) 0%, transparent 70%);
}

.header-inner {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.biz-row {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.biz-logo-wrap {
  width: 48px; height: 48px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border);
}
.biz-logo { width: 100%; height: 100%; object-fit: cover; }
.biz-logo-letter {
  display: flex; width: 100%; height: 100%;
  align-items: center; justify-content: center;
  font-size: 20px; font-weight: 800; color: #fff;
  background: linear-gradient(135deg, var(--accent), rgba(var(--accent-rgb),0.65));
}

.biz-info { min-width: 0; }
.biz-name {
  font-size: 16px; font-weight: 700;
  color: var(--text); line-height: 1.2;
  letter-spacing: -0.02em;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.biz-phone {
  font-size: 11.5px; color: var(--text-muted); font-weight: 500;
  margin-top: 2px; display: flex; align-items: center; gap: 4px;
}

.header-actions {
  display: flex; align-items: center; gap: 8px; flex-shrink: 0;
}

.table-badge {
  display: flex; align-items: center; gap: 5px;
  background: var(--surface-2); border: 1px solid var(--border);
  color: var(--text-2); font-size: 11px; font-weight: 600;
  padding: 5px 10px; border-radius: 20px;
  box-shadow: var(--shadow-xs);
  white-space: nowrap;
}

.lang-dropdown { position: relative; }
.lang-selected {
  display: flex; align-items: center; gap: 5px;
  height: 30px; padding: 0 10px;
  border-radius: 20px; font-size: 11px; font-weight: 600; letter-spacing: 0.04em;
  background: var(--accent); color: #fff; border: none; cursor: pointer;
  box-shadow: 0 3px 10px var(--accent-glow);
  transition: opacity 0.15s;
}
.lang-selected:hover { opacity: 0.9; }
.lang-chevron { transition: transform 0.2s ease; flex-shrink: 0; }
.lang-chevron.open { transform: rotate(180deg); }
.lang-options {
  position: absolute; top: calc(100% + 6px); right: 0;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  overflow: hidden; min-width: 72px; z-index: 200;
}
.lang-option {
  display: flex; align-items: center; justify-content: space-between;
  gap: 8px; width: 100%; padding: 9px 14px;
  font-size: 11px; font-weight: 600; letter-spacing: 0.04em;
  color: var(--text-muted); background: transparent; border: none; cursor: pointer;
  transition: background 0.15s;
}
.lang-option:hover { background: var(--surface-2); }
.lang-option.active { color: var(--accent); }

/* ── Search bar ────────────────────────────────────────────────── */
.search-wrap {
  padding: 12px 16px 4px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 40;
}

.search-bar {
  display: flex; align-items: center; gap: 10px;
  background: var(--bg);
  border: 1.5px solid var(--border);
  border-radius: 14px;
  padding: 0 14px;
  height: 44px;
  transition: border-color 0.18s, box-shadow 0.18s;
}
.search-bar.focused {
  border-color: rgba(var(--accent-rgb), 0.5);
  box-shadow: 0 0 0 3px var(--accent-soft);
  background: var(--surface);
}

.search-icon { color: var(--text-muted); flex-shrink: 0; transition: color 0.18s; }
.search-bar.focused .search-icon { color: var(--accent); }

.search-input {
  flex: 1; border: none; background: transparent;
  font: 500 14px/1 'Poppins', sans-serif;
  color: var(--text); outline: none;
  min-width: 0;
}
.search-input::placeholder { color: var(--text-muted); font-weight: 400; }

.search-clear {
  width: 24px; height: 24px; border-radius: 50%;
  background: var(--surface-3); border: none;
  display: flex; align-items: center; justify-content: center;
  color: var(--text-muted); flex-shrink: 0;
  transition: all 0.15s;
}
.search-clear:hover { background: var(--accent-soft); color: var(--accent); }

/* ── Search results ─────────────────────────────────────────────── */
.search-results-wrap { padding: 16px 16px 0; }
.search-count {
  font-size: 12px; font-weight: 600; color: var(--text-muted);
  text-transform: uppercase; letter-spacing: 0.08em;
  margin-bottom: 12px;
}
.product-list.padded { padding-bottom: 32px; }

.no-results {
  padding: 64px 24px;
  display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center;
}
.no-results-icon { font-size: 48px; opacity: 0.4; }
.no-results-title { font-size: 17px; font-weight: 700; color: var(--text); }
.no-results-sub { font-size: 13px; color: var(--text-muted); font-weight: 400; }

/* ── Promo / Featured section ──────────────────────────────────── */
.promo-section { padding: 20px 0 8px; }

.promo-header-row {
  display: flex; align-items: baseline; gap: 8px;
  padding: 0 16px; margin-bottom: 14px;
}
.promo-eyebrow {
  font-size: 15px; font-weight: 700;
  color: var(--text); letter-spacing: -0.02em;
}
.promo-sub {
  font-size: 12px; color: var(--text-muted); font-weight: 400;
}

.promo-scroll {
  display: flex; gap: 12px;
  overflow-x: auto; padding: 4px 16px 12px;
  scrollbar-width: none;
}
.promo-scroll::-webkit-scrollbar { display: none; }

/* Promo card */
.promo-card {
  position: relative;
  flex-shrink: 0;
  width: 220px;
  height: 128px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: linear-gradient(135deg,
    rgba(var(--accent-rgb), 0.90) 0%,
    rgba(var(--accent-rgb), 0.70) 100%
  );
  cursor: pointer;
  text-align: left;
  border: none;
  transition: transform 0.22s ease, box-shadow 0.22s ease;
  box-shadow: 0 6px 20px rgba(var(--accent-rgb), 0.25);
  animation: fadeInRight 0.45s cubic-bezier(0.16,1,0.3,1) both;
}
@keyframes fadeInRight {
  from { opacity: 0; transform: translateX(20px); }
  to   { opacity: 1; transform: translateX(0); }
}
.promo-card:hover { transform: translateY(-3px) scale(1.01); box-shadow: 0 12px 32px rgba(var(--accent-rgb), 0.35); }
.promo-card:active { transform: translateY(0) scale(0.99); }

/* Glass overlay on card */
.promo-card-bg {
  position: absolute; inset: 0;
  background: linear-gradient(135deg,
    rgba(255,255,255,0.12) 0%,
    rgba(255,255,255,0.04) 60%,
    transparent 100%
  );
  backdrop-filter: blur(0px);
}

/* Decorative blobs */
.promo-blob {
  position: absolute;
  border-radius: 50%;
  opacity: 0.18;
  pointer-events: none;
}
.promo-blob-1 {
  width: 100px; height: 100px;
  background: #fff;
  top: -30px; right: 40px;
}
.promo-blob-2 {
  width: 70px; height: 70px;
  background: #fff;
  bottom: -20px; right: 10px;
}

.promo-card-content {
  position: relative; z-index: 2;
  padding: 14px 14px 12px;
  display: flex; flex-direction: column; gap: 4px;
  width: 58%;
}
.promo-tag {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 9px; font-weight: 700; letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.85);
  background: rgba(255,255,255,0.20);
  border: 1px solid rgba(255,255,255,0.25);
  padding: 3px 7px; border-radius: 20px;
  width: fit-content;
}
.promo-name {
  font-size: 14px; font-weight: 700; color: #fff;
  line-height: 1.25; letter-spacing: -0.01em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.promo-desc {
  font-size: 10.5px; color: rgba(255,255,255,0.72); font-weight: 400;
  display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;
}
.promo-price {
  font-size: 14px; font-weight: 800; color: #fff;
  letter-spacing: -0.02em; margin-top: 2px;
}

/* Product image on promo card — overflows intentionally */
.promo-img-wrap {
  position: absolute;
  right: -8px; bottom: -8px;
  width: 110px; height: 110px;
  z-index: 3;
  filter: drop-shadow(-4px -4px 12px rgba(0,0,0,0.22));
}
.promo-img {
  width: 100%; height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
.promo-img-fallback {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  font-size: 40px; opacity: 0.6;
}

/* ── Category nav ─────────────────────────────────────────────── */
.cat-nav {
  position: sticky;
  top: 60px; /* below search bar */
  z-index: 30;
  background: rgba(245,246,250,0.88);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
}
.cat-nav-inner {
  display: flex; gap: 6px;
  overflow-x: auto; padding: 10px 16px;
  scrollbar-width: none;
}
.cat-nav-inner::-webkit-scrollbar { display: none; }

.cat-btn {
  flex-shrink: 0; padding: 7px 18px;
  border-radius: 20px; font-size: 13px; font-weight: 500;
  color: var(--text-muted); background: transparent;
  border: 1.5px solid transparent;
  transition: all 0.2s ease; white-space: nowrap;
  letter-spacing: -0.01em;
}
.cat-btn:hover { color: var(--text-2); background: var(--surface); border-color: var(--border-strong); }
.cat-btn.active {
  background: var(--accent); color: #fff;
  border-color: transparent;
  box-shadow: 0 4px 14px var(--accent-glow);
  font-weight: 600;
}

/* ── Sections ──────────────────────────────────────────────────── */
.sections-wrap { max-width: 720px; margin: 0 auto; padding: 0 16px; }
.cat-section { padding-top: 28px; }
.cat-header {
  display: flex; align-items: baseline;
  justify-content: space-between; margin-bottom: 14px;
}
.cat-title { font-size: 18px; font-weight: 700; color: var(--text); letter-spacing: -0.03em; }
.cat-count {
  font-size: 11px; color: var(--text-muted); font-weight: 500;
  background: var(--surface); padding: 3px 10px;
  border-radius: 20px; border: 1px solid var(--border);
}

/* ── Product cards ─────────────────────────────────────────────── */
.product-list { display: flex; flex-direction: column; gap: 10px; }

.prod-card {
  display: flex; align-items: stretch; gap: 14px;
  width: 100%; background: var(--surface);
  border: 1px solid var(--border); border-radius: var(--radius-md);
  padding: 13px; text-align: left;
  transition: box-shadow 0.22s, transform 0.22s, border-color 0.22s;
  box-shadow: var(--shadow-xs);
  animation: fadeInUp 0.4s cubic-bezier(0.16,1,0.3,1) both;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
.prod-card:hover {
  border-color: rgba(var(--accent-rgb), 0.35);
  box-shadow: var(--shadow-md), 0 0 0 3px var(--accent-soft);
  transform: translateY(-2px);
}
.prod-card:active { transform: translateY(0); box-shadow: var(--shadow-xs); }

.prod-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; }
.prod-top { display: flex; align-items: center; flex-wrap: wrap; gap: 7px; }
.prod-name { font-size: 14px; font-weight: 600; color: var(--text); line-height: 1.3; letter-spacing: -0.01em; }

.popular-badge {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 9.5px; font-weight: 700; padding: 3px 8px;
  border-radius: 20px;
  background: linear-gradient(135deg, var(--accent), rgba(var(--accent-rgb),0.75));
  color: #fff; letter-spacing: 0.02em;
  box-shadow: 0 2px 8px var(--accent-medium);
}

.prod-desc {
  font-size: 12px; color: var(--text-muted); line-height: 1.55; font-weight: 400;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}

.prod-meta-row { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; margin-top: 3px; }
.prod-price { font-weight: 700; font-size: 14px; color: var(--accent); letter-spacing: -0.02em; }
.variants-hint {
  font-size: 10px; font-weight: 500; color: var(--text-muted);
  background: var(--surface-2); padding: 2px 8px;
  border-radius: 10px; border: 1px solid var(--border);
}
.calorie-chip {
  font-size: 10px; font-weight: 500; color: var(--accent);
  background: var(--accent-soft); padding: 2px 8px; border-radius: 10px;
}

.allergen-mini-row { display: flex; align-items: center; gap: 3px; margin-top: 4px; }
.allergen-mini { font-size: 13px; line-height: 1; }
.allergen-more { font-size: 10px; color: var(--text-muted); font-weight: 600; margin-left: 2px; }

.prod-img-wrap {
  position: relative; width: 84px; height: 84px;
  flex-shrink: 0; border-radius: var(--radius-sm);
  overflow: hidden; background: var(--surface-2);
  border: 1px solid var(--border);
}
.prod-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.35s ease; }
.prod-card:hover .prod-img { transform: scale(1.07); }
.prod-img-placeholder {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  font-size: 24px;
  background: linear-gradient(135deg, var(--surface-2), var(--surface-3));
}
.prod-badge-img {
  position: absolute; bottom: 4px; right: 4px;
  background: rgba(var(--accent-rgb),0.88); color: #fff;
  font-size: 9px; font-weight: 700; padding: 2px 5px;
  border-radius: 7px;
}

/* ── Social footer ─────────────────────────────────────────────── */
.social-footer {
  margin: 28px 16px 0;
  padding: 24px 20px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  box-shadow: var(--shadow-xs);
}
.social-title {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
}
.social-links {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}
.social-btn {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-2);
  border: 1px solid var(--border);
  color: var(--s-color);
  text-decoration: none;
  transition: all 0.2s ease;
}
.social-btn:hover {
  background: var(--s-color);
  color: #fff;
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0,0,0,0.18);
}
.social-btn:active { transform: translateY(0); }
.social-icon { display: flex; align-items: center; justify-content: center; }
.social-icon :deep(svg) { width: 20px; height: 20px; }

/* ── Sheet ─────────────────────────────────────────────────────── */
.sheet-backdrop {
  position: fixed; inset: 0; z-index: 60;
  background: rgba(15,23,42,0.42);
  backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
  display: flex; align-items: flex-end;
}

.sheet {
  position: relative; width: 100%; max-width: 680px;
  margin: 0 auto; background: var(--surface);
  border-radius: 26px 26px 0 0;
  max-height: 92svh; display: flex; flex-direction: column;
  box-shadow: var(--shadow-lg);
  border-top: 1px solid var(--border);
}
.sheet-drag-handle {
  position: absolute; top: 10px; left: 50%; transform: translateX(-50%);
  width: 36px; height: 4px; border-radius: 2px;
  background: var(--surface-3); z-index: 2;
}
.sheet-close {
  position: absolute; top: 14px; right: 16px; z-index: 10;
  width: 30px; height: 30px; border-radius: 50%;
  background: var(--surface-2); border: 1px solid var(--border);
  color: var(--text-muted); display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
}
.sheet-close:hover { background: var(--surface-3); color: var(--text); }

.sheet-scroll { overflow-y: auto; flex: 1; scrollbar-width: none; }
.sheet-scroll::-webkit-scrollbar { display: none; }

.sheet-img-wrap {
  position: relative; width: 100%; height: 230px;
  border-radius: 26px 26px 0 0; overflow: hidden;
}
.sheet-img { width: 100%; height: 100%; object-fit: cover; }
.sheet-img-fade {
  position: absolute; bottom: 0; left: 0; right: 0; height: 80px;
  background: linear-gradient(to bottom, transparent, var(--surface));
}

.sheet-img-placeholder-wrap {
  width: 100%; height: 100px; border-radius: 26px 26px 0 0; overflow: hidden;
  background: linear-gradient(135deg, var(--surface-2), var(--surface-3));
  display: flex; align-items: center; justify-content: center;
}
.sheet-img-placeholder-inner { font-size: 48px; opacity: 0.35; }

.sheet-content { padding: 20px 20px 8px; display: flex; flex-direction: column; gap: 18px; }

.sheet-title-row { display: flex; align-items: flex-start; gap: 10px; padding-top: 2px; }
.sheet-name { flex: 1; font-size: 21px; font-weight: 700; color: var(--text); line-height: 1.2; letter-spacing: -0.03em; }

.sheet-desc { font-size: 13.5px; color: var(--text-muted); line-height: 1.7; font-weight: 400; margin-top: -6px; }

.calorie-banner {
  display: flex; align-items: center; gap: 12px;
  background: var(--accent-soft); border: 1px solid var(--accent-medium);
  border-radius: var(--radius-md); padding: 12px 16px;
}
.calorie-icon-wrap { color: var(--accent); opacity: 0.8; flex-shrink: 0; }
.calorie-main { display: flex; align-items: baseline; gap: 4px; color: var(--accent); flex: 1; }
.calorie-num { font-size: 22px; font-weight: 800; line-height: 1; letter-spacing: -0.03em; }
.calorie-unit { font-size: 12px; font-weight: 600; opacity: 0.75; }
.calorie-note { font-size: 11px; color: var(--text-muted); }

.section-block {}
.section-label {
  font-size: 10px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.1em; color: var(--text-muted); margin-bottom: 10px;
}

.allergen-grid { display: flex; flex-wrap: wrap; gap: 7px; }
.allergen-tag {
  display: flex; align-items: center; gap: 5px;
  padding: 5px 11px; background: var(--surface-2);
  border: 1px solid var(--border); border-radius: 20px;
}
.allergen-emoji { font-size: 13px; line-height: 1; }
.allergen-label { font-size: 11.5px; font-weight: 500; color: var(--text-2); }

.option-list { display: flex; flex-direction: column; gap: 7px; }
.option-item {
  display: flex; align-items: center; gap: 12px;
  padding: 11px 13px; border-radius: var(--radius-sm);
  border: 1.5px solid var(--border); cursor: pointer;
  transition: all 0.15s; background: var(--surface);
}
.option-item:hover { border-color: rgba(var(--accent-rgb),0.4); background: var(--accent-soft); }
.option-item.selected { border-color: var(--accent); background: var(--accent-soft); }

.option-radio {
  width: 19px; height: 19px; border-radius: 50%;
  border: 2px solid var(--border-strong);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  transition: border-color 0.15s;
}
.option-radio.active { border-color: var(--accent); }
.option-radio-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--accent); }

.option-check {
  width: 19px; height: 19px; border-radius: 5px;
  border: 2px solid var(--border-strong);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  transition: all 0.15s;
}
.option-check.active { background: var(--accent); border-color: var(--accent); }

.option-name { flex: 1; font-size: 13.5px; font-weight: 500; color: var(--text); }
.option-price { font-size: 13.5px; font-weight: 600; color: var(--accent); }

.sheet-footer {
  padding: 14px 16px max(env(safe-area-inset-bottom), 14px);
  background: var(--surface); border-top: 1px solid var(--border);
}
.total-row {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  background: var(--accent-soft); border: 1px solid var(--accent-medium);
  border-radius: var(--radius-md); padding: 14px 16px;
}
.total-label {
  font-size: 10px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.1em; color: var(--text-muted); margin-bottom: 2px;
}
.total-price { font-size: 21px; font-weight: 800; color: var(--accent); line-height: 1; letter-spacing: -0.03em; }

.confirm-btn {
  background: var(--accent); color: #fff;
  font-size: 14px; font-weight: 600;
  padding: 13px 26px; border-radius: var(--radius-md);
  letter-spacing: -0.01em;
  box-shadow: 0 4px 16px var(--accent-glow);
  transition: all 0.2s ease; white-space: nowrap;
}
.confirm-btn:hover { opacity: 0.92; transform: translateY(-1px); box-shadow: 0 8px 24px var(--accent-glow); }
.confirm-btn:active { transform: translateY(0); opacity: 1; }

/* ── Sheet transition ──────────────────────────────────────────── */
.sheet-enter-active { transition: opacity 0.28s ease; }
.sheet-leave-active { transition: opacity 0.22s ease; }
.sheet-enter-from, .sheet-leave-to { opacity: 0; }
.sheet-enter-active .sheet, .sheet-leave-active .sheet {
  transition: transform 0.32s cubic-bezier(0.32, 0.72, 0, 1);
}
.sheet-enter-from .sheet, .sheet-leave-to .sheet { transform: translateY(100%); }
</style>
