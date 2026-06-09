<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { type SupportedLocale, SUPPORTED_LOCALES, RTL_LOCALES, saveLocale } from '../../i18n'

const router = useRouter()
const { t, locale, tm } = useI18n()

const scrolled = ref(false)
const mobileOpen = ref(false)
const langMenuOpen = ref(false)

const isRtl = computed(() => RTL_LOCALES.includes(locale.value as SupportedLocale))

const LANG_LABELS: Record<SupportedLocale, string> = { tr: 'TR', en: 'EN', ar: 'AR' }
const LANG_NAMES: Record<SupportedLocale, string> = { tr: 'Türkçe', en: 'English', ar: 'العربية' }

function setLocale(lang: SupportedLocale) {
  locale.value = lang
  saveLocale(lang)
  langMenuOpen.value = false
}

watch(isRtl, (rtl) => {
  document.documentElement.setAttribute('dir', rtl ? 'rtl' : 'ltr')
  document.documentElement.setAttribute('lang', locale.value)
}, { immediate: true })

const handleScroll = () => { scrolled.value = window.scrollY > 40 }

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  document.addEventListener('click', (e) => {
    if (!(e.target as Element)?.closest('.lang-switcher')) langMenuOpen.value = false
  })
  const io = new IntersectionObserver(
    (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in') }),
    { threshold: 0.07 }
  )
  document.querySelectorAll('.reveal').forEach(el => io.observe(el))
})
onUnmounted(() => window.removeEventListener('scroll', handleScroll))

const goRegister = () => router.push('/register')
const goLogin    = () => router.push('/login')

const faqOpen = ref<boolean[]>([false, false, false, false, false, false, false])
const toggleFaq = (i: number) => { faqOpen.value[i] = !faqOpen.value[i] }
const faqItems = computed(() => tm('faq.items') as Array<{ q: string; a: string }>)

</script>

