<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const scrolled = ref(false)
const mobileMenuOpen = ref(false)

const handleScroll = () => {
  scrolled.value = window.scrollY > 30
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
        }
      })
    },
    { threshold: 0.12 },
  )
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const goRegister = () => router.push('/register')
const goLogin = () => router.push('/login')

const faqs = ref([
  { q: 'Is it really free?', a: 'Yes. The Free plan is free forever — no credit card required. You get 1 menu and up to 20 items.', open: false },
  { q: 'How do customers access the menu?', a: 'They scan the QR code with any smartphone camera. No app download required.' , open: false },
  { q: 'Can I update the menu without reprinting QR codes?', a: 'Absolutely. The QR code links to your live menu. Changes appear instantly — no reprinting needed.', open: false },
  { q: 'Does the menu work on all devices?', a: 'Yes. Your digital menu is fully responsive and works on any modern phone, tablet, or desktop.', open: false },
])

const toggleFaq = (i: number) => {
  faqs.value[i].open = !faqs.value[i].open
}
</script>

<template>
  <div class="landing">
    <!-- ─── STICKY HEADER ──────────────────────────────────────── -->
    <header :class="['landing-header', { scrolled }]">
      <div class="header-inner">
        <a href="#" class="logo">
          <span class="logo-icon">Q</span>
          <span class="logo-text">QRmenu</span>
        </a>

        <nav class="desktop-nav">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
        </nav>

        <div class="header-actions">
          <button class="btn-ghost-header" @click="goLogin">Log in</button>
          <button class="btn-primary-header" @click="goRegister">Get Started Free</button>
        </div>

        <button class="mobile-menu-toggle" @click="mobileMenuOpen = !mobileMenuOpen">
          <span :class="['bar', { open: mobileMenuOpen }]"></span>
          <span :class="['bar', { open: mobileMenuOpen }]"></span>
          <span :class="['bar', { open: mobileMenuOpen }]"></span>
        </button>
      </div>

      <div :class="['mobile-menu', { open: mobileMenuOpen }]">
        <a href="#features" @click="mobileMenuOpen = false">Features</a>
        <a href="#how-it-works" @click="mobileMenuOpen = false">How It Works</a>
        <a href="#pricing" @click="mobileMenuOpen = false">Pricing</a>
        <a href="#faq" @click="mobileMenuOpen = false">FAQ</a>
        <hr />
        <button class="btn-ghost-header" @click="goLogin">Log in</button>
        <button class="btn-primary-header full" @click="goRegister">Get Started Free</button>
      </div>
    </header>

    <!-- ─── HERO ──────────────────────────────────────────────── -->
    <section class="hero">
      <div class="hero-grid-bg"></div>
      <div class="hero-glow"></div>

      <div class="hero-inner">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-dot"></span>
            Free to start · No credit card needed
          </div>

          <h1 class="hero-headline">
            Create Your Digital Menu<br />
            <span class="hero-accent">&amp; QR Code</span> in Minutes
          </h1>

          <p class="hero-sub">
            No design skills needed. Build, customize, and share your menu instantly. Your customers scan, you save.
          </p>

          <div class="hero-actions">
            <button class="cta-primary" @click="goRegister">
              Create Your Free Menu
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <a href="#how-it-works" class="cta-secondary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8" fill="currentColor"/></svg>
              See Demo
            </a>
          </div>

          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-num">500+</span>
              <span class="stat-label">Restaurants</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-num">50K+</span>
              <span class="stat-label">Monthly scans</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-num">2 min</span>
              <span class="stat-label">Setup time</span>
            </div>
          </div>
        </div>

        <!-- Phone Mockup -->
        <div class="hero-phone-wrap">
          <div class="phone-glow-ring"></div>
          <div class="phone">
            <div class="phone-notch"></div>
            <div class="phone-screen">
              <!-- Menu Header -->
              <div class="mock-header">
                <div class="mock-logo-circle">🍕</div>
                <div>
                  <div class="mock-restaurant-name">La Bella Cucina</div>
                  <div class="mock-restaurant-sub">Italian Restaurant</div>
                </div>
              </div>
              <!-- Categories -->
              <div class="mock-cats">
                <span class="mock-cat active">Starters</span>
                <span class="mock-cat">Pizza</span>
                <span class="mock-cat">Pasta</span>
                <span class="mock-cat">Desserts</span>
              </div>
              <!-- Items -->
              <div class="mock-items">
                <div class="mock-item">
                  <div class="mock-item-img">🥗</div>
                  <div class="mock-item-info">
                    <div class="mock-item-name">Caesar Salad</div>
                    <div class="mock-item-desc">Romaine, parmesan, croutons</div>
                    <div class="mock-item-price">$12.90</div>
                  </div>
                  <button class="mock-add">+</button>
                </div>
                <div class="mock-item">
                  <div class="mock-item-img">🍞</div>
                  <div class="mock-item-info">
                    <div class="mock-item-name">Bruschetta</div>
                    <div class="mock-item-desc">Tomato, basil, garlic</div>
                    <div class="mock-item-price">$9.50</div>
                  </div>
                  <button class="mock-add">+</button>
                </div>
                <div class="mock-item">
                  <div class="mock-item-img">🦑</div>
                  <div class="mock-item-info">
                    <div class="mock-item-name">Calamari</div>
                    <div class="mock-item-desc">Fried squid, lemon aioli</div>
                    <div class="mock-item-price">$14.00</div>
                  </div>
                  <button class="mock-add">+</button>
                </div>
              </div>
              <!-- QR hint -->
              <div class="mock-qr-bar">
                <svg width="28" height="28" viewBox="0 0 80 80" fill="none">
                  <rect x="4" y="4" width="28" height="28" rx="4" stroke="#768dfb" stroke-width="5"/>
                  <rect x="14" y="14" width="8" height="8" fill="#768dfb"/>
                  <rect x="48" y="4" width="28" height="28" rx="4" stroke="#768dfb" stroke-width="5"/>
                  <rect x="58" y="14" width="8" height="8" fill="#768dfb"/>
                  <rect x="4" y="48" width="28" height="28" rx="4" stroke="#768dfb" stroke-width="5"/>
                  <rect x="14" y="58" width="8" height="8" fill="#768dfb"/>
                  <rect x="48" y="52" width="6" height="6" fill="#768dfb"/>
                  <rect x="58" y="48" width="6" height="6" fill="#768dfb"/>
                  <rect x="66" y="56" width="6" height="6" fill="#768dfb"/>
                  <rect x="48" y="62" width="6" height="6" fill="#768dfb"/>
                  <rect x="58" y="68" width="14" height="6" fill="#768dfb"/>
                </svg>
                <span>Scan to view menu</span>
              </div>
            </div>
            <div class="phone-home-bar"></div>
          </div>
          <!-- Floating badges -->
          <div class="float-badge badge-top">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Menu updated live!
          </div>
          <div class="float-badge badge-bot">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#768dfb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            QR ready in 2 min
          </div>
        </div>
      </div>
    </section>

    <!-- ─── SOCIAL PROOF ──────────────────────────────────────── -->
    <section class="logos-strip reveal">
      <p class="logos-label">Trusted by restaurants worldwide</p>
      <div class="logos-row">
        <div class="logo-chip">🍝 Bella Roma</div>
        <div class="logo-chip">🍣 Sakura House</div>
        <div class="logo-chip">🍔 Burger District</div>
        <div class="logo-chip">☕ The Brew Co.</div>
        <div class="logo-chip">🥩 Steakwood</div>
        <div class="logo-chip">🌮 Taco Verde</div>
      </div>
    </section>

    <!-- ─── PROBLEM ───────────────────────────────────────────── -->
    <section class="problem-section" id="problem">
      <div class="section-inner">
        <div class="section-tag reveal">The Old Way</div>
        <h2 class="section-title reveal">Still using<br /><span class="accent-underline">printed menus?</span></h2>
        <p class="section-sub reveal">
          Physical menus are costing you more than you think — in time, money, and customer experience.
        </p>
        <div class="problem-grid">
          <div class="problem-card reveal">
            <div class="problem-icon">💸</div>
            <h3>Printing costs money</h3>
            <p>Laminated menus wear out fast. Every price update means a new print run — $100s wasted per year.</p>
          </div>
          <div class="problem-card reveal">
            <div class="problem-icon">⏳</div>
            <h3>Hard to update prices</h3>
            <p>Changed a price? Sold out an item? With printed menus you're stuck with crossed-out lines and embarrassing corrections.</p>
          </div>
          <div class="problem-card reveal">
            <div class="problem-icon">😤</div>
            <h3>Poor customer experience</h3>
            <p>Sticky, worn, unreadable menus leave bad first impressions. In 2024 customers expect better — and your competitors offer it.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── FEATURES ──────────────────────────────────────────── -->
    <section class="features-section" id="features">
      <div class="section-inner">
        <div class="section-tag reveal">Features</div>
        <h2 class="section-title reveal">Everything you need<br />to go digital</h2>
        <p class="section-sub reveal">
          QRmenu gives you all the tools to create, manage, and share a professional digital menu — without any technical skills.
        </p>
        <div class="features-grid">
          <div class="feature-card reveal">
            <div class="feature-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </div>
            <h3>Visual Menu Builder</h3>
            <p>Drag-and-drop editor. Add categories, items, photos, prices — no coding.</p>
          </div>
          <div class="feature-card reveal">
            <div class="feature-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h.01M14 17h.01M17 14h.01M20 14h.01M17 17v3M20 17v3M17 20h3"/></svg>
            </div>
            <h3>Instant QR Codes</h3>
            <p>Generate branded QR codes in one click. Download, print, and place them on tables.</p>
          </div>
          <div class="feature-card reveal">
            <div class="feature-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3>Variants &amp; Extras</h3>
            <p>Support for sizes, spice levels, add-ons — everything your menu needs handled cleanly.</p>
          </div>
          <div class="feature-card reveal">
            <div class="feature-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
            </div>
            <h3>Mobile Optimized</h3>
            <p>Your menu looks perfect on every phone, tablet, or device. No app download required.</p>
          </div>
          <div class="feature-card reveal">
            <div class="feature-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
            </div>
            <h3>Real-Time Updates</h3>
            <p>Update prices, availability, and items instantly. Changes are live in seconds.</p>
          </div>
          <div class="feature-card reveal">
            <div class="feature-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
            </div>
            <h3>Multiple Menus</h3>
            <p>Lunch, dinner, cocktails — manage multiple menus for the same business, all in one place.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── HOW IT WORKS ──────────────────────────────────────── -->
    <section class="hiw-section" id="how-it-works">
      <div class="section-inner">
        <div class="section-tag reveal">How It Works</div>
        <h2 class="section-title reveal">Live in 3 simple steps</h2>
        <p class="section-sub reveal">
          From zero to a live digital menu in under 5 minutes.
        </p>
        <div class="hiw-steps">
          <div class="hiw-step reveal">
            <div class="step-number">01</div>
            <div class="step-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <h3>Create your account</h3>
            <p>Sign up free in 30 seconds. No credit card, no setup fees. Just your email and you're in.</p>
          </div>
          <div class="hiw-connector reveal"></div>
          <div class="hiw-step reveal">
            <div class="step-number">02</div>
            <div class="step-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </div>
            <h3>Build your menu</h3>
            <p>Add your restaurant details, create categories, and fill in your items with photos and prices.</p>
          </div>
          <div class="hiw-connector reveal"></div>
          <div class="hiw-step reveal">
            <div class="step-number">03</div>
            <div class="step-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h.01M14 17h.01M17 14h.01M20 14h.01M17 17v3M20 17v3M17 20h3"/></svg>
            </div>
            <h3>Share your QR code</h3>
            <p>Download your QR code, print it, and place it on your tables. Done — customers can scan immediately.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── TESTIMONIALS ──────────────────────────────────────── -->
    <section class="testimonials-section">
      <div class="section-inner">
        <div class="section-tag reveal">Testimonials</div>
        <h2 class="section-title reveal">Loved by restaurant owners</h2>
        <div class="testimonials-grid">
          <div class="testimonial-card reveal">
            <div class="stars">★★★★★</div>
            <p>"We switched from printed menus and haven't looked back. Updating prices now takes 10 seconds instead of waiting 3 days for reprints."</p>
            <div class="testimonial-author">
              <div class="author-avatar" style="background: #768dfb22; color: #768dfb;">MA</div>
              <div>
                <div class="author-name">Marco Andreotti</div>
                <div class="author-role">Owner, Bella Roma — Milan</div>
              </div>
            </div>
          </div>
          <div class="testimonial-card reveal">
            <div class="stars">★★★★★</div>
            <p>"My customers love it. No more 'sorry, that's not available anymore'. I update the menu from my phone and it's live instantly. Game changer."</p>
            <div class="testimonial-author">
              <div class="author-avatar" style="background: #d8d8d822; color: #555;">SR</div>
              <div>
                <div class="author-name">Sofia Ramirez</div>
                <div class="author-role">Manager, El Patio — Barcelona</div>
              </div>
            </div>
          </div>
          <div class="testimonial-card reveal">
            <div class="stars">★★★★★</div>
            <p>"Set up our entire café menu in 20 minutes. The QR code works perfectly, the menu looks beautiful, and it cost us nothing to start."</p>
            <div class="testimonial-author">
              <div class="author-avatar" style="background: #19151822; color: #191518;">KT</div>
              <div>
                <div class="author-name">Kenji Takahashi</div>
                <div class="author-role">Owner, Brewed Horizons — Tokyo</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── PRICING ───────────────────────────────────────────── -->
    <section class="pricing-section" id="pricing">
      <div class="section-inner">
        <div class="section-tag reveal">Pricing</div>
        <h2 class="section-title reveal">Simple, honest pricing</h2>
        <p class="section-sub reveal">Start free. Upgrade when you're ready.</p>
        <div class="pricing-grid">
          <div class="pricing-card reveal">
            <div class="plan-name">Free</div>
            <div class="plan-price">$0<span>/month</span></div>
            <p class="plan-desc">Perfect for getting started. No credit card needed.</p>
            <ul class="plan-features">
              <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> 1 menu</li>
              <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Up to 20 items</li>
              <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> QR code generation</li>
              <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Mobile-friendly menu</li>
              <li class="feature-off"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d8d8d8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Custom branding</li>
              <li class="feature-off"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d8d8d8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Analytics</li>
            </ul>
            <button class="plan-cta-outline" @click="goRegister">Get Started Free</button>
          </div>

          <div class="pricing-card featured reveal">
            <div class="plan-badge">Most Popular</div>
            <div class="plan-name">Pro</div>
            <div class="plan-price">$19<span>/month</span></div>
            <p class="plan-desc">For growing restaurants that need more power.</p>
            <ul class="plan-features">
              <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#768dfb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Unlimited menus</li>
              <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#768dfb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Unlimited items</li>
              <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#768dfb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> QR code generation</li>
              <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#768dfb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Mobile-friendly menu</li>
              <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#768dfb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Custom branding</li>
              <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#768dfb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Analytics &amp; scan stats</li>
            </ul>
            <button class="plan-cta-filled" @click="goRegister">Start Free Trial</button>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── FAQ ───────────────────────────────────────────────── -->
    <section class="faq-section" id="faq">
      <div class="section-inner faq-inner">
        <div>
          <div class="section-tag reveal">FAQ</div>
          <h2 class="section-title reveal" style="text-align:left">Common questions</h2>
          <p class="section-sub reveal" style="text-align:left;margin-left:0">
            Everything you need to know before getting started.
          </p>
        </div>
        <div class="faq-list reveal">
          <div
            v-for="(item, i) in faqs"
            :key="i"
            class="faq-item"
            :class="{ open: item.open }"
            @click="toggleFaq(i)"
          >
            <div class="faq-q">
              {{ item.q }}
              <svg :class="['faq-arrow', { rotated: item.open }]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            <div class="faq-a" v-show="item.open">{{ item.a }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── FINAL CTA ─────────────────────────────────────────── -->
    <section class="final-cta">
      <div class="final-cta-glow"></div>
      <div class="section-inner" style="position:relative;z-index:1;text-align:center">
        <h2 class="final-cta-title reveal">Ready to go digital?</h2>
        <p class="final-cta-sub reveal">
          Join 500+ restaurants already using QRmenu. Free to start, no credit card required.
        </p>
        <button class="cta-primary large reveal" @click="goRegister">
          Create Your Free Menu
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
        <p class="final-cta-note reveal">Free forever plan available · No credit card · Setup in 2 min</p>
      </div>
    </section>

    <!-- ─── FOOTER ────────────────────────────────────────────── -->
    <footer class="landing-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <a href="#" class="logo">
            <span class="logo-icon">Q</span>
            <span class="logo-text" style="color:#fafafa">QRmenu</span>
          </a>
          <p>The easiest way to create digital menus and QR codes for your restaurant.</p>
        </div>
        <div class="footer-links">
          <div class="footer-col">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#how-it-works">How It Works</a>
          </div>
          <div class="footer-col">
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Blog</a>
            <a href="#">Contact</a>
          </div>
          <div class="footer-col">
            <h4>Legal</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2024 QRmenu. All rights reserved.</span>
        <span>Made with ♥ for restaurants everywhere.</span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* ── VARIABLES ──────────────────────────────────────── */
