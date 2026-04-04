<template>
  <div class="menu-root" :class="{ 'rtl-layout': currentLang === 'AR' }">

    <!-- ── Loading ─────────────────────────────────────────── -->
    <div v-if="loading" class="state-screen">
      <div class="loader-orb">
        <svg viewBox="0 0 50 50" class="spinner"><circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-dasharray="90 60" /></svg>
      </div>
      <p class="state-label">Menü yükleniyor…</p>
    </div>

    <!-- ── 404 ──────────────────────────────────────────────── -->
    <div v-else-if="!data" class="state-screen">
      <div class="notfound-code">404</div>
      <h1 class="notfound-title">Menü Bulunamadı</h1>
      <p class="state-label">Bu adrese ait aktif bir menü yok.</p>
    </div>

    <!-- ── Main ─────────────────────────────────────────────── -->
    <div v-else class="menu-main">

      <!-- Hero -->
      <div class="hero">
        <img v-if="data.business.coverUrl" :src="data.business.coverUrl" class="hero-img" alt="" />
        <div v-else class="hero-fallback" />
        <div class="hero-gradient" />

        <!-- Table badge -->
        <div v-if="tableNumber" class="table-badge">
          <span class="table-icon">⊞</span>Masa {{ tableNumber }}
        </div>

        <!-- Language switcher -->
        <div class="lang-switcher">
          <button v-for="l in langs" :key="l.code" @click="switchLang(l.code)"
            :class="['lang-btn', { active: currentLang === l.code }]">
            {{ l.flag }}
          </button>
        </div>

        <!-- Business info overlay -->
        <div class="hero-footer">
          <div class="biz-logo-wrap">
            <img v-if="data.business.logoUrl" :src="data.business.logoUrl" class="biz-logo" alt="" />
            <span v-else class="biz-logo-letter">{{ data.business.name[0] }}</span>
          </div>
          <div class="biz-info">
            <h1 class="biz-name">{{ data.business.name }}</h1>
            <p v-if="data.business.phone" class="biz-phone">{{ data.business.phone }}</p>
          </div>
        </div>
      </div>

      <!-- Category nav -->
      <nav class="cat-nav" ref="navRef">
        <div class="cat-nav-inner">
          <button v-for="cat in activeCategories" :key="cat.id"
            @click="scrollTo(cat.id)"
            :class="['cat-btn', { active: activeCat === cat.id }]">
            {{ cat.name }}
          </button>
        </div>
      </nav>

      <!-- Product sections -->
      <div class="sections-wrap">
        <section v-for="cat in activeCategories" :key="cat.id" :id="`cat-${cat.id}`" class="cat-section">
          <div class="cat-header">
            <h2 class="cat-title">{{ cat.name }}</h2>
            <span class="cat-count">{{ cat.products.length }} ürün</span>
          </div>

          <div class="product-list">
            <button v-for="prod in cat.products" :key="prod.id"
              @click="openProduct(prod)" class="prod-card">
              <!-- Text side -->
              <div class="prod-body">
                <div class="prod-top">
                  <span class="prod-name">{{ prod.name }}</span>
                  <span v-if="prod.isPopular" class="popular-badge">Popular</span>
                </div>
                <p v-if="prod.description" class="prod-desc">{{ prod.description }}</p>

                <!-- Price + calorie row -->
                <div class="prod-meta-row">
                  <span class="prod-price">{{ fmt(prod.basePrice) }}</span>
                  <span v-if="prod.variants?.length" class="variants-hint">+seçenek</span>
                  <span v-if="prod.calories" class="calorie-chip">
                    <svg viewBox="0 0 16 16" width="11" height="11" fill="currentColor"><path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 12.5a5.5 5.5 0 110-11 5.5 5.5 0 010 11zm.75-8.25a.75.75 0 10-1.5 0v3.5l2.25 2.25a.75.75 0 001.06-1.06L8.75 8.19V5.25z"/></svg>
                    {{ prod.calories }} kcal
                  </span>
                </div>

                <!-- Allergen mini-row -->
                <div v-if="prod.allergens?.length" class="allergen-mini-row">
                  <span v-for="a in prod.allergens.slice(0, 5)" :key="a" class="allergen-mini" :title="getAllergenLabel(a)">{{ getAllergenEmoji(a) }}</span>
                  <span v-if="prod.allergens.length > 5" class="allergen-more">+{{ prod.allergens.length - 5 }}</span>
                </div>
              </div>

              <!-- Image side -->
              <div class="prod-img-wrap">
                <img v-if="prod.imageUrl" :src="prod.imageUrl" class="prod-img" :alt="prod.name" />
                <div v-else class="prod-img-placeholder">🍽️</div>
                <div v-if="prod.variants?.length" class="prod-badge-img">{{ prod.variants.length }}</div>
              </div>
            </button>
          </div>
        </section>
      </div>

      <!-- Bottom spacer -->
      <div style="height: 40px" />
    </div>

    <!-- ── Product detail sheet ──────────────────────────────── -->
    <Transition name="sheet">
      <div v-if="selProd" class="sheet-backdrop" @click.self="closeSheet">
        <div class="sheet">
          <!-- Drag handle -->
          <div class="sheet-drag-handle" />

          <!-- Close -->
          <button class="sheet-close" @click="closeSheet">✕</button>

          <!-- Scrollable content -->
          <div class="sheet-scroll">
            <!-- Product image -->
            <div v-if="selProd.imageUrl" class="sheet-img-wrap">
              <img :src="selProd.imageUrl" class="sheet-img" :alt="selProd.name" />
              <div class="sheet-img-gradient" />
            </div>

            <div class="sheet-content">
              <!-- Name + popularity -->
              <div class="sheet-title-row">
                <h3 class="sheet-name">{{ selProd.name }}</h3>
                <span v-if="selProd.isPopular" class="popular-badge">Popular</span>
              </div>

              <!-- Calorie + macros row -->
              <div v-if="selProd.calories" class="calorie-banner">
                <div class="calorie-main">
                  <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor"><path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd"/></svg>
                  <span class="calorie-num">{{ selProd.calories }}</span>
                  <span class="calorie-unit">kcal</span>
                </div>
                <span class="calorie-note">100g başına tahmini değer</span>
              </div>

              <!-- Description -->
              <p v-if="selProd.description" class="sheet-desc">{{ selProd.description }}</p>

              <!-- Allergens grid -->
              <div v-if="selProd.allergens?.length" class="allergen-section">
                <h4 class="section-label">Alerjenler</h4>
                <div class="allergen-grid">
                  <div v-for="a in selProd.allergens" :key="a" class="allergen-tag">
                    <span class="allergen-emoji">{{ getAllergenEmoji(a) }}</span>
                    <span class="allergen-label">{{ getAllergenLabel(a) }}</span>
                  </div>
                </div>
              </div>

              <!-- Variants -->
              <div v-if="selProd.variants?.length" class="option-section">
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

              <!-- Extras -->
              <div v-if="selProd.extras?.length" class="option-section">
                <h4 class="section-label">Ekstralar</h4>
                <div class="option-list">
                  <label v-for="e in selProd.extras" :key="e.id"
                    class="option-item" :class="{ selected: selExtras.includes(e.id) }"
                    @click="toggleExtra(e.id)">
                    <div class="option-check" :class="{ active: selExtras.includes(e.id) }">
                      <span v-if="selExtras.includes(e.id)" class="check-mark">✓</span>
                    </div>
                    <span class="option-name">{{ e.name }}</span>
                    <span class="option-price">+{{ fmt(e.price) }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="sheet-footer">
            <div class="total-row">
              <div>
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
import { useRoute } from 'vue-router'
import { publicApi } from '@/api'

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

const route    = useRoute()
const data     = ref<any>(null)
const loading  = ref(true)
const currentLang = ref('TR')
const selProd  = ref<any>(null)
const selVariant = ref<any>(null)
const selExtras  = ref<string[]>([])
const activeCat  = ref('')
const navRef   = ref<HTMLElement | null>(null)
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

const activeCategories = computed(() =>
  (data.value?.menu?.categories || []).filter((c: any) => c.products?.length > 0)
)

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

onMounted(() => {
  loadMenu()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))

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
    // Apply theme color
    const color = res?.menu?.themeColor
    if (color) {
      document.documentElement.style.setProperty('--accent', color)
      const r = parseInt(color.slice(1, 3), 16)
      const g = parseInt(color.slice(3, 5), 16)
      const b = parseInt(color.slice(5, 7), 16)
      document.documentElement.style.setProperty('--accent-warm', `rgba(${r},${g},${b},0.10)`)
      document.documentElement.style.setProperty('--accent-glow', `rgba(${r},${g},${b},0.20)`)
    }
  } catch { data.value = null }
  finally { loading.value = false }
}