<template>
  <div class="land" :dir="isRtl ? 'rtl' : 'ltr'">

    <!-- ══ NAV ══════════════════════════════════════════════════════ -->
    <div class="nav-wrap">
      <header :class="['nav', { scrolled }]">
        <div class="nav-inner">

          <!-- Logo -->
          <a href="#" class="brand">
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
          </a>

          <!-- Center links -->
          <nav class="nav-links">
            <div class="nav-link-wrap">
              <a href="#features" class="nav-link">
                {{ t('nav.features') }}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </a>
            </div>
            <a href="#how" class="nav-link">{{ t('nav.howItWorks') }}</a>
            <a href="#pricing" class="nav-link">{{ t('nav.pricing') }}</a>
            <a href="#faq" class="nav-link">{{ t('nav.faq') }}</a>
          </nav>

          <!-- Right actions -->
          <div class="nav-actions">
            <!-- Lang switcher as icon -->
            <div class="lang-switcher">
              <button class="nav-icon-btn" @click.stop="langMenuOpen = !langMenuOpen" :title="LANG_NAMES[locale as SupportedLocale]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              </button>
              <transition name="fade-down">
                <div v-if="langMenuOpen" class="lang-menu">
                  <button
                    v-for="lang in SUPPORTED_LOCALES"
                    :key="lang"
                    :class="['lang-opt', { active: locale === lang }]"
                    @click="setLocale(lang)"
                  >
                    <span>{{ LANG_LABELS[lang] }}</span>
                    <span class="lang-name">{{ LANG_NAMES[lang] }}</span>
                  </button>
                </div>
              </transition>
            </div>

            <button class="nav-login" @click="goLogin">{{ t('nav.login') }}</button>
            <button class="nav-cta" @click="goRegister">{{ t('nav.getStarted') }}</button>
          </div>

          <button class="hamburger" :class="{ open: mobileOpen }" @click="mobileOpen = !mobileOpen">
            <span /><span /><span />
          </button>
        </div>
      </header>

      <!-- Mobile drawer — sits outside the floating nav card -->
      <div :class="['mobile-drawer', { open: mobileOpen }]">
        <a href="#features" @click="mobileOpen=false">{{ t('nav.features') }}</a>
        <a href="#how" @click="mobileOpen=false">{{ t('nav.howItWorks') }}</a>
        <a href="#pricing" @click="mobileOpen=false">{{ t('nav.pricing') }}</a>
        <a href="#faq" @click="mobileOpen=false">{{ t('nav.faq') }}</a>
        <div class="mob-lang">
          <button v-for="lang in SUPPORTED_LOCALES" :key="lang"
            :class="['ml-btn', { active: locale === lang }]"
            @click="setLocale(lang)">
            {{ LANG_LABELS[lang] }}
          </button>
        </div>
        <div class="mob-foot">
          <button class="nav-login w-full" @click="goLogin">{{ t('nav.login') }}</button>
          <button class="nav-cta w-full" @click="goRegister">{{ t('nav.getStarted') }}</button>
        </div>
      </div>
    </div>

    <!-- ══ HERO ══════════════════════════════════════════════════════ -->
    <section class="hero">
      <div class="hero-glow"></div>
      <div class="container hero-inner">

        <div class="hero-text">
          <div class="eyebrow reveal">
            <span class="pulse"></span>
            {{ t('hero.badge') }}
          </div>

          <h1 class="hero-h1 reveal">
            {{ t('hero.h1Line1') }}<br/>
            <!-- {{ t('hero.h1Line2') }}<br/> -->
            <em>{{ t('hero.h1Line3') }}</em>
          </h1>

          <p class="hero-sub reveal">{{ t('hero.sub') }}</p>

          <div class="hero-btns reveal">
            <button class="btn-hero-primary" @click="goRegister">
              {{ t('hero.ctaMain') }}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <a href="#features" class="btn-hero-ghost">{{ t('hero.ctaDemo') }}</a>
          </div>

          <div class="hero-stats reveal">
            <div class="stat">
              <strong>{{ t('hero.stat1Value') }}</strong>
              <span>{{ t('hero.stat1Label') }}</span>
            </div>
            <div class="stat-div"></div>
            <div class="stat">
              <strong>{{ t('hero.stat2Value') }}</strong>
              <span>{{ t('hero.stat2Label') }}</span>
            </div>
            <div class="stat-div"></div>
            <div class="stat">
              <strong>{{ t('hero.stat3Value') }}</strong>
              <span>{{ t('hero.stat3Label') }}</span>
            </div>
          </div>
        </div>

        <!-- Phone Mockup -->
        <div class="hero-phone reveal">
          <div class="phone-halo"></div>
          <div class="phone">
            <div class="phone-island"></div>
            <div class="phone-screen">
              <div class="ps-ai-header">
                <div class="ps-ai-logo">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L9.91 8.26 3.5 9.27l4.5 4.39-1.06 6.34L12 17l5.06 3-1.06-6.34 4.5-4.39-6.41-1.01L12 2z"/></svg>
                </div>
                <div class="ps-ai-meta">
                  <div class="ps-ai-title">{{ t('hero.phoneAiTitle') }}</div>
                  <div class="ps-ai-sub">{{ t('hero.phoneAiSub') }}</div>
                </div>
                <div class="ps-ai-pulse"></div>
              </div>
              <div class="ps-ai-stats">
                <div class="ps-ai-stat">
                  <div class="ps-ai-stat-label">{{ t('hero.phoneStatLabel1') }}</div>
                  <div class="ps-ai-stat-val">847</div>
                  <div class="ps-ai-stat-delta">↑ 12%</div>
                </div>
                <div class="ps-ai-stat">
                  <div class="ps-ai-stat-label">{{ t('hero.phoneStatLabel2') }}</div>
                  <div class="ps-ai-stat-val">3:42</div>
                  <div class="ps-ai-stat-delta">↑ 8%</div>
                </div>
              </div>
              <div class="ps-ai-insights">
                <div class="ps-ai-card important">
                  <span class="ps-ai-dot"></span>
                  <div class="ps-ai-card-body-wrap">
                    <div class="ps-ai-card-title">{{ t('hero.phoneAiInsight1Title') }}</div>
                    <div class="ps-ai-card-body">{{ t('hero.phoneAiInsight1Body') }}</div>
                  </div>
                </div>
                <div class="ps-ai-card suggestion">
                  <span class="ps-ai-dot"></span>
                  <div class="ps-ai-card-body-wrap">
                    <div class="ps-ai-card-title">{{ t('hero.phoneAiInsight2Title') }}</div>
                    <div class="ps-ai-card-body">{{ t('hero.phoneAiInsight2Body') }}</div>
                  </div>
                </div>
                <div class="ps-ai-card info">
                  <span class="ps-ai-dot"></span>
                  <div class="ps-ai-card-body-wrap">
                    <div class="ps-ai-card-title">{{ t('hero.phoneAiInsight3Title') }}</div>
                    <div class="ps-ai-card-body">{{ t('hero.phoneAiInsight3Body') }}</div>
                  </div>
                </div>
              </div>
              <div class="ps-ai-chart">
                <div class="ps-ai-chart-label">{{ t('hero.phoneChartLabel') }}</div>
                <div class="ps-ai-chart-bars">
                  <div class="ps-ai-chart-bar" style="height:32%"></div>
                  <div class="ps-ai-chart-bar" style="height:54%"></div>
                  <div class="ps-ai-chart-bar" style="height:42%"></div>
                  <div class="ps-ai-chart-bar" style="height:76%"></div>
                  <div class="ps-ai-chart-bar" style="height:58%"></div>
                  <div class="ps-ai-chart-bar peak" style="height:94%"></div>
                  <div class="ps-ai-chart-bar" style="height:48%"></div>
                </div>
              </div>
              <div class="ps-ai-cta">
                {{ t('hero.phoneAiCta') }}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </div>
            <div class="phone-bar"></div>
          </div>
          <!-- Floating chips -->
          <div class="chip chip-top">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            {{ t('hero.phoneLive') }}
          </div>
          <div class="chip chip-bot">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3b5bdb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            {{ t('hero.phoneScans') }}
          </div>
        </div>
      </div>
    </section>

    <!-- ══ MARQUEE ═══════════════════════════════════════════════════ -->
    <div class="marquee-wrap reveal">
      <div class="marquee-track">
        <span>Bella Roma</span><span class="dot">·</span>
        <span>Sakura House</span><span class="dot">·</span>
        <span>Burger District</span><span class="dot">·</span>
        <span>The Brew Co.</span><span class="dot">·</span>
        <span>Steakwood</span><span class="dot">·</span>
        <span>Taco Verde</span><span class="dot">·</span>
        <span>Green Table</span><span class="dot">·</span>
        <span>Noodle Lab</span><span class="dot">·</span>
        <span>Patisserie Blanc</span><span class="dot">·</span>
        <span>Harbor Grill</span><span class="dot">·</span>
        <!-- duplicate -->
        <span>Bella Roma</span><span class="dot">·</span>
        <span>Sakura House</span><span class="dot">·</span>
        <span>Burger District</span><span class="dot">·</span>
        <span>The Brew Co.</span><span class="dot">·</span>
        <span>Steakwood</span><span class="dot">·</span>
        <span>Taco Verde</span><span class="dot">·</span>
        <span>Green Table</span><span class="dot">·</span>
        <span>Noodle Lab</span><span class="dot">·</span>
        <span>Patisserie Blanc</span><span class="dot">·</span>
        <span>Harbor Grill</span><span class="dot">·</span>
      </div>
    </div>

    <!-- ══ AI MENU ADVISOR ═══════════════════════════════════════════ -->
    <section class="section ai-section">
      <div class="container">
        <div class="ai-layout">
          <div class="ai-insights reveal">
            <div class="insight-card important">
              <div class="insight-dot"></div>
              <div class="insight-body-wrap">
                <span class="insight-severity sev-important">{{ t('ai.severityImportant') }}</span>
                <div class="insight-title">{{ t('ai.insight1Title') }}</div>
                <div class="insight-body">{{ t('ai.insight1Body') }}</div>
              </div>
            </div>
            <div class="insight-card suggestion">
              <div class="insight-dot"></div>
              <div class="insight-body-wrap">
                <span class="insight-severity sev-suggestion">{{ t('ai.severitySuggestion') }}</span>
                <div class="insight-title">{{ t('ai.insight2Title') }}</div>
                <div class="insight-body">{{ t('ai.insight2Body') }}</div>
              </div>
            </div>
            <div class="insight-card info">
              <div class="insight-dot"></div>
              <div class="insight-body-wrap">
                <span class="insight-severity sev-info">{{ t('ai.severityInfo') }}</span>
                <div class="insight-title">{{ t('ai.insight3Title') }}</div>
                <div class="insight-body">{{ t('ai.insight3Body') }}</div>
              </div>
            </div>
          </div>

          <div class="ai-text reveal">
            <div class="tag">{{ t('ai.tag') }}</div>
            <h2 class="sec-title" style="white-space:pre-line">{{ t('ai.title') }}</h2>
            <p class="sec-sub">{{ t('ai.sub') }}</p>
            <ul class="check-list">
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b5bdb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                {{ t('ai.point1') }}
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b5bdb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                {{ t('ai.point2') }}
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b5bdb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                {{ t('ai.point3') }}
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b5bdb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                {{ t('ai.point4') }}
              </li>
            </ul>
            <button class="btn-outline" @click="goRegister">{{ t('ai.cta') }} →</button>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ FEATURES ══════════════════════════════════════════════════ -->
    <section id="features" class="section">
      <div class="container">
        <div class="sec-header reveal">
          <div class="tag">{{ t('features.tag') }}</div>
          <h2 class="sec-title" style="white-space:pre-line">{{ t('features.title') }}</h2>
          <p class="sec-sub">{{ t('features.sub') }}</p>
        </div>

        <div class="feat-grid">
          <!-- Card 1: AI Menu Advisor -->
          <div class="feat-card reveal">
            <div class="feat-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 5.7L19 10.5l-5.1 1.8L12 18l-1.9-5.7L5 10.5l5.1-1.8z"/><path d="M5 3v4M3 5h4M19 17v4M17 19h4"/></svg>
            </div>
            <h3>{{ t('features.feat6Title') }}</h3>
            <p>{{ t('features.feat6Desc') }}</p>
            <div class="feat-ai-demo">
              <div class="ai-demo-badge">{{ t('features.aiDemoBadge') }}</div>
              <div class="ai-demo-text">{{ t('features.aiDemoText') }}</div>
            </div>
          </div>

          <!-- Card: Update menus -->
          <div class="feat-card reveal">
            <div class="feat-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </div>
            <h3>{{ t('features.feat1Title') }}</h3>
            <p>{{ t('features.feat1Desc') }}</p>
            <div class="feat-ui">
              <div class="fui-row">
                <span class="fui-item">{{ t('features.demoDish1') }}</span>
                <span class="fui-price">{{ t('features.demoPrice1') }}</span>
                <span class="fui-tag live">{{ t('features.demoLive') }}</span>
              </div>
              <div class="fui-row">
                <span class="fui-item">{{ t('features.demoDish2') }}</span>
                <span class="fui-price">{{ t('features.demoPrice2') }}</span>
                <span class="fui-tag updating">{{ t('features.demoSaving') }}</span>
              </div>
              <div class="fui-row">
                <span class="fui-item">{{ t('features.demoDish3') }}</span>
                <span class="fui-price">{{ t('features.demoPrice3') }}</span>
                <span class="fui-tag out">{{ t('features.demoSoldOut') }}</span>
              </div>
            </div>
          </div>

          <!-- Card 2: Multilingual -->
          <div class="feat-card reveal">
            <div class="feat-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            </div>
            <h3>{{ t('features.feat2Title') }}</h3>
            <p>{{ t('features.feat2Desc') }}</p>
            <div class="feat-langs">
              <span class="lang-pill active">English</span>
              <span class="lang-pill">Türkçe</span>
              <span class="lang-pill">العربية</span>
              <span class="lang-pill">Français</span>
              <span class="lang-pill dim">+12</span>
            </div>
          </div>

          <!-- Card 3: Allergens -->
          <div class="feat-card reveal">
            <div class="feat-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3>{{ t('features.feat3Title') }}</h3>
            <p>{{ t('features.feat3Desc') }}</p>
            <div class="feat-allergens">
              <div class="al-row"><span class="al-badge">GF</span><span>{{ t('features.allergenGF') }}</span></div>
              <div class="al-row"><span class="al-badge">V</span><span>{{ t('features.allergenV') }}</span></div>
              <div class="al-row"><span class="al-badge">N</span><span>{{ t('features.allergenN') }}</span></div>
              <div class="al-cal">485 kcal</div>
            </div>
          </div>

          <!-- Card 4: Multi-location -->
          <div class="feat-card reveal">
            <div class="feat-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            </div>
            <h3>{{ t('features.feat4Title') }}</h3>
            <p>{{ t('features.feat4Desc') }}</p>
            <div class="feat-branches">
              <div class="branch-item"><span class="branch-dot"></span>{{ t('features.branch1') }} <span class="branch-count">3 {{ t('features.menusShort') }}</span></div>
              <div class="branch-item"><span class="branch-dot"></span>{{ t('features.branch2') }} <span class="branch-count">2 {{ t('features.menusShort') }}</span></div>
              <div class="branch-item"><span class="branch-dot"></span>{{ t('features.branch3') }} <span class="branch-count">4 {{ t('features.menusShort') }}</span></div>
            </div>
          </div>

          <!-- Card 5: QR per table -->
          <div class="feat-card reveal">
            <div class="feat-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/></svg>
            </div>
            <h3>{{ t('features.feat5Title') }}</h3>
            <p>{{ t('features.feat5Desc') }}</p>
            <div class="feat-tables">
              <div class="table-chip">T1</div>
              <div class="table-chip">T2</div>
              <div class="table-chip">T3</div>
              <div class="table-chip active">T4</div>
              <div class="table-chip">T5</div>
              <div class="table-chip">T6</div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ══ DASHBOARD ══════════════════════════════════════════════════ -->
    <section class="section dashboard-section">
      <div class="container">
        <div class="dash-layout">
          <div class="dash-text reveal">
            <div class="tag">{{ t('dashboard.tag') }}</div>
            <h2 class="sec-title" style="white-space:pre-line">{{ t('dashboard.title') }}</h2>
            <p class="sec-sub">{{ t('dashboard.sub') }}</p>
            <button class="btn-outline" @click="goRegister">{{ t('dashboard.cta') }} →</button>
          </div>
          <div class="dash-card reveal">
            <!-- Top metrics -->
            <div class="dash-metrics">
              <div class="metric">
                <div class="metric-label">{{ t('dashboard.totalScans') }}</div>
                <div class="metric-value">12,847</div>
                <div class="metric-delta">↑ 23% {{ t('dashboard.thisWeek') }}</div>
              </div>
              <div class="metric">
                <div class="metric-label">{{ t('dashboard.peakHour') }}</div>
                <div class="metric-value">19:00–21:00</div>
                <div class="metric-delta">{{ t('dashboard.peakHourMeta') }}</div>
              </div>
              <div class="metric">
                <div class="metric-label">{{ t('dashboard.avgSession') }}</div>
                <div class="metric-value">3:42</div>
                <div class="metric-delta">{{ t('dashboard.avgSessionMeta') }}</div>
              </div>
            </div>
            <!-- Chart -->
            <div class="dash-chart-wrap">
              <div class="dash-chart-bars">
                <div class="db" style="--h:40%"></div>
                <div class="db" style="--h:55%"></div>
                <div class="db" style="--h:35%"></div>
                <div class="db" style="--h:70%"></div>
                <div class="db" style="--h:62%"></div>
                <div class="db" style="--h:88%"></div>
                <div class="db peak" style="--h:100%"></div>
                <div class="db" style="--h:76%"></div>
                <div class="db" style="--h:58%"></div>
                <div class="db" style="--h:44%"></div>
                <div class="db" style="--h:65%"></div>
                <div class="db" style="--h:52%"></div>
              </div>
              <div class="dash-chart-labels">
                <span>{{ t('dashboard.day1') }}</span><span>{{ t('dashboard.day2') }}</span><span>{{ t('dashboard.day3') }}</span><span>{{ t('dashboard.day4') }}</span>
                <span>{{ t('dashboard.day5') }}</span><span>{{ t('dashboard.day6') }}</span><span>{{ t('dashboard.day7') }}</span>
              </div>
            </div>
            <!-- Top dishes -->
            <div class="dash-dishes">
              <div class="dd-title">{{ t('dashboard.topDishes') }}</div>
              <div class="dd-item">
                <span class="dd-rank">01</span>
                <span class="dd-name">{{ t('dashboard.dish1') }}</span>
                <div class="dd-bar-wrap"><div class="dd-bar" style="width:92%"></div></div>
                <span class="dd-views">1,284 {{ t('dashboard.views') }}</span>
              </div>
              <div class="dd-item">
                <span class="dd-rank">02</span>
                <span class="dd-name">{{ t('dashboard.dish2') }}</span>
                <div class="dd-bar-wrap"><div class="dd-bar" style="width:74%"></div></div>
                <span class="dd-views">978 {{ t('dashboard.views') }}</span>
              </div>
              <div class="dd-item">
                <span class="dd-rank">03</span>
                <span class="dd-name">{{ t('dashboard.dish3') }}</span>
                <div class="dd-bar-wrap"><div class="dd-bar" style="width:61%"></div></div>
                <span class="dd-views">812 {{ t('dashboard.views') }}</span>
              </div>
              <div class="dd-item">
                <span class="dd-rank">04</span>
                <span class="dd-name">{{ t('dashboard.dish4') }}</span>
                <div class="dd-bar-wrap"><div class="dd-bar" style="width:48%"></div></div>
                <span class="dd-views">634 {{ t('dashboard.views') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ QR EXPERIENCE ══════════════════════════════════════════════ -->
    <section class="section qr-section">
      <div class="container">
        <div class="qr-layout">
          <div class="qr-visual reveal">
            <div class="qr-card">
              <div class="qr-table-label">{{ t('qrExperience.tableLabel') }}</div>
              <svg class="qr-code-svg" width="120" height="120" viewBox="0 0 80 80" fill="none">
                <rect x="4" y="4" width="28" height="28" rx="3" stroke="#3b5bdb" stroke-width="4"/>
                <rect x="12" y="12" width="12" height="12" fill="#3b5bdb"/>
                <rect x="48" y="4" width="28" height="28" rx="3" stroke="#3b5bdb" stroke-width="4"/>
                <rect x="56" y="12" width="12" height="12" fill="#3b5bdb"/>
                <rect x="4" y="48" width="28" height="28" rx="3" stroke="#3b5bdb" stroke-width="4"/>
                <rect x="12" y="56" width="12" height="12" fill="#3b5bdb"/>
                <rect x="48" y="52" width="6" height="6" fill="#3b5bdb"/>
                <rect x="58" y="48" width="6" height="6" fill="#3b5bdb"/>
                <rect x="66" y="56" width="6" height="6" fill="#3b5bdb"/>
                <rect x="48" y="62" width="6" height="6" fill="#3b5bdb"/>
                <rect x="58" y="68" width="14" height="6" fill="#3b5bdb"/>
              </svg>
              <div class="qr-brand">La Bella Cucina</div>
              <div class="qr-hint">{{ t('qrExperience.qrHint') }}</div>
            </div>
            <div class="qr-scan-line"></div>
          </div>
          <div class="qr-text reveal">
            <div class="tag">{{ t('qrExperience.tag') }}</div>
            <h2 class="sec-title">{{ t('qrExperience.title') }}</h2>
            <p class="sec-sub">{{ t('qrExperience.sub') }}</p>
            <ul class="check-list">
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b5bdb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                {{ t('qrExperience.point1') }}
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b5bdb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                {{ t('qrExperience.point2') }}
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b5bdb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                {{ t('qrExperience.point3') }}
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b5bdb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                {{ t('qrExperience.point4') }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ MULTI-BUSINESS ═════════════════════════════════════════════ -->
    <section class="section multi-section">
      <div class="container">
        <div class="multi-layout">
          <div class="multi-text reveal">
            <div class="tag">{{ t('multiBusiness.tag') }}</div>
            <h2 class="sec-title" style="white-space:pre-line">{{ t('multiBusiness.title') }}</h2>
            <p class="sec-sub">{{ t('multiBusiness.sub') }}</p>
            <ul class="check-list">
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b5bdb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                {{ t('multiBusiness.point1') }}
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b5bdb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                {{ t('multiBusiness.point2') }}
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b5bdb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                {{ t('multiBusiness.point3') }}
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b5bdb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                {{ t('multiBusiness.point4') }}
              </li>
            </ul>
          </div>
          <div class="multi-cards reveal">
            <div class="biz-card active">
              <div class="biz-dot active"></div>
              <div class="biz-info">
                <div class="biz-name">{{ t('multiBusiness.loc1') }}</div>
                <div class="biz-meta">3 {{ t('multiBusiness.menusLabel') }}</div>
              </div>
              <div class="biz-status">{{ t('multiBusiness.activeLabel') }}</div>
            </div>
            <div class="biz-card">
              <div class="biz-dot active"></div>
              <div class="biz-info">
                <div class="biz-name">{{ t('multiBusiness.loc2') }}</div>
                <div class="biz-meta">2 {{ t('multiBusiness.menusLabel') }}</div>
              </div>
              <div class="biz-status">{{ t('multiBusiness.activeLabel') }}</div>
            </div>
            <div class="biz-card">
              <div class="biz-dot active"></div>
              <div class="biz-info">
                <div class="biz-name">{{ t('multiBusiness.loc3') }}</div>
                <div class="biz-meta">4 {{ t('multiBusiness.menusLabel') }}</div>
              </div>
              <div class="biz-status">{{ t('multiBusiness.activeLabel') }}</div>
            </div>
            <div class="biz-card add-card" @click="goRegister">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              {{ t('multiBusiness.addNew') }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ HOW IT WORKS ════════════════════════════════════════════════ -->
    <section id="how" class="section how-section">
      <div class="container">
        <div class="sec-header reveal">
          <div class="tag">{{ t('how.tag') }}</div>
          <h2 class="sec-title">{{ t('how.title') }}</h2>
          <p class="sec-sub">{{ t('how.sub') }}</p>
        </div>
        <div class="how-steps">
          <div class="how-step reveal">
            <div class="step-num">01</div>
            <h3>{{ t('how.step1Title') }}</h3>
            <p>{{ t('how.step1Desc') }}</p>
          </div>
          <div class="how-arrow">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
          <div class="how-step reveal">
            <div class="step-num">02</div>
            <h3>{{ t('how.step2Title') }}</h3>
            <p>{{ t('how.step2Desc') }}</p>
          </div>
          <div class="how-arrow">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
          <div class="how-step reveal">
            <div class="step-num">03</div>
            <h3>{{ t('how.step3Title') }}</h3>
            <p>{{ t('how.step3Desc') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ PRICING ════════════════════════════════════════════════════ -->
    <section id="pricing" class="section pricing-section">
      <div class="container">
        <div class="sec-header reveal">
          <div class="tag">{{ t('pricing.tag') }}</div>
          <h2 class="sec-title">{{ t('pricing.title') }}</h2>
          <p class="sec-sub">{{ t('pricing.sub') }}</p>
        </div>
        <div class="pricing-grid">
          <div class="price-card reveal">
            <div class="plan-name">{{ t('pricing.free.name') }}</div>
            <div class="plan-price"><strong>{{ t('pricing.free.price') }}</strong><span>{{ t('pricing.perMonth') }}</span></div>
            <div class="plan-desc">{{ t('pricing.free.desc') }}</div>
            <ul class="plan-feats">
              <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b5bdb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>{{ t('pricing.free.f1') }}</li>
              <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b5bdb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>{{ t('pricing.free.f2') }}</li>
              <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b5bdb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>{{ t('pricing.free.f3') }}</li>
              <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b5bdb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>{{ t('pricing.free.f4') }}</li>
              <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b5bdb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>{{ t('pricing.free.f5') }}</li>
            </ul>
            <button class="plan-btn" @click="goRegister">{{ t('pricing.free.cta') }}</button>
          </div>
          <div class="price-card featured reveal">
            <div class="plan-badge">{{ t('pricing.mostPopular') }}</div>
            <div class="plan-name">{{ t('pricing.pro.name') }}</div>
            <div class="plan-price"><strong>{{ t('pricing.pro.price') }}</strong><span>{{ t('pricing.perMonth') }}</span></div>
            <div class="plan-desc">{{ t('pricing.pro.desc') }}</div>
            <ul class="plan-feats">
              <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b5bdb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>{{ t('pricing.pro.f1') }}</li>
              <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b5bdb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>{{ t('pricing.pro.f2') }}</li>
              <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b5bdb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>{{ t('pricing.pro.f3') }}</li>
              <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b5bdb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>{{ t('pricing.pro.f4') }}</li>
              <li class="ai-feat"><svg class="ai-spark" width="14" height="14" viewBox="0 0 24 24" fill="#3b5bdb"><path d="M12 2l2.2 6.5L21 10.5l-6.8 2L12 19l-2.2-6.5L3 10.5l6.8-2z"/></svg>{{ t('pricing.pro.f5') }}</li>
              <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b5bdb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>{{ t('pricing.pro.f6') }}</li>
            </ul>
            <button class="plan-btn gold" @click="goRegister">{{ t('pricing.pro.cta') }}</button>
          </div>
          <div class="price-card reveal">
            <div class="plan-name">{{ t('pricing.premium.name') }}</div>
            <div class="plan-price"><strong>{{ t('pricing.premium.price') }}</strong><span>{{ t('pricing.perMonth') }}</span></div>
            <div class="plan-desc">{{ t('pricing.premium.desc') }}</div>
            <ul class="plan-feats">
              <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b5bdb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>{{ t('pricing.premium.f1') }}</li>
              <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b5bdb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>{{ t('pricing.premium.f2') }}</li>
              <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b5bdb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>{{ t('pricing.premium.f3') }}</li>
              <li class="ai-feat"><svg class="ai-spark" width="14" height="14" viewBox="0 0 24 24" fill="#3b5bdb"><path d="M12 2l2.2 6.5L21 10.5l-6.8 2L12 19l-2.2-6.5L3 10.5l6.8-2z"/></svg>{{ t('pricing.premium.f4') }}</li>
              <li class="ai-feat"><svg class="ai-spark" width="14" height="14" viewBox="0 0 24 24" fill="#3b5bdb"><path d="M12 2l2.2 6.5L21 10.5l-6.8 2L12 19l-2.2-6.5L3 10.5l6.8-2z"/></svg>{{ t('pricing.premium.f5') }}</li>
              <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b5bdb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>{{ t('pricing.premium.f6') }}</li>
            </ul>
            <button class="plan-btn" @click="goRegister">{{ t('pricing.premium.cta') }}</button>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ FAQ ════════════════════════════════════════════════════════ -->
    <section id="faq" class="section faq-section">
      <div class="container faq-inner">
        <div class="sec-header reveal">
          <div class="tag">{{ t('faq.tag') }}</div>
          <h2 class="sec-title">{{ t('faq.title') }}</h2>
        </div>
        <div class="faq-list">
          <div
            v-for="(item, i) in faqItems"
            :key="i"
            :class="['faq-item', { open: faqOpen[i] }]"
            @click="toggleFaq(i)"
          >
            <div class="faq-q">
              {{ item.q }}
              <svg :class="['faq-arrow', { open: faqOpen[i] }]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            <div class="faq-a" v-show="faqOpen[i]">{{ item.a }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ CTA ════════════════════════════════════════════════════════ -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-card reveal">
          <div class="cta-grid" aria-hidden="true"></div>
          <div class="cta-orb cta-orb-1" aria-hidden="true"></div>
          <div class="cta-orb cta-orb-2" aria-hidden="true"></div>
          <div class="cta-orb cta-orb-3" aria-hidden="true"></div>

          <!-- AI badge -->
          <div class="cta-badge">
            <span class="cb-spark" aria-hidden="true">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.2 6.5L21 10.5l-6.8 2L12 19l-2.2-6.5L3 10.5l6.8-2z"/></svg>
            </span>
            {{ t('cta.badge') }}
            <span class="cb-pulse" aria-hidden="true"></span>
          </div>

          <!-- Two-color editorial title -->
          <h2 class="cta-title">
            <span class="ct-lead">{{ t('cta.titleLead') }}</span>
            <span class="ct-accent-wrap">
              <em class="ct-accent">{{ t('cta.titleAccent') }}</em>
              <svg class="ct-swash" viewBox="0 0 420 18" preserveAspectRatio="none" fill="none" aria-hidden="true">
                <defs>
                  <linearGradient id="ctaSwash" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#8aa0ff"/>
                    <stop offset="50%" stop-color="#768dfb"/>
                    <stop offset="100%" stop-color="#3b5bdb"/>
                  </linearGradient>
                </defs>
                <path d="M4 12 Q 100 3, 210 9 T 416 7" stroke="url(#ctaSwash)" stroke-width="4" stroke-linecap="round"/>
              </svg>
            </span>
          </h2>

          <p class="cta-sub">{{ t('cta.sub') }}</p>

          <!-- Conversion CTA -->
          <button class="btn-cta-main" @click="goRegister">
            <span class="cb-text">{{ t('cta.btn') }}</span>
            <span class="cb-arrow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </span>
          </button>

          <!-- Trust microcopy -->
          <div class="cta-note">
            <span class="cn-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5ee7b0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              {{ t('cta.micro1') }}
            </span>
            <span class="cn-dot">·</span>
            <span class="cn-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5ee7b0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              {{ t('cta.micro2') }}
            </span>
            <span class="cn-dot">·</span>
            <span class="cn-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5ee7b0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              {{ t('cta.micro3') }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ FOOTER ══════════════════════════════════════════════════════ -->
    <footer class="footer">
      <div class="container footer-inner">
        <div class="footer-brand">
          <a href="#" class="brand">
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
          </a>
          <p class="footer-tagline">{{ t('footer.tagline') }}</p>
        </div>
        <div class="footer-cols">
          <div class="footer-col">
            <div class="footer-heading">{{ t('footer.product') }}</div>
            <a href="#features">{{ t('footer.features') }}</a>
            <a href="#pricing">{{ t('footer.pricing') }}</a>
            <a href="#how">{{ t('footer.howItWorks') }}</a>
          </div>
          <div class="footer-col">
            <div class="footer-heading">{{ t('footer.company') }}</div>
            <a href="#">{{ t('footer.about') }}</a>
            <a href="#">{{ t('footer.blog') }}</a>
            <a href="#contact">{{ t('footer.contact') }}</a>
          </div>
          <div class="footer-col">
            <div class="footer-heading">{{ t('footer.legal') }}</div>
            <a href="#">{{ t('footer.privacy') }}</a>
            <a href="#">{{ t('footer.terms') }}</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>{{ t('footer.copyright') }}</span>
        <span>{{ t('footer.madeWith') }}</span>
      </div>
    </footer>

  </div>
</template>

<style scoped>
/* ── TOKENS ────────────────────────────────────────────────────────── */
.land {
  --bg:        #f8f9ff;
  --sur:       #ffffff;
  --sur2:      #eef0fb;
  --border:    rgba(59,91,219,0.10);
  --border2:   rgba(59,91,219,0.20);
  --t1:        #0d1b3e;
  --t2:        rgba(13,27,62,0.55);
  --t3:        rgba(13,27,62,0.32);
  --gold:      #3b5bdb;
  --gold-dim:  rgba(59,91,219,0.10);
  --gold-glow: rgba(59,91,219,0.06);
  --radius:    14px;
  --f-display: 'Geist', system-ui, sans-serif;
  --f-body:    'Inter', system-ui, sans-serif;
  --f-mono:    'IBM Plex Mono', 'Fira Code', monospace;
  background: var(--bg);
  color: var(--t1);
  font-family: var(--f-body);
  overflow-x: hidden;
}

/* ── LAYOUT ────────────────────────────────────────────────────────── */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(20px, 5vw, 60px);
}

.section {
  padding: clamp(80px, 10vw, 140px) 0;
}

/* ── REVEAL ANIMATION ──────────────────────────────────────────────── */
.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.7s cubic-bezier(.22,.68,0,1.2), transform 0.7s cubic-bezier(.22,.68,0,1.2);
}
.reveal.in {
  opacity: 1;
  transform: none;
}

/* ── TYPOGRAPHY ────────────────────────────────────────────────────── */
.sec-header {
  text-align: center;
  max-width: 680px;
  margin: 0 auto clamp(48px, 6vw, 80px);
}
.sec-title {
  font-family: var(--f-display);
  font-size: clamp(34px, 4.5vw, 58px);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin: 12px 0 16px;
  color: var(--t1);
}
.sec-sub {
  font-size: clamp(15px, 1.5vw, 17px);
  color: var(--t2);
  line-height: 1.7;
  max-width: 580px;
  margin: 0 auto;
}
.tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gold);
  border: 1px solid rgba(59,91,219,0.25);
  border-radius: 100px;
  padding: 5px 12px;
}

/* ── BUTTONS ───────────────────────────────────────────────────────── */
.btn-ghost {
  background: none;
  border: none;
  color: var(--t2);
  font-size: 14px;
  font-family: inherit;
  cursor: pointer;
  padding: 8px 14px;
  border-radius: 8px;
  transition: color .2s;
}
.btn-ghost:hover { color: var(--t1); }
.btn-gold {
  background: var(--gold);
  color: #ffffff;
  border: none;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  padding: 9px 20px;
  border-radius: 100px;
  transition: opacity .2s, transform .2s;
}
.btn-gold:hover { opacity: 0.88; transform: translateY(-1px); }
.btn-outline {
  background: none;
  border: 1px solid var(--border2);
  color: var(--t1);
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  padding: 11px 22px;
  border-radius: 100px;
  transition: border-color .2s, background .2s;
  margin-top: 28px;
}
.btn-outline:hover { border-color: var(--gold); background: var(--gold-glow); }

/* ── NAV ───────────────────────────────────────────────────────────── */
.nav-wrap {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 14px clamp(16px, 3vw, 40px) 0;
  pointer-events: none;
}
.nav-wrap > * { pointer-events: auto; }
.nav {
  max-width: 1200px;
  margin: 0 auto;
  background: #ffffff;
  border: 1px solid rgba(59,91,219,0.12);
  border-radius: 14px;
  box-shadow: 0 2px 24px rgba(59,91,219,0.08), 0 1px 0 rgba(255,255,255,0.9) inset;
  transition: box-shadow .3s;
  overflow: visible;
}
.nav.scrolled {
  box-shadow: 0 4px 40px rgba(59,91,219,0.12), 0 1px 0 rgba(255,255,255,0.9) inset;
}
.nav-inner {
  padding: 10px 18px;
  display: flex;
  align-items: center;
  gap: 0;
}

/* Brand */
.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  flex-shrink: 0;
  margin-right: 28px;
}
.brand-icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.brand-text {
  font-family: var(--f-display);
  font-weight: 700;
  font-size: 17px;
  letter-spacing: -0.03em;
  line-height: 1;
}
.brand-gold { color: var(--gold); }
.brand-white { color: var(--t1); }

/* Nav links */
.nav-links {
  display: flex;
  align-items: center;
  gap: 2px;
  flex: 1;
}
.nav-link-wrap { position: relative; }
.nav-link {
  display: flex;
  align-items: center;
  gap: 4px;
  text-decoration: none;
  color: rgba(13,27,62,0.55);
  font-size: 13.5px;
  font-weight: 500;
  padding: 7px 13px;
  border-radius: 9px;
  transition: color .18s, background .18s;
  white-space: nowrap;
}
.nav-link:hover { color: var(--t1); background: rgba(59,91,219,0.06); }
.nav-link svg { opacity: 0.5; flex-shrink: 0; }

/* Right actions */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
}
.nav-icon-btn {
  width: 34px;
  height: 34px;
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(13,27,62,0.42);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: color .18s, background .18s;
}
.nav-icon-btn:hover { color: var(--t1); background: rgba(59,91,219,0.06); }
.nav-login {
  background: none;
  border: none;
  color: rgba(13,27,62,0.55);
  font-size: 13.5px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  padding: 7px 14px;
  border-radius: 9px;
  transition: color .18s, background .18s;
}
.nav-login:hover { color: var(--t1); background: rgba(59,91,219,0.06); }
.nav-cta {
  background: var(--gold);
  color: #ffffff;
  border: none;
  font-size: 13.5px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  padding: 8px 18px;
  border-radius: 100px;
  letter-spacing: -0.01em;
  transition: opacity .18s, transform .18s;
}
.nav-cta:hover { opacity: 0.88; transform: translateY(-1px); }