.landing {
  --brand: #768dfb;
  --brand-dark: #5b73e8;
  --dark: #191518;
  --bg: #fafafa;
  --muted: #d8d8d8;
  --text: #191518;
  --text-mid: #5a5a6a;
  --radius: 16px;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  color: var(--text);
  background: var(--bg);
  overflow-x: hidden;
}

/* ── REVEAL ANIMATIONS ──────────────────────────────── */
.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.55s ease, transform 0.55s ease;
}
.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* ── HEADER ─────────────────────────────────────────── */
.landing-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transition: background 0.25s, box-shadow 0.25s, backdrop-filter 0.25s;
  padding: 0 24px;
}
.landing-header.scrolled {
  background: rgba(250, 250, 250, 0.9);
  backdrop-filter: blur(12px);
  box-shadow: 0 1px 0 rgba(0,0,0,0.07);
}
.header-inner {
  max-width: 1140px;
  margin: 0 auto;
  height: 68px;
  display: flex;
  align-items: center;
  gap: 32px;
}
.logo {
  display: flex;
  align-items: center;
  gap: 9px;
  text-decoration: none;
  flex-shrink: 0;
}
.logo-icon {
  width: 34px;
  height: 34px;
  background: var(--brand);
  color: #fff;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 17px;
  font-family: 'Syne', sans-serif;
}
.logo-text {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 18px;
  color: var(--text);
}
.desktop-nav {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}
.desktop-nav a {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-mid);
  text-decoration: none;
  padding: 6px 14px;
  border-radius: 8px;
  transition: color 0.15s, background 0.15s;
}
.desktop-nav a:hover { color: var(--text); background: rgba(0,0,0,0.04); }
.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.btn-ghost-header {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-mid);
  background: transparent;
  border: none;
  padding: 8px 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: color 0.15s, background 0.15s;
  font-family: inherit;
}
.btn-ghost-header:hover { color: var(--text); background: rgba(0,0,0,0.04); }
.btn-primary-header {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  background: var(--brand);
  border: none;
  padding: 9px 20px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
  font-family: inherit;
}
.btn-primary-header:hover { background: var(--brand-dark); transform: translateY(-1px); }
.btn-primary-header.full { width: 100%; justify-content: center; }
.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  margin-left: auto;
}
.bar {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--text);
  border-radius: 2px;
  transition: transform 0.25s, opacity 0.25s;
}
.mobile-menu {
  display: none;
  flex-direction: column;
  gap: 4px;
  padding: 12px 0 20px;
  border-top: 1px solid rgba(0,0,0,0.06);
  background: rgba(250,250,250,0.97);
  backdrop-filter: blur(12px);
}
.mobile-menu a {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-mid);
  text-decoration: none;
  padding: 10px 16px;
  border-radius: 8px;
  transition: color 0.15s;
}
.mobile-menu a:hover { color: var(--text); }
.mobile-menu hr { border: none; border-top: 1px solid rgba(0,0,0,0.07); margin: 8px 0; }