async function switchLang(lang: string) {
  currentLang.value = lang
  await loadMenu()
}

function openProduct(prod: any) {
  selProd.value  = prod
  selVariant.value = prod.variants?.find((v: any) => v.isDefault) || prod.variants?.[0] || null
  selExtras.value  = []
  document.body.style.overflow = 'hidden'
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
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');

/* ── Theme tokens ─────────────────────────────────────────────── */
:root, .menu-root {
  --bg:          #F5F5F5;
  --surface:     #FFFFFF;
  --surface-2:   #F0F0F0;
  --border:      #E8E8E8;
  --text:        #1A1A1A;
  --text-muted:  #888888;
  --accent:      #F07820;
  --accent-warm: rgba(240,120,32,0.10);
  --accent-glow: rgba(240,120,32,0.20);
  --nav-bg:      rgba(255,255,255,0.95);
  --sheet-bg:    #FFFFFF;
  --shadow-sm:   0 1px 6px rgba(0,0,0,0.06);
  --shadow-md:   0 4px 20px rgba(0,0,0,0.08);
  --shadow-lg:   0 12px 40px rgba(0,0,0,0.14);
  --radius-sm:   12px;
  --radius-md:   16px;
  --radius-lg:   24px;
  --font-display: 'Nunito', system-ui, sans-serif;
  --font-body:    'Nunito', system-ui, sans-serif;
}

@media (prefers-color-scheme: dark) {
  :root, .menu-root {
    --bg:          #111111;
    --surface:     #1C1C1C;
    --surface-2:   #252525;
    --border:      #333333;
    --text:        #F0F0F0;
    --text-muted:  #888888;
    --accent:      #F07820;
    --accent-warm: rgba(240,120,32,0.14);
    --accent-glow: rgba(240,120,32,0.26);
    --nav-bg:      rgba(17,17,17,0.95);
    --sheet-bg:    #1C1C1C;
    --shadow-sm:   0 1px 6px rgba(0,0,0,0.30);
    --shadow-md:   0 4px 20px rgba(0,0,0,0.45);
    --shadow-lg:   0 12px 40px rgba(0,0,0,0.60);
  }
}

/* ── Reset & base ─────────────────────────────────────────────── */
.menu-root {
  min-height: 100svh;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  font-size: 14px;
  line-height: 1.5;
}
.rtl-layout { direction: rtl; }
* { box-sizing: border-box; margin: 0; padding: 0; }
button { cursor: pointer; border: none; background: none; font: inherit; }
img { display: block; }

/* ── State screens ────────────────────────────────────────────── */
.state-screen {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: var(--bg);
}
.loader-orb {
  width: 52px;
  height: 52px;
  background: var(--accent-warm);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
}
.spinner {
  animation: spin 1.2s linear infinite;
  width: 28px; height: 28px;
}
@keyframes spin { to { transform: rotate(360deg); } }
.state-label { color: var(--text-muted); font-size: 13px; }
.notfound-code {
  font-size: 72px;
  font-weight: 800;
  color: var(--accent);
  line-height: 1;
}
.notfound-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--text);
}