/* Lang switcher */
.lang-switcher { position: relative; }
.lang-menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: #ffffff;
  border: 1px solid rgba(59,91,219,0.12);
  border-radius: 12px;
  overflow: hidden;
  min-width: 144px;
  box-shadow: 0 20px 48px rgba(59,91,219,0.12);
}
.lang-opt {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: none;
  border: none;
  color: rgba(13,27,62,0.55);
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  padding: 10px 16px;
  transition: background .15s, color .15s;
}
.lang-opt:hover { background: rgba(59,91,219,0.06); color: var(--t1); }
.lang-opt.active { color: var(--gold); }
.lang-name { color: rgba(13,27,62,0.32); font-size: 11px; }

/* Hamburger */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  margin-left: auto;
}
.hamburger span {
  display: block;
  width: 20px;
  height: 1.5px;
  background: var(--t1);
  border-radius: 2px;
  transition: transform .25s, opacity .25s;
}
.hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
.hamburger.open span:nth-child(2) { opacity: 0; }
.hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

/* Mobile drawer */
.mobile-drawer {
  display: none;
  flex-direction: column;
  gap: 2px;
  margin-top: 6px;
  padding: 14px 20px 18px;
  background: #ffffff;
  border: 1px solid rgba(59,91,219,0.12);
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(59,91,219,0.10);
}
.mobile-drawer a {
  text-decoration: none;
  color: rgba(13,27,62,0.55);
  font-size: 15px;
  padding: 11px 8px;
  border-bottom: 1px solid rgba(59,91,219,0.07);
}
.mob-lang {
  display: flex;
  gap: 8px;
  padding: 12px 0;
}
.ml-btn {
  background: none;
  border: 1px solid rgba(59,91,219,0.15);
  color: rgba(13,27,62,0.50);
  font-size: 12px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  padding: 6px 14px;
  border-radius: 100px;
  letter-spacing: 0.06em;
  transition: border-color .2s, color .2s;
}
.ml-btn.active { border-color: var(--gold); color: var(--gold); }
.mob-foot {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 6px;
}
.w-full { width: 100%; text-align: center; justify-content: center; }