@media (max-width: 768px) {
  .desktop-nav, .header-actions { display: none; }
  .mobile-menu-toggle { display: flex; }
  .mobile-menu.open { display: flex; }
}

/* ── HERO ────────────────────────────────────────────── */
.hero {
  background: var(--dark);
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 120px 24px 80px;
  position: relative;
  overflow: hidden;
}
.hero-grid-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(118,141,251,0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(118,141,251,0.06) 1px, transparent 1px);
  background-size: 48px 48px;
}
.hero-glow {
  position: absolute;
  top: -150px;
  right: -100px;
  width: 700px;
  height: 700px;
  background: radial-gradient(circle, rgba(118,141,251,0.18) 0%, transparent 65%);
  pointer-events: none;
}
.hero-inner {
  max-width: 1140px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
  position: relative;
  z-index: 1;
  width: 100%;
}
.hero-content { display: flex; flex-direction: column; gap: 28px; }
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(118,141,251,0.12);
  border: 1px solid rgba(118,141,251,0.25);
  color: var(--brand);
  font-size: 13px;
  font-weight: 600;
  padding: 7px 16px;
  border-radius: 999px;
  width: fit-content;
  animation: fadeSlideUp 0.6s ease both;
}
.badge-dot {
  width: 7px; height: 7px;
  background: #22c55e;
  border-radius: 50%;
  box-shadow: 0 0 6px #22c55e;
  animation: pulse 2s infinite;
}
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
.hero-headline {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: clamp(2.2rem, 5vw, 3.4rem);
  line-height: 1.1;
  color: #ffffff;
  margin: 0;
  animation: fadeSlideUp 0.6s 0.1s ease both;
}
.hero-accent { color: var(--brand); }
.hero-sub {
  font-size: 18px;
  line-height: 1.65;
  color: rgba(250,250,250,0.6);
  margin: 0;
  max-width: 500px;
  animation: fadeSlideUp 0.6s 0.2s ease both;
}
.hero-actions {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  animation: fadeSlideUp 0.6s 0.3s ease both;
}
.cta-primary {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  background: var(--brand);
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  padding: 14px 28px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
  box-shadow: 0 4px 20px rgba(118,141,251,0.35);
}
.cta-primary:hover {
  background: var(--brand-dark);
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(118,141,251,0.45);
}
.cta-primary.large { font-size: 17px; padding: 16px 32px; border-radius: 14px; }
.cta-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: rgba(250,250,250,0.75);
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  padding: 13px 20px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.15);
  transition: color 0.15s, border-color 0.15s, background 0.15s;
  font-family: inherit;
}
.cta-secondary:hover {
  color: #fff;
  border-color: rgba(255,255,255,0.3);
  background: rgba(255,255,255,0.06);
}
.hero-stats {
  display: flex;
  align-items: center;
  gap: 20px;
  animation: fadeSlideUp 0.6s 0.4s ease both;
  padding-top: 4px;
}
.stat-item { display: flex; flex-direction: column; gap: 2px; }
.stat-num {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 22px;
  color: #fff;
}
.stat-label { font-size: 12px; color: rgba(250,250,250,0.5); font-weight: 500; }
.stat-divider { width: 1px; height: 36px; background: rgba(255,255,255,0.12); }
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ── PHONE MOCKUP ───────────────────────────────────── */
.hero-phone-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  animation: fadeSlideUp 0.7s 0.2s ease both;
}
.phone-glow-ring {
  position: absolute;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(118,141,251,0.2) 0%, transparent 70%);
  pointer-events: none;
}
.phone {
  width: 260px;
  height: 540px;
  background: #0e0c11;
  border-radius: 40px;
  border: 6px solid rgba(255,255,255,0.1);
  box-shadow:
    0 40px 80px rgba(0,0,0,0.6),
    inset 0 1px 0 rgba(255,255,255,0.08),
    0 0 0 1px rgba(255,255,255,0.05);
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}
.phone-notch {
  width: 100px;
  height: 26px;
  background: #0e0c11;
  border-radius: 0 0 18px 18px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}