/* ── Hero ─────────────────────────────────────────────────────── */
.hero {
  position: relative;
  height: 260px;
  overflow: hidden;
  background: var(--surface-2);
}
.hero-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.04);
  transition: transform 8s ease-out;
}
.hero:hover .hero-img { transform: scale(1); }
.hero-fallback {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #2C1A08 0%, #5A3214 50%, #1A0F04 100%);
}
.hero-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0,0,0,0.08) 0%,
    rgba(0,0,0,0.18) 50%,
    rgba(0,0,0,0.72) 100%
  );
}

/* Table badge */
.table-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  background: rgba(255,255,255,0.18);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.28);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  letter-spacing: 0.02em;
}
.table-icon { font-size: 13px; }

/* Lang switcher */
.lang-switcher {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 6px;
}
.lang-btn {
  height: 32px;
  min-width: 40px;
  padding: 0 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.22);
  color: rgba(255,255,255,0.8);
  transition: all 0.18s;
}
.lang-btn.active {
  background: rgba(255,255,255,0.95);
  color: #1C1916;
  border-color: transparent;
}

/* Business footer inside hero */
.hero-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 20px 18px;
  display: flex;
  align-items: flex-end;
  gap: 14px;
}
.biz-logo-wrap {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  overflow: hidden;
  border: 2.5px solid rgba(255,255,255,0.5);
  flex-shrink: 0;
  background: var(--surface-2);
  box-shadow: 0 4px 16px rgba(0,0,0,0.3);
}
.biz-logo { width: 100%; height: 100%; object-fit: cover; }
.biz-logo-letter {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(135deg, #F07820, #C4550A);
}
.biz-info { padding-bottom: 2px; }
.biz-name {
  font-size: 20px;
  font-weight: 800;
  color: #fff;
  line-height: 1.2;
  text-shadow: 0 1px 8px rgba(0,0,0,0.5);
}
.biz-phone {
  font-size: 12px;
  color: rgba(255,255,255,0.72);
  margin-top: 2px;
}

/* ── Category nav ─────────────────────────────────────────────── */
.cat-nav {
  position: sticky;
  top: 0;
  z-index: 30;
  background: var(--nav-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
}
.cat-nav-inner {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding: 10px 16px;
  scrollbar-width: none;
}
.cat-nav-inner::-webkit-scrollbar { display: none; }
.cat-btn {
  flex-shrink: 0;
  padding: 7px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-muted);
  background: transparent;
  border: 1.5px solid transparent;
  transition: all 0.18s ease;
  white-space: nowrap;
}
.cat-btn:hover {
  color: var(--text);
  background: var(--surface-2);
  border-color: var(--border);
}
.cat-btn.active {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
  box-shadow: 0 2px 12px var(--accent-glow);
}

/* ── Sections ─────────────────────────────────────────────────── */
.sections-wrap {
  max-width: 680px;
  margin: 0 auto;
  padding: 0 16px;
}
.cat-section { padding-top: 28px; }
.cat-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border);
}
.cat-title {
  font-size: 20px;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.01em;
}
.cat-count {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 500;
}