/* ── HERO ──────────────────────────────────────────────────────────── */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 130px 0 80px;
  overflow: hidden;
}
.hero-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 600px;
  background: radial-gradient(ellipse, rgba(59,91,219,0.07) 0%, transparent 70%);
  pointer-events: none;
}
.hero-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: clamp(40px, 6vw, 80px);
  width: 100%;
}
.hero-text { flex: 1; }
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.06em;
  color: var(--t2);
  border: 1px solid var(--border2);
  border-radius: 100px;
  padding: 7px 16px;
  margin-bottom: 28px;
}
.pulse {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--gold);
  box-shadow: 0 0 0 0 rgba(59,91,219,0.4);
  animation: pulse-ring 2s infinite;
  flex-shrink: 0;
}
@keyframes pulse-ring {
  0% { box-shadow: 0 0 0 0 rgba(59,91,219,0.4); }
  70% { box-shadow: 0 0 0 8px rgba(59,91,219,0); }
  100% { box-shadow: 0 0 0 0 rgba(59,91,219,0); }
}
.hero-h1 {
  font-family: var(--f-display);
  font-size: clamp(34px, 4vw, 54px);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.035em;
  color: var(--t1);
  margin: 0 0 24px;
  max-width: 540px;
}
.hero-h1 em {
  font-style: normal;
  color: var(--gold);
}
.hero-sub {
  font-size: clamp(15px, 1.4vw, 17px);
  color: var(--t2);
  line-height: 1.75;
  max-width: 500px;
  margin: 0 0 36px;
}
.hero-btns {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 48px;
  flex-wrap: wrap;
}
.btn-hero-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--gold);
  color: #ffffff;
  border: none;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  padding: 14px 26px;
  border-radius: 100px;
  transition: opacity .2s, transform .2s;
}
.btn-hero-primary:hover { opacity: 0.88; transform: translateY(-2px); }
.btn-hero-ghost {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--t2);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 14px 20px;
  border-radius: 100px;
  border: 1px solid var(--border);
  transition: color .2s, border-color .2s;
}
.btn-hero-ghost:hover { color: var(--t1); border-color: var(--border2); }
.hero-stats {
  display: flex;
  align-items: center;
  gap: 24px;
}
.stat { line-height: 1.3; }
.stat strong {
  display: block;
  font-family: var(--f-mono);
  font-size: 22px;
  font-weight: 800;
  color: var(--t1);
  letter-spacing: -0.02em;
}
.stat span { font-size: 12px; color: var(--t3); }
.stat-div { width: 1px; height: 32px; background: var(--border); }