.phone-screen {
  flex: 1;
  background: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin: -2px 4px 4px;
  border-radius: 4px 4px 28px 28px;
}
.phone-home-bar {
  width: 100px;
  height: 4px;
  background: rgba(255,255,255,0.25);
  border-radius: 2px;
  margin: 6px auto 8px;
}
.mock-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 14px 10px;
  border-bottom: 1px solid #f0f0f0;
}
.mock-logo-circle {
  width: 38px; height: 38px;
  background: #768dfb15;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px;
}
.mock-restaurant-name { font-size: 13px; font-weight: 700; color: #191518; }
.mock-restaurant-sub { font-size: 10px; color: #d8d8d8; font-weight: 500; }
.mock-cats {
  display: flex;
  gap: 6px;
  padding: 10px 14px;
  overflow-x: auto;
  border-bottom: 1px solid #f0f0f0;
}
.mock-cat {
  font-size: 10px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
  background: #f4f4f6;
  color: #777;
  white-space: nowrap;
  cursor: pointer;
}
.mock-cat.active { background: #768dfb; color: #fff; }
.mock-items { flex: 1; overflow: hidden; padding: 8px 0; }
.mock-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
}
.mock-item-img {
  width: 40px; height: 40px;
  background: #f7f7f9;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}
.mock-item-info { flex: 1; min-width: 0; }
.mock-item-name { font-size: 11px; font-weight: 700; color: #191518; }
.mock-item-desc { font-size: 9px; color: #d8d8d8; margin-top: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mock-item-price { font-size: 11px; font-weight: 700; color: #768dfb; margin-top: 2px; }
.mock-add {
  width: 24px; height: 24px;
  background: #768dfb;
  color: #fff;
  border: none;
  border-radius: 7px;
  font-size: 16px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700;
  line-height: 1;
  flex-shrink: 0;
}
.mock-qr-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: #f7f7fb;
  border-top: 1px solid #f0f0f0;
  font-size: 9px;
  font-weight: 600;
  color: #888;
}
.float-badge {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 6px;
  background: #fff;
  border: 1px solid rgba(0,0,0,0.07);
  box-shadow: 0 4px 20px rgba(0,0,0,0.12);
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text);
  white-space: nowrap;
  animation: floatBadge 3s ease-in-out infinite;
}
.badge-top { top: 40px; right: -20px; animation-delay: 0s; }
.badge-bot { bottom: 60px; left: -20px; animation-delay: 1.5s; }
@keyframes floatBadge {
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@media (max-width: 900px) {
  .hero-inner { grid-template-columns: 1fr; gap: 48px; }
  .hero-phone-wrap { order: -1; }
  .phone { width: 220px; height: 440px; }
  .badge-top { right: 0; }
  .badge-bot { left: 0; }
}
@media (max-width: 480px) {
  .hero { padding: 100px 20px 60px; }
  .hero-headline { font-size: 2rem; }
  .cta-primary { font-size: 15px; padding: 13px 22px; }
}

/* ── SHARED SECTION STYLES ──────────────────────────── */
.section-inner {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 24px;
}
.section-tag {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--brand);
  background: rgba(118,141,251,0.1);
  padding: 5px 14px;
  border-radius: 999px;
  margin-bottom: 20px;
}
.section-title {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: clamp(2rem, 4vw, 2.8rem);
  line-height: 1.15;
  color: var(--text);
  margin: 0 0 20px;
  text-align: center;
}
.accent-underline {
  position: relative;
  display: inline-block;
  color: var(--brand);
}
.section-sub {
  font-size: 17px;
  line-height: 1.65;
  color: var(--text-mid);
  max-width: 560px;
  margin: 0 auto 52px;
  text-align: center;
}

/* ── LOGOS STRIP ────────────────────────────────────── */
.logos-strip {
  background: var(--bg);
  border-top: 1px solid rgba(0,0,0,0.06);
  border-bottom: 1px solid rgba(0,0,0,0.06);
  padding: 32px 24px;
  text-align: center;
}
.logos-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--muted);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 20px;
}
.logos-row {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  max-width: 860px;
  margin: 0 auto;
}
.logo-chip {
  font-size: 13px;
  font-weight: 600;
  color: #888;
  background: #fff;
  border: 1px solid rgba(0,0,0,0.07);
  padding: 8px 20px;
  border-radius: 999px;
  transition: color 0.15s, border-color 0.15s;
}
.logo-chip:hover { color: var(--text); border-color: rgba(0,0,0,0.15); }

/* ── PROBLEM ────────────────────────────────────────── */
.problem-section {
  padding: 100px 24px;
  background: var(--bg);
  text-align: center;
}
.problem-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 16px;
}
.problem-card {
  background: #fff;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 20px;
  padding: 36px 28px;
  text-align: left;
  transition: box-shadow 0.2s, transform 0.2s;
}
.problem-card:hover {
  box-shadow: 0 8px 32px rgba(0,0,0,0.07);
  transform: translateY(-3px);
}
.problem-icon {
  font-size: 36px;
  margin-bottom: 18px;
}
.problem-card h3 {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 18px;
  margin: 0 0 10px;
  color: var(--text);
}
.problem-card p {
  font-size: 14px;
  line-height: 1.65;
  color: var(--text-mid);
  margin: 0;
}
@media (max-width: 768px) {
  .problem-grid { grid-template-columns: 1fr; }
}