/* ── Product cards ────────────────────────────────────────────── */
.product-list { display: flex; flex-direction: column; gap: 10px; }
.prod-card {
  display: flex;
  align-items: stretch;
  gap: 14px;
  width: 100%;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 14px;
  text-align: left;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
}
.prod-card:hover {
  border-color: var(--accent);
  box-shadow: 0 4px 20px var(--accent-glow);
  transform: translateY(-1px);
}
.prod-card:active { transform: translateY(0); }

.prod-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.prod-top {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
.prod-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
  line-height: 1.3;
}
.popular-badge {
  font-size: 10px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 20px;
  background: linear-gradient(135deg, #F59E0B, #D97706);
  color: #fff;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.prod-desc {
  font-size: 12.5px;
  color: var(--text-muted);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.prod-meta-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 2px;
}
.prod-price {
  font-weight: 600;
  font-size: 15px;
  color: var(--accent);
}
.variants-hint {
  font-size: 11px;
  color: var(--text-muted);
  background: var(--surface-2);
  padding: 2px 8px;
  border-radius: 10px;
}
.calorie-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 500;
  color: var(--accent);
  background: var(--accent-warm);
  padding: 3px 8px;
  border-radius: 10px;
}

.allergen-mini-row {
  display: flex;
  align-items: center;
  gap: 3px;
  margin-top: 4px;
}
.allergen-mini {
  font-size: 14px;
  line-height: 1;
  filter: grayscale(0.1);
}
.allergen-more {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 600;
  margin-left: 2px;
}

/* Product image */
.prod-img-wrap {
  position: relative;
  width: 88px;
  height: 88px;
  flex-shrink: 0;
  border-radius: 12px;
  overflow: hidden;
  background: var(--surface-2);
}
.prod-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}
.prod-card:hover .prod-img { transform: scale(1.06); }
.prod-img-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
}
.prod-badge-img {
  position: absolute;
  bottom: 6px;
  right: 6px;
  background: rgba(0,0,0,0.6);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 8px;
  backdrop-filter: blur(4px);
}

/* ── Sheet backdrop ───────────────────────────────────────────── */
.sheet-backdrop {
  position: fixed;
  inset: 0;
  z-index: 60;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  display: flex;
  align-items: flex-end;
}