/* Phone mockup */
.hero-phone {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.phone-halo {
  position: absolute;
  width: 340px;
  height: 500px;
  background: radial-gradient(ellipse, rgba(59,91,219,0.10) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}
.phone {
  position: relative;
  width: 248px;
  min-height: 520px;
  background: linear-gradient(180deg, #ffffff 0%, #f4f6fb 100%);
  border-radius: 42px;
  border: 1px solid rgba(13,27,62,0.08);
  box-shadow:
    0 0 0 6px #eef0fb,
    0 0 0 7px rgba(59,91,219,0.12),
    0 30px 80px rgba(59,91,219,0.18),
    inset 0 1px 0 rgba(255,255,255,0.9);
  overflow: hidden;
  padding: 12px 0 20px;
  display: flex;
  flex-direction: column;
}
.phone-screen { flex: 1; }
.phone-island {
  width: 100px;
  height: 28px;
  background: #1a1a1a;
  border-radius: 20px;
  margin: 4px auto 12px;
}
.phone-screen { padding: 0 14px; }
.phone-bar {
  width: 80px;
  height: 4px;
  background: rgba(13,27,62,0.18);
  border-radius: 2px;
  margin: 14px auto 0;
}

/* Phone — AI advisor */
.ps-ai-header {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 6px 4px 12px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 12px;
}
.ps-ai-logo {
  width: 28px;
  height: 28px;
  background: var(--gold-dim);
  border: 1px solid rgba(59,91,219,0.20);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gold);
  flex-shrink: 0;
}
.ps-ai-meta { flex: 1; min-width: 0; }
.ps-ai-title {
  font-family: var(--f-display);
  font-size: 11px;
  font-weight: 700;
  color: var(--t1);
  letter-spacing: -0.01em;
}
.ps-ai-sub { font-size: 9px; color: var(--t3); margin-top: 1px; }
.ps-ai-pulse {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 0 0 rgba(74,222,128,0.5);
  animation: pulse-ring 2s infinite;
  flex-shrink: 0;
}
.ps-ai-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin-bottom: 12px;
}
.ps-ai-stat {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 8px 10px;
}
.ps-ai-stat-label {
  font-size: 8px;
  font-weight: 500;
  color: var(--t3);
  letter-spacing: 0.04em;
}
.ps-ai-stat-val {
  font-family: var(--f-mono);
  font-size: 15px;
  font-weight: 800;
  color: var(--t1);
  letter-spacing: -0.02em;
  margin-top: 3px;
  line-height: 1;
}
.ps-ai-stat-delta {
  font-size: 8px;
  font-weight: 600;
  color: #16a34a;
  margin-top: 3px;
}
.ps-ai-insights {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.ps-ai-card {
  display: flex;
  gap: 7px;
  align-items: flex-start;
  background: var(--sur);
  border: 1px solid var(--border);
  border-left-width: 2.5px;
  border-radius: 8px;
  padding: 7px 9px;
}
.ps-ai-card.important { border-left-color: #ef4444; }
.ps-ai-card.suggestion { border-left-color: var(--gold); }
.ps-ai-card.info { border-left-color: #3b82f6; }
.ps-ai-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  margin-top: 4px;
  flex-shrink: 0;
}
.ps-ai-card.important .ps-ai-dot { background: #ef4444; }
.ps-ai-card.suggestion .ps-ai-dot { background: var(--gold); }
.ps-ai-card.info .ps-ai-dot { background: #3b82f6; }
.ps-ai-card-body-wrap { flex: 1; min-width: 0; }
.ps-ai-card-title {
  font-size: 9px;
  font-weight: 700;
  color: var(--t1);
  letter-spacing: -0.005em;
}
.ps-ai-card-body {
  font-size: 8.5px;
  color: var(--t2);
  line-height: 1.45;
  margin-top: 1px;
}
.ps-ai-chart {
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid var(--border);
}
.ps-ai-chart-label {
  font-size: 8px;
  font-weight: 700;
  color: var(--t3);
  letter-spacing: 0.1em;
  margin-bottom: 6px;
}
.ps-ai-chart-bars {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 38px;
}
.ps-ai-chart-bar {
  flex: 1;
  background: rgba(59,91,219,0.18);
  border-radius: 2px 2px 0 0;
  transition: background .2s;
}
.ps-ai-chart-bar.peak {
  background: var(--gold);
  box-shadow: 0 0 8px rgba(59,91,219,0.25);
}
.ps-ai-cta {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  background: var(--gold);
  color: #ffffff;
  border-radius: 10px;
  padding: 9px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: -0.005em;
}

/* Floating chips */
.chip {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255,255,255,0.95);
  border: 1px solid var(--border2);
  border-radius: 100px;
  padding: 8px 14px;
  font-size: 11px;
  font-weight: 500;
  color: var(--t1);
  backdrop-filter: blur(10px);
  white-space: nowrap;
  box-shadow: 0 8px 24px rgba(59,91,219,0.12);
}
.chip-top { top: 8%; left: 18%; animation: float1 4s ease-in-out infinite; }
.chip-bot { bottom: 22%; right: 14%; animation: float2 4.5s ease-in-out infinite; }
@keyframes float1 { 0%,100%{ transform:translateY(0) } 50%{ transform:translateY(-10px) } }
@keyframes float2 { 0%,100%{ transform:translateY(0) } 50%{ transform:translateY(8px) } }

/* ── MARQUEE ───────────────────────────────────────────────────────── */
.marquee-wrap {
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: 18px 0;
  overflow: hidden;
  background: var(--sur);
}
.marquee-track {
  display: flex;
  align-items: center;
  gap: 0;
  white-space: nowrap;
  animation: marquee 35s linear infinite;
}
.marquee-track span {
  font-size: 13px;
  font-weight: 500;
  color: var(--t3);
  padding: 0 24px;
  letter-spacing: 0.04em;
}
.marquee-track .dot {
  color: var(--gold);
  padding: 0 4px;
  opacity: 0.5;
}
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

/* ── AI ADVISOR ────────────────────────────────────────────────────── */
.ai-section {
  background: var(--sur);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
.ai-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(40px, 5vw, 80px);
  align-items: center;
}
.ai-text .sec-title { text-align: left; font-size: clamp(26px, 3.2vw, 42px); }
.ai-text .sec-sub { text-align: left; margin: 0; }
.ai-text .tag { margin-bottom: 16px; }
.ai-insights {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.insight-card {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 18px 20px;
  display: flex;
  gap: 14px;
  align-items: flex-start;
  box-shadow: 0 2px 12px rgba(59,91,219,0.05);
  transition: transform .25s, box-shadow .25s, border-color .25s;
}
.insight-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(59,91,219,0.10);
  border-color: var(--border2);
}
.insight-card.important { border-left: 3px solid #ef4444; }
.insight-card.suggestion { border-left: 3px solid var(--gold); }
.insight-card.info { border-left: 3px solid #3b82f6; }
.insight-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 7px;
  flex-shrink: 0;
}
.insight-card.important .insight-dot { background: #ef4444; box-shadow: 0 0 10px rgba(239,68,68,0.4); }
.insight-card.suggestion .insight-dot { background: var(--gold); box-shadow: 0 0 10px rgba(59,91,219,0.4); }
.insight-card.info .insight-dot { background: #3b82f6; box-shadow: 0 0 10px rgba(59,130,246,0.4); }
.insight-body-wrap { flex: 1; min-width: 0; }
.insight-severity {
  font-family: var(--f-mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
}
.sev-important { color: #ef4444; }
.sev-suggestion { color: var(--gold); }
.sev-info { color: #3b82f6; }
.insight-title {
  font-family: var(--f-display);
  font-size: 14px;
  font-weight: 600;
  color: var(--t1);
  margin: 4px 0 6px;
  letter-spacing: -0.01em;
}
.insight-body {
  font-size: 13px;
  color: var(--t2);
  line-height: 1.6;
}

/* ── FEATURE CARDS ─────────────────────────────────────────────────── */
.feat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.feat-card {
  background: var(--sur);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 28px;
  transition: border-color .25s, transform .25s, box-shadow .25s;
  box-shadow: 0 2px 12px rgba(59,91,219,0.05);
  cursor: default;
}
.feat-card:hover {
  border-color: var(--border2);
  transform: translateY(-3px);
  box-shadow: 0 16px 48px rgba(59,91,219,0.12);
}
.feat-icon {
  width: 40px;
  height: 40px;
  background: var(--gold-dim);
  border: 1px solid rgba(59,91,219,0.20);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gold);
  margin-bottom: 18px;
}
.feat-card h3 {
  font-family: var(--f-display);
  font-size: 16px;
  font-weight: 700;
  color: var(--t1);
  margin: 0 0 10px;
  letter-spacing: -0.02em;
}
.feat-card p {
  font-size: 13px;
  color: var(--t2);
  line-height: 1.65;
  margin: 0 0 20px;
}

/* Feature UI snippets */
.feat-ui { display: flex; flex-direction: column; gap: 6px; }
.fui-row {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--sur2);
  border-radius: 8px;
  padding: 7px 10px;
  border: 1px solid var(--border);
}
.fui-item { font-size: 11px; color: var(--t1); flex: 1; }
.fui-price { font-size: 11px; font-weight: 600; color: var(--t2); }
.fui-tag {
  font-size: 9px;
  font-weight: 600;
  border-radius: 100px;
  padding: 2px 8px;
}
.fui-tag.live { background: rgba(74,222,128,0.1); color: #4ade80; }
.fui-tag.updating { background: rgba(59,91,219,0.10); color: var(--gold); }
.fui-tag.out { background: rgba(239,68,68,0.1); color: #f87171; }

.feat-langs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.lang-pill {
  font-size: 11px;
  font-weight: 500;
  padding: 5px 12px;
  border-radius: 100px;
  background: var(--sur2);
  border: 1px solid var(--border);
  color: var(--t2);
}
.lang-pill.active { background: var(--gold-dim); border-color: rgba(59,91,219,0.30); color: var(--gold); }
.lang-pill.dim { color: var(--t3); }

.feat-allergens { display: flex; flex-direction: column; gap: 7px; }
.al-row { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--t2); }
.al-badge {
  width: 22px;
  height: 22px;
  background: var(--gold-dim);
  border: 1px solid rgba(59,91,219,0.20);
  border-radius: 5px;
  color: var(--gold);
  font-size: 9px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.al-cal {
  font-size: 11px;
  color: var(--t3);
  margin-top: 4px;
  padding-top: 8px;
  border-top: 1px solid var(--border);
}

.feat-branches { display: flex; flex-direction: column; gap: 6px; }
.branch-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--t2);
  padding: 7px 10px;
  background: var(--sur2);
  border-radius: 8px;
  border: 1px solid var(--border);
}
.branch-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #4ade80;
  flex-shrink: 0;
}
.branch-count { margin-left: auto; font-size: 11px; color: var(--t3); }

.feat-tables { display: flex; flex-wrap: wrap; gap: 6px; }
.table-chip {
  width: 38px;
  height: 38px;
  background: var(--sur2);
  border: 1px solid var(--border);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  color: var(--t3);
}
.table-chip.active {
  background: var(--gold-dim);
  border-color: rgba(59,91,219,0.30);
  color: var(--gold);
  box-shadow: 0 0 12px rgba(59,91,219,0.15);
}

.feat-chart {
  display: flex;
  align-items: flex-end;
  gap: 5px;
  height: 60px;
}
.chart-bar {
  flex: 1;
  background: rgba(59,91,219,0.10);
  border-radius: 4px 4px 0 0;
  transition: background .3s;
}
.chart-bar.active { background: var(--gold); }

.feat-ai-demo {
  background: var(--gold-dim);
  border: 1px solid var(--border2);
  border-radius: 10px;
  padding: 12px 14px;
}
.ai-demo-badge {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--gold);
  margin-bottom: 6px;
}
.ai-demo-text {
  font-size: 12px;
  color: var(--t1);
  line-height: 1.5;
}

/* ── DASHBOARD ─────────────────────────────────────────────────────── */
.dashboard-section { background: var(--sur); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.dash-layout {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: clamp(40px, 5vw, 80px);
  align-items: center;
}
.dash-text .sec-title { text-align: left; }
.dash-text .sec-sub { text-align: left; margin: 0; }
.dash-card {
  background: var(--bg);
  border: 1px solid var(--border2);
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 0 0 1px rgba(59,91,219,0.06), 0 24px 64px rgba(59,91,219,0.10);
}
.dash-metrics {
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border);
}
.metric-label { font-size: 11px; color: var(--t3); margin-bottom: 4px; }
.metric-value { font-family: var(--f-mono); font-size: 22px; font-weight: 700; color: var(--t1); letter-spacing: -0.02em; }
.metric-delta { font-size: 11px; color: #4ade80; margin-top: 3px; }
.dash-chart-wrap { margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid var(--border); }
.dash-chart-bars {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 80px;
  margin-bottom: 8px;
}
.db {
  flex: 1;
  height: var(--h);
  background: rgba(59,91,219,0.10);
  border-radius: 3px 3px 0 0;
  transition: background .2s;
}
.db.peak { background: var(--gold); }
.db:hover { background: rgba(59,91,219,0.25); }
.dash-chart-labels {
  display: flex;
  gap: 4px;
  justify-content: space-between;
}
.dash-chart-labels span { font-size: 10px; color: var(--t3); flex: 1; text-align: center; }
.dd-title { font-size: 11px; font-weight: 600; color: var(--t3); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 12px; }
.dash-dishes { display: flex; flex-direction: column; gap: 10px; }
.dd-item { display: flex; align-items: center; gap: 10px; }
.dd-rank { font-family: var(--f-mono); font-size: 10px; font-weight: 700; color: var(--t3); width: 20px; flex-shrink: 0; }
.dd-name { font-size: 12px; color: var(--t1); width: 120px; flex-shrink: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dd-bar-wrap { flex: 1; height: 4px; background: rgba(59,91,219,0.10); border-radius: 2px; overflow: hidden; }
.dd-bar { height: 100%; background: var(--gold); border-radius: 2px; opacity: 0.7; }
.dd-views { font-family: var(--f-mono); font-size: 10px; color: var(--t3); flex-shrink: 0; width: 60px; text-align: right; }

/* ── QR SECTION ────────────────────────────────────────────────────── */
.qr-section { }
.qr-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(40px, 5vw, 80px);
  align-items: center;
}
.qr-visual {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.qr-card {
  background: var(--sur);
  border: 1px solid var(--border2);
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  position: relative;
  box-shadow: 0 0 0 1px rgba(59,91,219,0.07), 0 20px 48px rgba(59,91,219,0.10);
}
.qr-table-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--gold);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 20px;
}
.qr-code-svg { display: block; margin: 0 auto 20px; }
.qr-brand {
  font-family: var(--f-display);
  font-size: 16px;
  font-weight: 700;
  color: var(--t1);
  margin-bottom: 6px;
}
.qr-hint { font-size: 11px; color: var(--t3); }
.qr-scan-line {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
  animation: scan 2.5s ease-in-out infinite;
  pointer-events: none;
}
@keyframes scan {
  0%,100% { transform: translate(-50%,-60px); opacity: 0; }
  20%,80% { opacity: 1; }
  50% { transform: translate(-50%,60px); }
}
.qr-text .sec-title { text-align: left; }
.qr-text .sec-sub { text-align: left; margin: 0; }
.qr-text .tag { margin-bottom: 16px; }
.check-list {
  list-style: none;
  padding: 0;
  margin: 24px 0 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.check-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: var(--t2);
}

/* ── MULTI-BUSINESS ────────────────────────────────────────────────── */
.multi-section { background: var(--sur); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.multi-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(40px, 5vw, 80px);
  align-items: center;
}
.multi-text .sec-title { text-align: left; }
.multi-text .sec-sub { text-align: left; margin: 0; }
.multi-text .tag { margin-bottom: 16px; }
.multi-cards { display: flex; flex-direction: column; gap: 10px; }
.biz-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 18px 20px;
  transition: border-color .2s, transform .2s;
  box-shadow: 0 2px 8px rgba(59,91,219,0.04);
}
.biz-card:hover { border-color: var(--border2); transform: translateX(4px); }
.biz-card.active { border-color: rgba(59,91,219,0.25); }
.biz-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: rgba(13,27,62,0.15);
  flex-shrink: 0;
}
.biz-dot.active { background: #4ade80; box-shadow: 0 0 8px rgba(74,222,128,0.4); }
.biz-name { font-size: 14px; font-weight: 500; color: var(--t1); }
.biz-meta { font-size: 12px; color: var(--t3); margin-top: 2px; }
.biz-status {
  margin-left: auto;
  font-size: 11px;
  font-weight: 600;
  color: #4ade80;
  background: rgba(74,222,128,0.08);
  border: 1px solid rgba(74,222,128,0.15);
  border-radius: 100px;
  padding: 3px 10px;
}
.add-card {
  cursor: pointer;
  border-style: dashed;
  justify-content: center;
  color: var(--t3);
  font-size: 13px;
  gap: 8px;
  padding: 16px;
  transition: border-color .2s, color .2s;
}
.add-card:hover { border-color: var(--gold); color: var(--gold); transform: none; }

/* ── HOW IT WORKS ──────────────────────────────────────────────────── */
.how-section { }
.how-steps {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-top: 60px;
}
.how-step {
  flex: 1;
  text-align: center;
  padding: 32px 24px;
  background: var(--sur);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: 0 2px 12px rgba(59,91,219,0.05);
}
.step-num {
  font-family: var(--f-mono);
  font-size: 40px;
  font-weight: 800;
  color: rgba(59,91,219,0.20);
  margin-bottom: 16px;
  letter-spacing: -0.04em;
  line-height: 1;
}
.how-step h3 {
  font-family: var(--f-display);
  font-size: 17px;
  font-weight: 700;
  color: var(--t1);
  margin: 0 0 10px;
  letter-spacing: -0.02em;
}
.how-step p { font-size: 14px; color: var(--t2); line-height: 1.65; margin: 0; }
.how-arrow {
  color: var(--t3);
  padding-top: 48px;
  flex-shrink: 0;
}

/* ── PRICING ───────────────────────────────────────────────────────── */
.pricing-section { background: var(--sur); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  align-items: start;
}
.price-card {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 32px 28px;
  position: relative;
  box-shadow: 0 2px 12px rgba(59,91,219,0.05);
  transition: border-color .25s, transform .25s;
}
.price-card:hover { border-color: var(--border2); transform: translateY(-3px); }
.price-card.featured {
  border-color: rgba(59,91,219,0.30);
  background: var(--sur);
  box-shadow: 0 0 0 1px rgba(59,91,219,0.12), 0 20px 60px rgba(59,91,219,0.12);
}
.plan-badge {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--gold);
  background: var(--gold-dim);
  border: 1px solid rgba(59,91,219,0.25);
  border-radius: 100px;
  padding: 3px 10px;
  margin-bottom: 16px;
}
.plan-name {
  font-family: var(--f-display);
  font-size: 20px;
  font-weight: 800;
  color: var(--t1);
  margin-bottom: 8px;
}
.plan-price {
  display: flex;
  align-items: baseline;
  gap: 3px;
  margin-bottom: 12px;
}
.plan-price strong {
  font-family: var(--f-mono);
  font-size: 40px;
  font-weight: 800;
  color: var(--t1);
  letter-spacing: -0.04em;
}
.plan-price span { font-size: 14px; color: var(--t3); }
.plan-desc { font-size: 13px; color: var(--t2); line-height: 1.6; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid var(--border); }
.plan-feats {
  list-style: none;
  padding: 0;
  margin: 0 0 28px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.plan-feats li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--t2);
}
.plan-btn {
  width: 100%;
  background: rgba(59,91,219,0.07);
  border: 1px solid var(--border2);
  color: var(--t1);
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  padding: 13px;
  border-radius: 100px;
  transition: background .2s, border-color .2s, transform .2s;
}
.plan-btn:hover { background: rgba(59,91,219,0.13); transform: translateY(-1px); }
.plan-btn.gold { background: var(--gold); border-color: transparent; color: #ffffff; }
.plan-btn.gold:hover { opacity: 0.9; }

/* ── FAQ ───────────────────────────────────────────────────────────── */
.faq-section { }
.faq-inner .sec-header { margin-bottom: 48px; }
.faq-list {
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.faq-item {
  border: 1px solid var(--border);
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  margin-bottom: 8px;
  transition: border-color .2s;
}
.faq-item:hover, .faq-item.open { border-color: var(--border2); }
.faq-q {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  font-size: 15px;
  font-weight: 500;
  color: var(--t1);
  gap: 16px;
}
.faq-arrow {
  color: var(--t3);
  flex-shrink: 0;
  transition: transform .25s;
}
.faq-arrow.open { transform: rotate(180deg); color: var(--gold); }
.faq-a {
  padding: 0 24px 20px;
  font-size: 14px;
  color: var(--t2);
  line-height: 1.7;
}

/* ── CTA SECTION ───────────────────────────────────────────────────── */
.cta-section { padding: clamp(60px, 8vw, 100px) 0; }
.cta-card {
  position: relative;
  background:
    radial-gradient(ellipse 80% 60% at 50% 0%, #2a2030 0%, transparent 70%),
    radial-gradient(ellipse 60% 80% at 100% 100%, #1f1a26 0%, transparent 70%),
    linear-gradient(135deg, #191518 0%, #1d171c 100%);
  border: 1px solid rgba(118,141,251,0.18);
  border-radius: 28px;
  padding: clamp(56px, 7vw, 96px) clamp(28px, 5vw, 64px);
  text-align: center;
  overflow: hidden;
  isolation: isolate;
  box-shadow:
    0 0 0 1px rgba(255,255,255,0.04),
    0 30px 80px -20px rgba(25,21,24,0.55),
    0 14px 36px -12px rgba(59,91,219,0.28),
    inset 0 1px 0 rgba(255,255,255,0.06);
}

/* Subtle grid texture overlay */
.cta-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(250,250,250,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(250,250,250,0.025) 1px, transparent 1px);
  background-size: 36px 36px;
  mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, #000 0%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, #000 0%, transparent 75%);
  pointer-events: none;
  z-index: 0;
}

/* Floating colored orbs */
.cta-orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(60px);
  z-index: 0;
  will-change: transform;
}
.cta-orb-1 {
  top: -20%;
  left: -8%;
  width: 320px;
  height: 320px;
  background: radial-gradient(circle, rgba(118,141,251,0.45) 0%, transparent 70%);
  animation: cta-orb 14s ease-in-out infinite;
}
.cta-orb-2 {
  bottom: -25%;
  right: -10%;
  width: 360px;
  height: 360px;
  background: radial-gradient(circle, rgba(59,91,219,0.32) 0%, transparent 70%);
  animation: cta-orb 18s ease-in-out -6s infinite reverse;
}
.cta-orb-3 {
  top: 30%;
  right: 12%;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(138,160,255,0.28) 0%, transparent 70%);
  animation: cta-orb 12s ease-in-out -3s infinite;
}
@keyframes cta-orb {
  0%,100% { transform: translate(0,0) scale(1); }
  50%     { transform: translate(30px, -22px) scale(1.1); }
}

/* AI badge */
.cta-badge {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px 7px 12px;
  background: rgba(250,250,250,0.06);
  border: 1px solid rgba(118,141,251,0.30);
  color: #fafafa;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  margin-bottom: 28px;
  backdrop-filter: blur(8px);
  box-shadow: 0 0 24px rgba(118,141,251,0.18);
}
.cb-spark {
  display: inline-flex;
  color: #8aa0ff;
  filter: drop-shadow(0 0 4px rgba(118,141,251,0.7));
  animation: hb-twinkle 3.2s ease-in-out infinite;
}
@keyframes hb-twinkle {
  0%,100% { transform: scale(1) rotate(0deg); opacity: 1; }
  50%     { transform: scale(1.18) rotate(20deg); opacity: 0.85; }
}
.cb-pulse {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #5ee7b0;
  box-shadow: 0 0 0 0 rgba(94,231,176,0.55);
  animation: pulse-ring 2s infinite;
}

/* Title matches .sec-title sizing, two-color non-italic */
.cta-title {
  position: relative;
  z-index: 1;
  font-family: var(--f-display);
  font-size: clamp(34px, 4.5vw, 58px);
  font-weight: 800;
  color: #fafafa;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin: 0 auto 16px;
  max-width: 820px;
}
.ct-lead { display: block; }
.ct-accent-wrap {
  position: relative;
  display: inline-block;
}
.ct-accent {
  font-style: normal;
  font-weight: 800;
  letter-spacing: inherit;
  background: linear-gradient(135deg, #a8b8ff 0%, #768dfb 50%, #3b5bdb 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.ct-swash {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -0.12em;
  width: 100%;
  height: 0.16em;
  pointer-events: none;
  stroke-dasharray: 700;
  stroke-dashoffset: 700;
}
.cta-card.reveal.in .ct-swash {
  animation: swash-draw 1.5s 0.4s cubic-bezier(.6,.05,.2,1) forwards;
}
@keyframes swash-draw {
  to { stroke-dashoffset: 0; }
}

.cta-sub {
  position: relative;
  z-index: 1;
  font-size: clamp(15px, 1.35vw, 17.5px);
  color: rgba(250,250,250,0.66);
  line-height: 1.65;
  max-width: 540px;
  margin: 0 auto 38px;
  font-weight: 400;
}

/* Conversion CTA */
.btn-cta-main {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: #4865e1;
  color: #ffffff;
  border: none;
  font-size: 15.5px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  padding: 17px 28px 17px 32px;
  border-radius: 100px;
  letter-spacing: -0.01em;
  transition: opacity 0.2s, transform 0.2s;
}
.btn-cta-main:hover {
  opacity: 0.88;
  transform: translateY(-2px);
}
.cb-arrow { display: inline-flex; }

/* Microcopy with checkmarks — stacked below button */
.cta-note {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px 14px;
  margin-top: 22px;
  font-size: 12.5px;
  color: rgba(250,250,250,0.62);
  letter-spacing: -0.005em;
}
.cn-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}
.cn-dot {
  color: rgba(250,250,250,0.25);
  font-weight: 700;
}

/* RTL */
[dir="rtl"] .ct-swash { transform: scaleX(-1); }

/* ── FOOTER ────────────────────────────────────────────────────────── */
.footer {
  border-top: 1px solid var(--border);
  padding: 60px 0 0;
  background: var(--bg);
}
.footer-inner {
  display: flex;
  align-items: flex-start;
  gap: 60px;
  margin-bottom: 48px;
}
.footer-brand { flex: 1; }
.footer-tagline { font-size: 13px; color: var(--t3); line-height: 1.6; max-width: 300px; margin-top: 12px; }
.footer-cols {
  display: flex;
  gap: 60px;
  flex-shrink: 0;
}
.footer-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.footer-heading {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--t3);
  margin-bottom: 6px;
}
.footer-col a {
  text-decoration: none;
  font-size: 13px;
  color: var(--t2);
  transition: color .2s;
}
.footer-col a:hover { color: var(--t1); }
.footer-bottom {
  border-top: 1px solid var(--border);
  padding: 20px clamp(20px, 5vw, 60px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: var(--t3);
}

/* ── TRANSITIONS ───────────────────────────────────────────────────── */
.fade-down-enter-active, .fade-down-leave-active { transition: opacity .18s, transform .18s; }
.fade-down-enter-from, .fade-down-leave-to { opacity: 0; transform: translateY(-6px); }

/* ── RESPONSIVE ────────────────────────────────────────────────────── */
@media (max-width: 960px) {
  .nav-links { display: none; }
  .nav-actions .nav-login, .nav-actions .nav-cta { display: none; }
  .hamburger { display: flex; }
  .mobile-drawer.open { display: flex; }

  .hero-inner { grid-template-columns: 1fr; text-align: center; }
  .hero-phone { display: none; }
  .hero-sub, .hero-h1 { max-width: 100%; }
  .hero-btns { justify-content: center; }
  .hero-stats { justify-content: center; }

  .feat-grid { grid-template-columns: 1fr 1fr; }
  .ai-layout { grid-template-columns: 1fr; }
  .dash-layout { grid-template-columns: 1fr; }
  .qr-layout { grid-template-columns: 1fr; }
  .qr-visual { order: -1; }
  .multi-layout { grid-template-columns: 1fr; }
  .how-steps { flex-direction: column; }
  .how-arrow { display: none; }
  .pricing-grid { grid-template-columns: 1fr; max-width: 420px; margin: 0 auto; }
  .dash-metrics { grid-template-columns: 1fr 1fr; }
  .footer-inner { flex-direction: column; gap: 32px; }
  .footer-cols { gap: 32px; }
  .chip-top { left: 8%; }
  .chip-bot { right: 8%; }
}

@media (max-width: 640px) {
  .feat-grid { grid-template-columns: 1fr; }
  .footer-cols { flex-direction: column; gap: 24px; }
  .footer-bottom { flex-direction: column; gap: 8px; text-align: center; }
  .dash-metrics { grid-template-columns: 1fr; gap: 12px; }
  .hero-stats { flex-direction: column; gap: 16px; align-items: center; }
  .stat-div { width: 32px; height: 1px; }
}
</style>