/* ── FEATURES ───────────────────────────────────────── */
.features-section {
  padding: 100px 24px;
  background: var(--dark);
  text-align: center;
}
.features-section .section-title { color: #fff; }
.features-section .section-sub { color: rgba(250,250,250,0.55); }
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.feature-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px;
  padding: 32px 28px;
  text-align: left;
  transition: background 0.2s, border-color 0.2s, transform 0.2s;
}
.feature-card:hover {
  background: rgba(118,141,251,0.07);
  border-color: rgba(118,141,251,0.2);
  transform: translateY(-3px);
}
.feature-icon-wrap {
  width: 48px; height: 48px;
  background: rgba(118,141,251,0.12);
  border-radius: 13px;
  display: flex; align-items: center; justify-content: center;
  color: var(--brand);
  margin-bottom: 18px;
}
.feature-card h3 {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 17px;
  color: #fff;
  margin: 0 0 10px;
}
.feature-card p {
  font-size: 14px;
  line-height: 1.65;
  color: rgba(250,250,250,0.5);
  margin: 0;
}
@media (max-width: 900px) { .features-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 600px) { .features-grid { grid-template-columns: 1fr; } }

/* ── HOW IT WORKS ───────────────────────────────────── */
.hiw-section {
  padding: 100px 24px;
  background: #f3f4ff;
  text-align: center;
}
.hiw-steps {
  display: flex;
  align-items: flex-start;
  gap: 0;
  margin-top: 8px;
}
.hiw-step {
  flex: 1;
  background: #fff;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 20px;
  padding: 36px 28px;
  text-align: center;
  position: relative;
}
.hiw-connector {
  flex: 0 0 48px;
  height: 2px;
  background: linear-gradient(90deg, var(--brand) 0%, transparent 100%);
  margin-top: 80px;
  opacity: 0.3;
}
.step-number {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 13px;
  letter-spacing: 0.08em;
  color: var(--brand);
  margin-bottom: 14px;
}
.step-icon {
  width: 60px; height: 60px;
  background: rgba(118,141,251,0.08);
  border-radius: 16px;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 18px;
  color: var(--brand);
}
.hiw-step h3 {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 18px;
  margin: 0 0 10px;
  color: var(--text);
}
.hiw-step p { font-size: 14px; line-height: 1.65; color: var(--text-mid); margin: 0; }
@media (max-width: 768px) {
  .hiw-steps { flex-direction: column; gap: 16px; }
  .hiw-connector { display: none; }
}