/* ── Bottom sheet ─────────────────────────────────────────────── */
.sheet {
  position: relative;
  width: 100%;
  max-width: 680px;
  margin: 0 auto;
  background: var(--sheet-bg);
  border-radius: 24px 24px 0 0;
  max-height: 90svh;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-lg);
}
.sheet-drag-handle {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background: var(--border);
  z-index: 2;
}
.sheet-close {
  position: absolute;
  top: 14px;
  right: 16px;
  z-index: 10;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--surface-2);
  border: 1px solid var(--border);
  color: var(--text-muted);
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.sheet-close:hover { background: var(--border); color: var(--text); }

.sheet-scroll {
  overflow-y: auto;
  flex: 1;
  scrollbar-width: none;
}
.sheet-scroll::-webkit-scrollbar { display: none; }

/* Sheet product image */
.sheet-img-wrap {
  position: relative;
  width: 100%;
  height: 220px;
  border-radius: 24px 24px 0 0;
  overflow: hidden;
}
.sheet-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.sheet-img-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(to bottom, transparent, var(--sheet-bg));
}

.sheet-content {
  padding: 20px 20px 4px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.sheet-title-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding-top: 4px;
}
.sheet-name {
  flex: 1;
  font-size: 22px;
  font-weight: 800;
  color: var(--text);
  line-height: 1.2;
  letter-spacing: -0.01em;
}

/* Calorie banner */
.calorie-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--accent-warm);
  border: 1px solid var(--accent-glow);
  border-radius: var(--radius-sm);
  padding: 12px 16px;
}
.calorie-main {
  display: flex;
  align-items: baseline;
  gap: 5px;
  color: var(--accent);
}
.calorie-num {
  font-size: 26px;
  font-weight: 800;
  line-height: 1;
}
.calorie-unit {
  font-size: 13px;
  font-weight: 600;
  opacity: 0.8;
}
.calorie-note {
  font-size: 11px;
  color: var(--text-muted);
}

.sheet-desc {
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.7;
}

/* Section headers inside sheet */
.section-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  margin-bottom: 10px;
}

/* Allergen grid */
.allergen-section {}
.allergen-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.allergen-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 20px;
}
.allergen-emoji { font-size: 15px; }
.allergen-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--text);
}

/* Option lists (variants / extras) */
.option-section {}
.option-list { display: flex; flex-direction: column; gap: 8px; }
.option-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 14px;
  border-radius: var(--radius-sm);
  border: 1.5px solid var(--border);
  cursor: pointer;
  transition: all 0.15s;
  background: var(--surface);
}
.option-item:hover { border-color: var(--accent); }
.option-item.selected {
  border-color: var(--accent);
  background: var(--accent-warm);
}

.option-radio {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: border-color 0.15s;
}
.option-radio.active { border-color: var(--accent); }
.option-radio-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--accent);
}

.option-check {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 2px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s;
}
.option-check.active {
  background: var(--accent);
  border-color: var(--accent);
}
.check-mark {
  color: #fff;
  font-size: 11px;
  font-weight: 700;
}

.option-name {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
}
.option-price {
  font-size: 14px;
  font-weight: 600;
  color: var(--accent);
}

/* ── Sheet footer ─────────────────────────────────────────────── */
.sheet-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--border);
  background: var(--sheet-bg);
  border-radius: 0 0 0 0;
}
.total-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--surface-2);
  border-radius: var(--radius-md);
  padding: 14px 16px;
}
.total-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  margin-bottom: 2px;
}
.total-price {
  font-size: 24px;
  font-weight: 800;
  color: var(--accent);
  line-height: 1;
}
.confirm-btn {
  background: var(--accent);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  padding: 13px 28px;
  border-radius: var(--radius-sm);
  letter-spacing: 0.02em;
  box-shadow: 0 4px 16px var(--accent-glow);
  transition: all 0.18s;
}
.confirm-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px var(--accent-glow);
}
.confirm-btn:active { transform: translateY(0); opacity: 1; }

/* ── Sheet transition ─────────────────────────────────────────── */
.sheet-enter-active {
  transition: opacity 0.25s ease;
}
.sheet-leave-active {
  transition: opacity 0.2s ease;
}
.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}
.sheet-enter-active .sheet,
.sheet-leave-active .sheet {
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}
.sheet-enter-from .sheet,
.sheet-leave-to .sheet {
  transform: translateY(100%);
}
</style>