/* ── TESTIMONIALS ───────────────────────────────────── */
.testimonials-section {
  padding: 100px 24px;
  background: var(--bg);
  text-align: center;
}
.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 8px;
}
.testimonial-card {
  background: #fff;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 20px;
  padding: 32px 28px;
  text-align: left;
  transition: box-shadow 0.2s, transform 0.2s;
}
.testimonial-card:hover {
  box-shadow: 0 8px 32px rgba(0,0,0,0.07);
  transform: translateY(-3px);
}
.stars { color: #f59e0b; font-size: 16px; margin-bottom: 14px; letter-spacing: 2px; }
.testimonial-card p {
  font-size: 14px;
  line-height: 1.7;
  color: var(--text-mid);
  margin: 0 0 20px;
}
.testimonial-author { display: flex; align-items: center; gap: 12px; }
.author-avatar {
  width: 38px; height: 38px;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.author-name { font-size: 14px; font-weight: 700; color: var(--text); }
.author-role { font-size: 12px; color: var(--muted); margin-top: 1px; }
@media (max-width: 900px) { .testimonials-grid { grid-template-columns: 1fr; gap: 16px; } }

/* ── PRICING ────────────────────────────────────────── */
.pricing-section {
  padding: 100px 24px;
  background: var(--dark);
  text-align: center;
}
.pricing-section .section-title { color: #fff; }
.pricing-section .section-sub { color: rgba(250,250,250,0.55); }
.pricing-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  max-width: 760px;
  margin: 0 auto;
}
.pricing-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 24px;
  padding: 40px 36px;
  text-align: left;
  position: relative;
  transition: border-color 0.2s;
}
.pricing-card.featured {
  background: rgba(118,141,251,0.1);
  border-color: rgba(118,141,251,0.4);
}
.plan-badge {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--brand);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 16px;
  border-radius: 999px;
  white-space: nowrap;
}
.plan-name {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 18px;
  color: rgba(250,250,250,0.7);
  margin-bottom: 12px;
}
.plan-price {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 48px;
  color: #fff;
  line-height: 1;
  margin-bottom: 12px;
}
.plan-price span { font-size: 16px; font-weight: 500; color: rgba(250,250,250,0.45); }
.plan-desc { font-size: 14px; color: rgba(250,250,250,0.5); margin-bottom: 28px; }
.plan-features {
  list-style: none;
  padding: 0;
  margin: 0 0 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.plan-features li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: rgba(250,250,250,0.8);
  font-weight: 500;
}
.plan-features .feature-off { color: rgba(250,250,250,0.3); }
.plan-cta-outline {
  width: 100%;
  padding: 13px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.2);
  background: transparent;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s, border-color 0.15s;
}
.plan-cta-outline:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.35); }
.plan-cta-filled {
  width: 100%;
  padding: 13px;
  border-radius: 12px;
  border: none;
  background: var(--brand);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s, transform 0.1s;
  box-shadow: 0 4px 20px rgba(118,141,251,0.35);
}
.plan-cta-filled:hover { background: var(--brand-dark); transform: translateY(-1px); }
@media (max-width: 640px) {
  .pricing-grid { grid-template-columns: 1fr; }
}

/* ── FAQ ────────────────────────────────────────────── */
.faq-section {
  padding: 100px 24px;
  background: var(--bg);
}
.faq-inner {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 64px;
  align-items: start;
}
.faq-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.faq-item {
  border-bottom: 1px solid rgba(0,0,0,0.07);
  padding: 20px 0;
  cursor: pointer;
}
.faq-q {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
  user-select: none;
}
.faq-arrow {
  flex-shrink: 0;
  color: var(--muted);
  transition: transform 0.2s;
}
.faq-arrow.rotated { transform: rotate(180deg); color: var(--brand); }
.faq-a {
  font-size: 14px;
  line-height: 1.7;
  color: var(--text-mid);
  padding-top: 10px;
}
@media (max-width: 900px) {
  .faq-inner { grid-template-columns: 1fr; gap: 32px; }
}

/* ── FINAL CTA ──────────────────────────────────────── */
.final-cta {
  padding: 120px 24px;
  background: var(--dark);
  text-align: center;
  position: relative;
  overflow: hidden;
}
.final-cta-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 400px;
  background: radial-gradient(ellipse, rgba(118,141,251,0.2) 0%, transparent 65%);
  pointer-events: none;
}
.final-cta-title {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  color: #fff;
  margin: 0 0 20px;
}
.final-cta-sub {
  font-size: 18px;
  color: rgba(250,250,250,0.55);
  max-width: 480px;
  margin: 0 auto 36px;
  line-height: 1.6;
}
.final-cta-note {
  font-size: 13px;
  color: rgba(250,250,250,0.35);
  margin-top: 16px;
  font-weight: 500;
}

/* ── FOOTER ─────────────────────────────────────────── */
.landing-footer {
  background: #0f0d12;
  padding: 64px 24px 32px;
}
.footer-inner {
  max-width: 1140px;
  margin: 0 auto 48px;
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  gap: 48px;
}
.footer-brand p {
  font-size: 14px;
  line-height: 1.65;
  color: rgba(250,250,250,0.4);
  margin-top: 16px;
  max-width: 240px;
}
.footer-col h4 {
  font-size: 13px;
  font-weight: 700;
  color: rgba(250,250,250,0.7);
  margin: 0 0 16px;
  letter-spacing: 0.04em;
}
.footer-col { display: flex; flex-direction: column; gap: 10px; }
.footer-col a {
  font-size: 14px;
  color: rgba(250,250,250,0.4);
  text-decoration: none;
  transition: color 0.15s;
}
.footer-col a:hover { color: rgba(250,250,250,0.8); }
.footer-bottom {
  max-width: 1140px;
  margin: 0 auto;
  padding-top: 24px;
  border-top: 1px solid rgba(255,255,255,0.06);
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: rgba(250,250,250,0.25);
}
@media (max-width: 900px) {
  .footer-inner { grid-template-columns: 1fr 1fr; gap: 32px; }
}
@media (max-width: 560px) {
  .footer-inner { grid-template-columns: 1fr; }
  .footer-bottom { flex-direction: column; gap: 8px; }
}
</style>
