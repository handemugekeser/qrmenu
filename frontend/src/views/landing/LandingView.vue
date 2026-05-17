<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const scrolled = ref(false)
const mobileOpen = ref(false)

const handleScroll = () => { scrolled.value = window.scrollY > 40 }

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  const io = new IntersectionObserver(
    (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in') }),
    { threshold: 0.1 }
  )
  document.querySelectorAll('.reveal').forEach(el => io.observe(el))
})
onUnmounted(() => window.removeEventListener('scroll', handleScroll))

const goRegister = () => router.push('/register')
const goLogin    = () => router.push('/login')

const faqs = ref([
  { q: 'Gerçekten ücretsiz mi?',          a: 'Evet. Ücretsiz plan sonsuza kadar ücretsizdir, kredi kartı gerekmez. 1 menü ve 20 ürüne kadar kullanabilirsiniz.', open: false },
  { q: 'Müşteriler menüye nasıl ulaşır?', a: 'Herhangi bir akıllı telefon kamerası ile QR kodu tarayarak erişirler. Uygulama indirmeye gerek yoktur.', open: false },
  { q: 'QR kodu yeniden bastırmadan fiyat güncelleyebilir miyim?', a: 'Evet. QR kod canlı menünüze bağlıdır. Değişiklikler anında yansır, yeniden baskı gerekmez.', open: false },
  { q: 'Her cihazda çalışır mı?',          a: 'Dijital menünüz her modern telefon, tablet ve masaüstü tarayıcıda mükemmel görünür.', open: false },
])
const toggleFaq = (i: number) => { faqs.value[i].open = !faqs.value[i].open }

const contactForm = ref({ name: '', email: '', message: '' })
const contactSent = ref(false)
const submitContact = () => {
  if (!contactForm.value.name || !contactForm.value.email || !contactForm.value.message) return
  contactSent.value = true
  setTimeout(() => {
    contactSent.value = false
    contactForm.value = { name: '', email: '', message: '' }
  }, 3000)
}
</script>

<template>
  <div class="land">

    <!-- ══ NAV ══════════════════════════════════════════════════ -->
    <header :class="['nav', { scrolled }]">
      <div class="nav-wrap">
        <a href="#" class="brand">
          <span class="brand-icon"><span class="bi-q">Q</span></span>
          <span class="brand-name">Menusflow</span>
        </a>

        <nav class="nav-links">
          <a href="#features">Özellikler</a>
          <a href="#how">Nasıl Çalışır</a>
          <a href="#pricing">Fiyatlar</a>
          <a href="#faq">SSS</a>
          <a href="#contact">İletişim</a>
        </nav>

        <div class="nav-ctas">
          <button class="btn-ghost" @click="goLogin">Giriş Yap</button>
          <button class="btn-pill" @click="goRegister">Ücretsiz Başla</button>
        </div>

        <button class="hamburger" @click="mobileOpen = !mobileOpen" :class="{ open: mobileOpen }">
          <span /><span /><span />
        </button>
      </div>

      <div :class="['mobile-drawer', { open: mobileOpen }]">
        <a href="#features"  @click="mobileOpen=false">Özellikler</a>
        <a href="#how"       @click="mobileOpen=false">Nasıl Çalışır</a>
        <a href="#pricing"   @click="mobileOpen=false">Fiyatlar</a>
        <a href="#faq"       @click="mobileOpen=false">SSS</a>
        <div class="drawer-foot">
          <button class="btn-ghost w100" @click="goLogin">Giriş Yap</button>
          <button class="btn-pill w100"  @click="goRegister">Ücretsiz Başla</button>
        </div>
      </div>
    </header>

    <!-- ══ HERO ══════════════════════════════════════════════════ -->
    <section class="hero">
      <div class="hero-dots"></div>
      <div class="hero-blob b1"></div>
      <div class="hero-blob b2"></div>

      <div class="hero-wrap">
        <!-- Left -->
        <div class="hero-left">
          <div class="hero-badge">
            <span class="pulse-dot"></span>
            500+ restoran kullanıyor · Ücretsiz başla
          </div>

          <h1 class="hero-h1">
            Dijital Menünü&nbsp;&amp;<br/>
            <em>QR Kodunu</em><br/>
            Dakikalar İçinde Oluştur
          </h1>

          <p class="hero-sub">
            Tasarım bilgisi gerekmez. Menünü oluştur, özelleştir ve anında paylaş. Müşterilerin tara, sen kazan.
          </p>

          <div class="hero-btns">
            <button class="cta-main" @click="goRegister">
              Ücretsiz Menü Oluştur
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <a href="#how" class="cta-ghost">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8" fill="currentColor"/></svg>
              Demo İzle
            </a>
          </div>

          <div class="hero-stats">
            <div class="hs-item">
              <strong>500+</strong>
              <span>Restoran</span>
            </div>
            <div class="hs-sep"></div>
            <div class="hs-item">
              <strong>50K+</strong>
              <span>Aylık tarama</span>
            </div>
            <div class="hs-sep"></div>
            <div class="hs-item">
              <strong>2 dk</strong>
              <span>Kurulum süresi</span>
            </div>
          </div>
        </div>

        <!-- Right — Phone -->
        <div class="hero-right">
          <div class="phone-halo"></div>
          <div class="phone-card">
            <div class="phone-shell">
              <div class="p-island"></div>
              <div class="p-screen">
                <div class="pm-header">
                  <div class="pm-avi">🍕</div>
                  <div>
                    <div class="pm-name">La Bella Cucina</div>
                    <div class="pm-loc">İtalyan Mutfağı · Milano</div>
                  </div>
                </div>
                <div class="pm-tabs">
                  <span class="pm-tab active">Başlangıçlar</span>
                  <span class="pm-tab">Pizza</span>
                  <span class="pm-tab">Makarna</span>
                  <span class="pm-tab">Tatlı</span>
                </div>
                <div class="pm-list">
                  <div class="pm-item">
                    <div class="pm-emoji">🥗</div>
                    <div class="pm-info">
                      <div class="pm-iname">Caesar Salad</div>
                      <div class="pm-idesc">Marul, parmesan, kruton</div>
                      <div class="pm-iprice">₺180</div>
                    </div>
                    <button class="pm-add">+</button>
                  </div>
                  <div class="pm-item">
                    <div class="pm-emoji">🍞</div>
                    <div class="pm-info">
                      <div class="pm-iname">Bruschetta</div>
                      <div class="pm-idesc">Domates, fesleğen, sarımsak</div>
                      <div class="pm-iprice">₺120</div>
                    </div>
                    <button class="pm-add">+</button>
                  </div>
                  <div class="pm-item">
                    <div class="pm-emoji">🦑</div>
                    <div class="pm-info">
                      <div class="pm-iname">Kalamari</div>
                      <div class="pm-idesc">Kalamar tava, limonlu sos</div>
                      <div class="pm-iprice">₺220</div>
                    </div>
                    <button class="pm-add">+</button>
                  </div>
                </div>
                <div class="pm-qrbar">
                  <svg width="24" height="24" viewBox="0 0 80 80" fill="none">
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
                  <span>QR ile tara</span>
                </div>
              </div>
              <div class="p-bar"></div>
            </div>
          <div class="fb fb-top">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Menü canlıya alındı!
            </div>
            <div class="fb fb-bot">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#768dfb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              84 tarama bu hafta
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ MARQUEE ════════════════════════════════════════════════ -->
    <div class="marquee-rail reveal">
      <div class="marquee-track">
        <span>🍝 Bella Roma</span>
        <span class="sep">·</span>
        <span>🍣 Sakura House</span>
        <span class="sep">·</span>
        <span>🍔 Burger District</span>
        <span class="sep">·</span>
        <span>☕ The Brew Co.</span>
        <span class="sep">·</span>
        <span>🥩 Steakwood</span>
        <span class="sep">·</span>
        <span>🌮 Taco Verde</span>
        <span class="sep">·</span>
        <span>🥗 Green Table</span>
        <span class="sep">·</span>
        <span>🍜 Noodle Lab</span>
        <span class="sep">·</span>
        <!-- duplicate for seamless loop -->
        <span>🍝 Bella Roma</span>
        <span class="sep">·</span>
        <span>🍣 Sakura House</span>
        <span class="sep">·</span>
        <span>🍔 Burger District</span>
        <span class="sep">·</span>
        <span>☕ The Brew Co.</span>
        <span class="sep">·</span>
        <span>🥩 Steakwood</span>
        <span class="sep">·</span>
        <span>🌮 Taco Verde</span>
        <span class="sep">·</span>
        <span>🥗 Green Table</span>
        <span class="sep">·</span>
        <span>🍜 Noodle Lab</span>
        <span class="sep">·</span>
      </div>
    </div>

    <!-- ══ PROBLEM ════════════════════════════════════════════════ -->
    <section class="section pb-section">
      <div class="sec-wrap">
        <div class="sec-tag reveal">Eski Yöntem</div>
        <h2 class="sec-title reveal">Hâlâ basılı menü mü<br/>kullanıyorsunuz?</h2>
        <p class="sec-sub reveal">Kâğıt menüler size düşündüğünüzden çok daha pahalıya mal oluyor.</p>
        <div class="pb-grid">
          <div class="pb-card reveal">
            <div class="pb-icon">💸</div>
            <h3>Baskı masrafları</h3>
            <p>Lamine menüler hızla yıpranır. Her fiyat güncellemesi yeni baskı demek — yılda yüzlerce dolar boşa gider.</p>
          </div>
          <div class="pb-card reveal">
            <div class="pb-icon">⏳</div>
            <h3>Güncelleme imkânsız</h3>
            <p>Fiyat mı değiştirdiniz? Ürün mü tükendi? Basılı menüde düzeltme yapamaz, müşteriye açıklama yapmak zorunda kalırsınız.</p>
          </div>
          <div class="pb-card reveal">
            <div class="pb-icon">😤</div>
            <h3>Kötü müşteri deneyimi</h3>
            <p>Yıpranmış, lekeli menüler ilk izlenimi mahveder. 2025'te müşteriler çok daha iyisini bekliyor.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ FEATURES (Bento) ═══════════════════════════════════════ -->
    <section class="section ft-section" id="features">
      <div class="sec-wrap">
        <div class="sec-tag reveal">Özellikler</div>
        <h2 class="sec-title reveal">Dijitale geçmek için<br/>ihtiyacınız olan her şey</h2>
        <p class="sec-sub reveal">Teknik bilgi gerektirmeyen araçlarla profesyonel dijital menü oluşturun.</p>

        <div class="bento">
          <!-- Big left -->
          <div class="bc bc-tall reveal">
            <div class="bc-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </div>
            <h3>Görsel Menü Editörü</h3>
            <p>Sürükle-bırak arayüzle kategoriler, ürünler ve fotoğraflar ekleyin. Hiç kod yazmanıza gerek yok.</p>
            <div class="bc-visual editor-vis">
              <div class="ev-row"><span class="ev-tag">Pizza</span><span class="ev-tag active">Başlangıç</span><span class="ev-tag">Tatlı</span></div>
              <div class="ev-item"><span>🍕 Margherita</span><span class="ev-price">₺180</span></div>
              <div class="ev-item"><span>🥗 Caesar</span><span class="ev-price">₺120</span></div>
              <div class="ev-item new"><span>+ Yeni ürün ekle</span></div>
            </div>
          </div>

          <!-- Top-right 2 cards -->
          <div class="bc reveal">
            <div class="bc-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h.01M14 17h.01M17 14h.01M20 14h.01M17 17v3M20 17v3M17 20h3"/></svg>
            </div>
            <h3>Anında QR Kod</h3>
            <p>Tek tıkla markalı QR kod oluşturun. İndirin, yazdırın, masalara koyun.</p>
          </div>

          <div class="bc reveal">
            <div class="bc-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
            </div>
            <h3>Anlık Güncelleme</h3>
            <p>Fiyat değiştirin, ürün kapatın — değişiklikler saniyeler içinde canlıya geçer.</p>
          </div>

          <!-- Bottom wide -->
          <div class="bc bc-wide reveal">
            <div class="bc-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3>Varyant &amp; Ekstralar</h3>
            <p>Boy seçenekleri, baharat seviyeleri, ek malzemeler — menünüzün ihtiyaç duyduğu her şey tek panelde.</p>
            <div class="bc-visual var-vis">
              <div class="vv-chip">Küçük</div>
              <div class="vv-chip active">Orta</div>
              <div class="vv-chip">Büyük</div>
              <div class="vv-chip">+ Ekstra peynir</div>
              <div class="vv-chip">+ Acı sos</div>
            </div>
          </div>

          <div class="bc reveal">
            <div class="bc-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
            </div>
            <h3>Mobil Uyumlu</h3>
            <p>Her telefonda, tablette kusursuz görünüm. Uygulama indirme zorunluluğu yok.</p>
          </div>

          <div class="bc reveal">
            <div class="bc-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
            </div>
            <h3>Çoklu Menü</h3>
            <p>Öğle, akşam, kokteyl — aynı işletme için birden fazla menü yönetin.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ HOW IT WORKS ═══════════════════════════════════════════ -->
    <section class="section hiw-section" id="how">
      <div class="sec-wrap">
        <div class="sec-tag reveal">Nasıl Çalışır</div>
        <h2 class="sec-title reveal">3 adımda yayında olun</h2>
        <p class="sec-sub reveal">Sıfırdan canlı bir dijital menüye 5 dakikadan kısa sürede ulaşın.</p>

        <div class="hiw-grid">
          <div class="hiw-step reveal">
            <div class="hiw-num">01</div>
            <div class="hiw-ico">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <h3>Hesap Oluşturun</h3>
            <p>30 saniyede ücretsiz kayıt olun. Kredi kartı yok, kurulum ücreti yok.</p>
          </div>
          <div class="hiw-line reveal"></div>
          <div class="hiw-step reveal">
            <div class="hiw-num">02</div>
            <div class="hiw-ico">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </div>
            <h3>Menünüzü Kurun</h3>
            <p>Kategoriler oluşturun, ürünleri fotoğrafları ve fiyatlarıyla ekleyin.</p>
          </div>
          <div class="hiw-line reveal"></div>
          <div class="hiw-step reveal">
            <div class="hiw-num">03</div>
            <div class="hiw-ico">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h.01M17 17v3M20 17v3M17 20h3"/></svg>
            </div>
            <h3>QR Kodu Paylaşın</h3>
            <p>QR kodunuzu indirin, yazdırın, masalara koyun. Hazır — müşteriler anında tarayabilir.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ TESTIMONIALS ═══════════════════════════════════════════ -->
    <section class="section testi-section">
      <div class="sec-wrap">
        <div class="sec-tag reveal">Yorumlar</div>
        <h2 class="sec-title reveal">İşletme sahipleri anlatıyor</h2>
        <div class="testi-grid">
          <div class="testi-card reveal">
            <div class="testi-stars">★★★★★</div>
            <p>"Basılı menüden geçtik ve bir daha geri dönmedik. Fiyat güncellemesi artık 3 gün beklemek yerine 10 saniye sürüyor."</p>
            <div class="testi-who">
              <div class="testi-av" style="background:#768dfb20;color:#768dfb">MA</div>
              <div>
                <strong>Marco Andreotti</strong>
                <span>Bella Roma · Milano</span>
              </div>
            </div>
          </div>
          <div class="testi-card reveal">
            <div class="testi-stars">★★★★★</div>
            <p>"Müşterilerim çok memnun. 'O ürün yok' demek zorunda kalmıyorum artık. Telefonumdan güncelliyorum, anında yansıyor."</p>
            <div class="testi-who">
              <div class="testi-av" style="background:#f0f0f0;color:#555">SR</div>
              <div>
                <strong>Sofia Ramirez</strong>
                <span>El Patio · Barselona</span>
              </div>
            </div>
          </div>
          <div class="testi-card reveal">
            <div class="testi-stars">★★★★★</div>
            <p>"Kafe menümüzü 20 dakikada kurdum. QR kod mükemmel çalışıyor, menü harika görünüyor ve başlamak bize hiçbir şeye mâl olmadı."</p>
            <div class="testi-who">
              <div class="testi-av" style="background:#19151810;color:#191518">KT</div>
              <div>
                <strong>Kenji Takahashi</strong>
                <span>Brewed Horizons · Tokyo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ PRICING ════════════════════════════════════════════════ -->
    <section class="section price-section" id="pricing">
      <div class="sec-wrap">
        <div class="sec-tag reveal">Fiyatlar</div>
        <h2 class="sec-title reveal">Sade ve dürüst fiyatlandırma</h2>
        <p class="sec-sub reveal">Ücretsiz başlayın. Hazır olduğunuzda yükseltin.</p>
        <div class="price-grid">
          <div class="price-card reveal">
            <div class="pc-name">Ücretsiz</div>
            <div class="pc-price">$0<span>/ay</span></div>
            <p class="pc-desc">Başlamak için mükemmel. Kredi kartı gerekmez.</p>
            <ul class="pc-list">
              <li class="on"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>1 menü</li>
              <li class="on"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>20 ürüne kadar</li>
              <li class="on"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>QR kod oluşturma</li>
              <li class="on"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Mobil uyumlu menü</li>
              <li class="off"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>Özel marka</li>
              <li class="off"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>Analitik</li>
            </ul>
            <button class="pc-btn-out" @click="goRegister">Ücretsiz Başla</button>
          </div>

          <div class="price-card featured reveal">
            <div class="pc-badge">En Popüler</div>
            <div class="pc-name">Pro</div>
            <div class="pc-price">$10<span>/ay</span></div>
            <p class="pc-desc">Büyüyen işletmeler için daha fazla güç.</p>
            <ul class="pc-list">
              <li class="on"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#768dfb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>3 işletme, 5 menü</li>
              <li class="on"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#768dfb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>100 ürüne kadar</li>
              <li class="on"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#768dfb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>QR kod oluşturma</li>
              <li class="on"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#768dfb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Mobil uyumlu menü</li>
              <li class="on"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#768dfb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Özel marka</li>
              <li class="on"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#768dfb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Analitik &amp; tarama istatistikleri</li>
            </ul>
            <button class="pc-btn-fill" @click="goRegister">Ücretsiz Deneyin</button>
          </div>

          <div class="price-card reveal">
            <div class="pc-name">Premium</div>
            <div class="pc-price">$25<span>/ay</span></div>
            <p class="pc-desc">Tüm gücü isteyen işletmeler için.</p>
            <ul class="pc-list">
              <li class="on"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Sınırsız işletme</li>
              <li class="on"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Sınırsız menü &amp; ürün</li>
              <li class="on"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>QR kod oluşturma</li>
              <li class="on"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Çoklu dil desteği</li>
              <li class="on"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Öncelikli destek</li>
              <li class="on"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Tüm analitik özellikleri</li>
            </ul>
            <button class="pc-btn-out" @click="goRegister">Hemen Başla</button>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ FAQ ════════════════════════════════════════════════════ -->
    <section class="section faq-section" id="faq">
      <div class="sec-wrap faq-wrap">
        <div class="faq-left">
          <div class="sec-tag reveal">SSS</div>
          <h2 class="sec-title reveal" style="text-align:left">Sık sorulan sorular</h2>
          <p class="sec-sub reveal" style="text-align:left;margin-left:0">Başlamadan önce bilmeniz gereken her şey.</p>
        </div>
        <div class="faq-right reveal">
          <div v-for="(item,i) in faqs" :key="i" class="faq-item" :class="{open:item.open}" @click="toggleFaq(i)">
            <div class="faq-q">
              {{ item.q }}
              <svg :class="['faq-arr',{rot:item.open}]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            <transition name="faq">
              <div v-if="item.open" class="faq-a">{{ item.a }}</div>
            </transition>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ FINAL CTA ══════════════════════════════════════════════ -->
    <section class="section cta-section">
      <div class="sec-wrap">
        <div class="cta-card reveal">
          <div class="cta-glow-l"></div>
          <div class="cta-glow-r"></div>
          <h2 class="cta-h2">Dijitale geçmeye hazır mısınız?</h2>
          <p class="cta-p">500+ restoranın kullandığı platforma katılın. Ücretsiz başlayın, kredi kartı gerekmez.</p>
          <button class="cta-main" @click="goRegister" style="font-size:17px;padding:16px 36px">
            Ücretsiz Menü Oluştur
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <p class="cta-note">Sonsuza kadar ücretsiz plan · Kredi kartı yok · 2 dakikada kurulum</p>
        </div>
      </div>
    </section>

    <!-- ══ CONTACT ══════════════════════════════════════════════════ -->
    <section class="section contact-section" id="contact">
      <div class="sec-wrap">
        <div class="contact-inner reveal">
          <div class="contact-left">
            <span class="sec-tag" style="color:#768dfb">İletişim</span>
            <h2 class="contact-h2">Bir sorunuz mu var?</h2>
            <p class="contact-sub">Ekibimiz size yardımcı olmaktan mutluluk duyar. Genellikle birkaç saat içinde yanıt veririz.</p>
            <div class="contact-info">
              <div class="ci-item">
                <span class="ci-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </span>
                <span>destek@menusflow.com</span>
              </div>
              <div class="ci-item">
                <span class="ci-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </span>
                <span>+90 (212) 000 00 00</span>
              </div>
            </div>
          </div>

          <form class="contact-form" @submit.prevent="submitContact">
            <div class="cf-group">
              <label class="cf-label">Ad Soyad</label>
              <input v-model="contactForm.name" type="text" class="cf-input" placeholder="Adınız Soyadınız" />
            </div>
            <div class="cf-group">
              <label class="cf-label">E-posta</label>
              <input v-model="contactForm.email" type="email" class="cf-input" placeholder="ornek@email.com" />
            </div>
            <div class="cf-group">
              <label class="cf-label">Mesajınız</label>
              <textarea v-model="contactForm.message" class="cf-textarea" placeholder="Nasıl yardımcı olabiliriz?" rows="4"></textarea>
            </div>
            <button type="submit" class="cf-submit" :class="{ sent: contactSent }">
              <template v-if="!contactSent">
                Gönder
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
              </template>
              <template v-else>
                Gönderildi
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </template>
            </button>
          </form>
        </div>
      </div>
    </section>

    <!-- ══ FOOTER ══════════════════════════════════════════════════ -->
    <footer class="land-footer">
      <div class="ft-wrap">
        <div class="ft-brand">
          <a href="#" class="brand" style="text-decoration:none">
            <span class="brand-icon"><span class="bi-q">Q</span></span>
            <span class="brand-name" style="color:#fff">Menusflow</span>
          </a>
          <p>Restoranınız için dijital menü oluşturmanın en kolay yolu — menusflow.com</p>
        </div>
        <div class="ft-links">
          <div class="ft-col">
            <h4>Ürün</h4>
            <a href="#features">Özellikler</a>
            <a href="#pricing">Fiyatlar</a>
            <a href="#how">Nasıl Çalışır</a>
          </div>
          <div class="ft-col">
            <h4>Şirket</h4>
            <a href="#">Hakkımızda</a>
            <a href="#">Blog</a>
            <a href="#">İletişim</a>
          </div>
          <div class="ft-col">
            <h4>Yasal</h4>
            <a href="#">Gizlilik Politikası</a>
            <a href="#">Kullanım Şartları</a>
          </div>
        </div>
      </div>
      <div class="ft-bottom">
        <span>© 2025 Menusflow. Tüm hakları saklıdır.</span>
        <span>Dünya genelindeki restoranlar için sevgiyle yapıldı ♥</span>
      </div>
    </footer>

  </div>
</template>

<style scoped>
/* ═══════════════════════════════════════════════════════
   TOKENS
════════════════════════════════════════════════════════ */
.land {
  --brand:      #768dfb;
  --brand-d:    #5b73e8;
  --brand-glow: rgba(118,141,251,0.18);
  --dark:       #0d0d18;
  --text:       #111120;
  --text-mid:   #50506a;
  --text-soft:  #8888a8;
  --bg:         #ffffff;
  --bg-soft:    #f6f7fd;
  --border:     #e8eaf4;
  --card:       #ffffff;
  --r:          18px;

  font-family: 'Poppins', system-ui, sans-serif;
  color: var(--text);
  background: var(--bg);
  overflow-x: hidden;
  line-height: 1.6;
}

/* ═══════════════════════════════════════════════════════
   REVEAL
════════════════════════════════════════════════════════ */
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s cubic-bezier(.22,1,.36,1), transform 0.6s cubic-bezier(.22,1,.36,1);
}
.reveal.in { opacity: 1; transform: translateY(0); }

/* ═══════════════════════════════════════════════════════
   SHARED SECTION
════════════════════════════════════════════════════════ */
.section { padding: 96px 24px; }
.sec-wrap { max-width: 1120px; margin: 0 auto; }
.sec-tag {
  display: inline-block;
  font-family: 'Poppins', sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--brand);
  background: rgba(118,141,251,.1);
  border: 1px solid rgba(118,141,251,.2);
  padding: 5px 14px;
  border-radius: 999px;
  margin-bottom: 18px;
}
.sec-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 800;
  font-size: clamp(2rem, 4vw, 2.75rem);
  line-height: 1.15;
  color: var(--text);
  margin: 0 0 16px;
  text-align: center;
}
.sec-sub {
  font-size: 17px;
  color: var(--text-mid);
  max-width: 540px;
  margin: 0 auto 52px;
  text-align: center;
  line-height: 1.7;
}

/* ═══════════════════════════════════════════════════════
   NAV
════════════════════════════════════════════════════════ */
.nav {
  position: fixed;
  inset: 0 0 auto;
  z-index: 200;
  padding: 0 24px;
  transition: background .25s, box-shadow .25s, backdrop-filter .25s;
}
.nav.scrolled {
  background: rgba(255,255,255,.88);
  backdrop-filter: blur(16px);
  box-shadow: 0 1px 0 var(--border);
}
.nav-wrap {
  max-width: 1120px;
  margin: 0 auto;
  height: 68px;
  display: flex;
  align-items: center;
  gap: 32px;
}
.brand { display:flex; align-items:center; gap:9px; text-decoration:none; flex-shrink:0; }
.brand-icon {
  width: 34px; height: 34px;
  background: linear-gradient(145deg, #8a9efc 0%, #6478f0 100%);
  border-radius: 10px;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
  box-shadow: 0 4px 12px var(--brand-glow);
}
.bi-q {
  font-family: 'Waldenburg', 'Waldenburg Fallback', 'Bricolage Grotesque', sans-serif;
  font-weight: 800;
  font-size: 16px;
  line-height: 1;
  color: #fff;
  letter-spacing: -0.02em;
}
.brand-name {
  font-family: 'Waldenburg', 'Waldenburg Fallback', 'Bricolage Grotesque', sans-serif;
  font-weight: 800;
  font-size: 19px;
  color: var(--text);
  letter-spacing: -.02em;
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
}
.nav-links a {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-mid);
  text-decoration: none;
  padding: 7px 14px;
  border-radius: 10px;
  transition: color .15s, background .15s;
}
.nav-links a:hover { color: var(--text); background: var(--bg-soft); }
.nav-ctas { display:flex; align-items:center; gap:8px; }
.btn-ghost {
  font-family:'Poppins',sans-serif;
  font-size: 14px; font-weight: 600;
  color: var(--text-mid);
  background: transparent; border: none;
  padding: 8px 16px; border-radius: 10px;
  cursor: pointer; transition: color .15s, background .15s;
}
.btn-ghost:hover { color:var(--text); background:var(--bg-soft); }
.btn-pill {
  font-family:'Poppins',sans-serif;
  font-size: 14px; font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, var(--brand) 0%, var(--brand-d) 100%);
  border: none; padding: 9px 20px; border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 2px 10px var(--brand-glow);
  transition: opacity .15s, transform .1s, box-shadow .15s;
}
.btn-pill:hover { opacity:.9; transform:translateY(-1px); box-shadow: 0 5px 18px var(--brand-glow); }
.hamburger {
  display:none; flex-direction:column; gap:5px;
  background:none; border:none; cursor:pointer; padding:6px; margin-left:auto;
}
.hamburger span { display:block; width:22px; height:2px; background:var(--text); border-radius:2px; transition:transform .22s, opacity .22s; }
.mobile-drawer {
  display:none; flex-direction:column; gap:2px;
  padding: 10px 0 20px;
  border-top: 1px solid var(--border);
  background: rgba(255,255,255,.96);
  backdrop-filter: blur(16px);
}
.mobile-drawer.open { display:flex; }
.mobile-drawer a { font-size:15px; font-weight:500; color:var(--text-mid); text-decoration:none; padding:10px 16px; border-radius:8px; }
.mobile-drawer a:hover { color:var(--text); background:var(--bg-soft); }
.drawer-foot { display:flex; flex-direction:column; gap:8px; padding: 12px 0 0; border-top:1px solid var(--border); margin-top:8px; }
.w100 { width:100%; text-align:center; justify-content:center; }
@media(max-width:768px){
  .nav-links,.nav-ctas{display:none}
  .hamburger{display:flex}
}

/* ═══════════════════════════════════════════════════════
   HERO
════════════════════════════════════════════════════════ */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 120px 24px 80px;
  position: relative;
  overflow: hidden;
  background: var(--bg);
}
.hero-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, #c7cdf9 1px, transparent 1px);
  background-size: 32px 32px;
  opacity: .45;
}
.hero-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
}
.b1 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(118,141,251,.22) 0%, transparent 70%);
  top: -80px; right: -60px;
}
.b2 {
  width: 360px; height: 360px;
  background: radial-gradient(circle, rgba(168,139,250,.14) 0%, transparent 70%);
  bottom: 40px; left: -80px;
}
.hero-wrap {
  max-width: 1120px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 72px;
  align-items: center;
  position: relative;
  z-index: 1;
  width: 100%;
}
.hero-left { display:flex; flex-direction:column; gap:28px; }
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(118,141,251,.08);
  border: 1px solid rgba(118,141,251,.2);
  color: var(--brand-d);
  font-size: 13px;
  font-weight: 500;
  padding: 7px 16px;
  border-radius: 999px;
  width: fit-content;
  animation: fadeUp .6s ease both;
}
.pulse-dot {
  width: 8px; height: 8px;
  background: #16a34a;
  border-radius: 50%;
  box-shadow: 0 0 0 3px rgba(22,163,74,.2);
  animation: pulseGreen 2s infinite;
}
@keyframes pulseGreen { 0%,100%{box-shadow:0 0 0 3px rgba(22,163,74,.2)} 50%{box-shadow:0 0 0 6px rgba(22,163,74,.08)} }
.hero-h1 {
  font-family: 'Poppins', sans-serif;
  font-weight: 800;
  font-size: clamp(2.4rem, 5.2vw, 3.6rem);
  line-height: 1.1;
  letter-spacing: -.03em;
  color: var(--text);
  margin: 0;
  animation: fadeUp .6s .08s ease both;
}
.hero-h1 em {
  font-style: normal;
  background: linear-gradient(135deg, var(--brand) 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero-sub {
  font-size: 18px;
  line-height: 1.7;
  color: var(--text-mid);
  margin: 0;
  max-width: 480px;
  animation: fadeUp .6s .16s ease both;
}
.hero-btns {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  animation: fadeUp .6s .24s ease both;
}
.cta-main {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, var(--brand) 0%, var(--brand-d) 100%);
  color: #fff;
  font-family: 'Poppins', sans-serif;
  font-size: 15px;
  font-weight: 600;
  padding: 14px 28px;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 20px var(--brand-glow);
  transition: transform .15s, box-shadow .15s, opacity .15s;
  position: relative;
  overflow: hidden;
}
.cta-main::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, transparent 0%, rgba(255,255,255,.18) 50%, transparent 100%);
  transform: translateX(-100%);
  transition: transform .5s;
}
.cta-main:hover::after { transform: translateX(100%); }
.cta-main:hover { transform:translateY(-2px); box-shadow:0 8px 30px rgba(118,141,251,.35); }
.cta-ghost {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-mid);
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  padding: 13px 20px;
  border-radius: 14px;
  border: 1.5px solid var(--border);
  transition: color .15s, border-color .15s, background .15s;
  font-family: 'Poppins', sans-serif;
}
.cta-ghost:hover { color:var(--text); border-color:#c4c8f0; background:var(--bg-soft); }
.hero-stats {
  display: flex;
  align-items: center;
  gap: 20px;
  animation: fadeUp .6s .32s ease both;
  padding-top: 4px;
}
.hs-item { display:flex; flex-direction:column; gap:2px; }
.hs-item strong {
  font-family: 'Poppins', sans-serif;
  font-weight: 800;
  font-size: 22px;
  color: var(--text);
  letter-spacing: -.02em;
}
.hs-item span { font-size: 12px; color: var(--text-soft); font-weight: 500; }
.hs-sep { width:1px; height:32px; background:var(--border); }
@keyframes fadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }

/* ── Phone ─────────────────────────── */
.hero-right {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  animation: fadeUp .7s .2s ease both;
}
.phone-halo {
  position: absolute;
  width: 340px; height: 340px;
  background: radial-gradient(circle, rgba(118,141,251,.16) 0%, transparent 68%);
  border-radius: 50%;
  pointer-events: none;
  animation: haloBreath 4s ease-in-out infinite;
}
@keyframes haloBreath { 0%,100%{transform:scale(1);opacity:.8} 50%{transform:scale(1.1);opacity:1} }
.phone-card {
  animation: phoneFloat 5s ease-in-out infinite;
  position: relative;
  z-index: 1;
  /* size reference for badge positioning */
  width: 258px;
}
@keyframes phoneFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
.phone-shell {
  width: 258px; height: 530px;
  background: #0a0912;
  border-radius: 44px;
  border: 6px solid rgba(255,255,255,.1);
  box-shadow:
    0 40px 80px rgba(13,13,24,.4),
    inset 0 1px 0 rgba(255,255,255,.07),
    0 0 0 1px rgba(255,255,255,.04),
    0 0 60px rgba(118,141,251,.12);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.p-island {
  width: 90px; height: 24px;
  background: #0a0912;
  border-radius: 0 0 16px 16px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}
.p-screen {
  flex: 1;
  background: #fff;
  margin: -2px 4px 4px;
  border-radius: 4px 4px 30px 30px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.p-bar { width:80px; height:4px; background:rgba(255,255,255,.22); border-radius:2px; margin:5px auto 7px; }
.pm-header { display:flex; align-items:center; gap:9px; padding:12px 14px 10px; border-bottom:1px solid #f2f2f7; }
.pm-avi { width:36px; height:36px; background:#f0f0f9; border-radius:9px; display:flex; align-items:center; justify-content:center; font-size:18px; }
.pm-name { font-size:12px; font-weight:700; color:#111120; }
.pm-loc  { font-size:9px; color:#aaa; margin-top:1px; }
.pm-tabs { display:flex; gap:5px; padding:8px 14px; border-bottom:1px solid #f2f2f7; overflow-x:auto; }
.pm-tab { font-size:9.5px; font-weight:600; padding:3px 10px; border-radius:999px; background:#f4f4f8; color:#888; white-space:nowrap; }
.pm-tab.active { background:var(--brand); color:#fff; }
.pm-list { flex:1; overflow:hidden; padding:6px 0; }
.pm-item { display:flex; align-items:center; gap:9px; padding:7px 14px; }
.pm-emoji { width:38px; height:38px; background:#f7f7fb; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0; }
.pm-info { flex:1; min-width:0; }
.pm-iname { font-size:11px; font-weight:700; color:#111120; }
.pm-idesc { font-size:9px; color:#bbb; margin-top:1px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.pm-iprice { font-size:11px; font-weight:700; color:var(--brand); margin-top:2px; }
.pm-add { width:24px; height:24px; background:var(--brand); color:#fff; border:none; border-radius:7px; font-size:15px; cursor:pointer; display:flex; align-items:center; justify-content:center; font-weight:700; flex-shrink:0; line-height:1; }
.pm-qrbar { display:flex; align-items:center; gap:8px; padding:7px 14px; background:#f7f8fd; border-top:1px solid #f2f2f7; font-size:9px; font-weight:600; color:#999; }
.fb {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 7px;
  background: #fff;
  border: 1px solid var(--border);
  box-shadow: 0 4px 20px rgba(0,0,0,.08);
  padding: 9px 16px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text);
  white-space: nowrap;
}
/* Badges sit ON the phone — right side overflows the phone shell */
.fb-top { top: 42px;  right: -88px; animation: fbFloat 4s ease-in-out infinite; }
.fb-bot { bottom: 90px; left: -88px; animation: fbFloat 4s 2s ease-in-out infinite; }
@keyframes fbFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
@media(max-width:920px){
  .hero-wrap{grid-template-columns:1fr;gap:48px}
  .hero-right{order:1}
  .phone-shell{width:220px;height:440px}
  .fb-top{right:-60px} .fb-bot{left:-60px}
}
@media(max-width:520px){
  .hero{padding:96px 20px 60px}
  .hero-h1{font-size:2.1rem}
}

/* ═══════════════════════════════════════════════════════
   MARQUEE
════════════════════════════════════════════════════════ */
.marquee-rail {
  overflow: hidden;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: 14px 0;
  background: var(--bg-soft);
}
.marquee-track {
  display: flex;
  align-items: center;
  gap: 20px;
  width: max-content;
  animation: marquee 22s linear infinite;
}
.marquee-track span { font-size:13px; font-weight:500; color:var(--text-soft); white-space:nowrap; }
.marquee-track .sep { color:var(--border); font-size:16px; }
@keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }

/* ═══════════════════════════════════════════════════════
   PROBLEM
════════════════════════════════════════════════════════ */
.pb-section { background: var(--bg); text-align:center; }
.pb-grid {
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: 20px;
}
.pb-card {
  background: var(--card);
  border: 1.5px solid var(--border);
  border-radius: 20px;
  padding: 36px 28px;
  text-align: left;
  transition: box-shadow .2s, transform .2s, border-color .2s;
}
.pb-card:hover { box-shadow:0 10px 40px rgba(0,0,0,.07); transform:translateY(-4px); border-color:#d0d4f5; }
.pb-icon { font-size:36px; margin-bottom:18px; }
.pb-card h3 {
  font-family:Poppins,sans-serif;
  font-weight:700; font-size:18px;
  color:var(--text); margin:0 0 10px;
}
.pb-card p { font-size:14px; line-height:1.7; color:var(--text-mid); margin:0; }
@media(max-width:768px){ .pb-grid{grid-template-columns:1fr} }

/* ═══════════════════════════════════════════════════════
   FEATURES BENTO
════════════════════════════════════════════════════════ */
.ft-section { background: var(--bg-soft); text-align:center; }
.bento {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto auto;
  gap: 16px;
}
.bc {
  background: var(--card);
  border: 1.5px solid var(--border);
  border-radius: 20px;
  padding: 32px 28px;
  transition: box-shadow .2s, transform .2s, border-color .2s;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.bc:hover { box-shadow:0 12px 40px rgba(118,141,251,.1); transform:translateY(-4px); border-color:#d0d4f5; }
.bc-tall { grid-row: span 2; }
.bc-wide { grid-column: span 2; }
.bc-icon {
  width:50px; height:50px;
  background:rgba(118,141,251,.08);
  border-radius:14px;
  display:flex; align-items:center; justify-content:center;
  color:var(--brand);
  flex-shrink:0;
  margin-bottom:4px;
}
.bc h3 {
  font-family:Poppins,sans-serif;
  font-weight:700; font-size:17px;
  color:var(--text); margin:0;
}
.bc p { font-size:14px; line-height:1.7; color:var(--text-mid); margin:0; }
.bc-visual { margin-top:auto; padding-top:16px; }
/* Editor visual */
.editor-vis { display:flex; flex-direction:column; gap:8px; }
.ev-row { display:flex; gap:6px; }
.ev-tag { font-size:11px; font-weight:600; padding:4px 12px; border-radius:999px; background:#f2f2f8; color:#888; }
.ev-tag.active { background:var(--brand); color:#fff; }
.ev-item { display:flex; justify-content:space-between; align-items:center; background:#f7f8fd; border-radius:10px; padding:10px 14px; font-size:13px; font-weight:500; color:var(--text); }
.ev-item.new { color:var(--brand); border:1.5px dashed rgba(118,141,251,.3); background:transparent; justify-content:center; }
.ev-price { font-weight:700; color:var(--brand); }
/* Variant visual */
.var-vis { display:flex; flex-wrap:wrap; gap:8px; }
.vv-chip { font-size:12px; font-weight:600; padding:5px 14px; border-radius:999px; background:#f2f2f8; color:#777; border:1.5px solid transparent; }
.vv-chip.active { background:rgba(118,141,251,.1); color:var(--brand); border-color:rgba(118,141,251,.3); }
@media(max-width:900px){
  .bento{grid-template-columns:1fr 1fr}
  .bc-tall{grid-row:span 1}
}
@media(max-width:600px){ .bento{grid-template-columns:1fr} .bc-wide{grid-column:span 1} }

/* ═══════════════════════════════════════════════════════
   HOW IT WORKS
════════════════════════════════════════════════════════ */
.hiw-section { background:var(--bg); text-align:center; }
.hiw-grid {
  display: flex;
  align-items: flex-start;
  gap: 0;
  margin-top: 8px;
}
.hiw-step {
  flex: 1;
  background: var(--card);
  border: 1.5px solid var(--border);
  border-radius: 20px;
  padding: 36px 28px;
  text-align: center;
  transition: box-shadow .2s, transform .2s;
}
.hiw-step:hover { box-shadow:0 12px 40px rgba(118,141,251,.08); transform:translateY(-4px); }
.hiw-line {
  flex: 0 0 40px;
  height: 2px;
  background: linear-gradient(90deg, rgba(118,141,251,.4) 0%, rgba(118,141,251,.1) 100%);
  margin-top: 76px;
}
.hiw-num {
  font-family:Poppins,sans-serif;
  font-weight:800; font-size:12px;
  letter-spacing:.1em; color:var(--brand);
  margin-bottom:14px;
}
.hiw-ico {
  width:60px; height:60px;
  background:rgba(118,141,251,.07);
  border-radius:16px;
  display:flex; align-items:center; justify-content:center;
  margin:0 auto 18px; color:var(--brand);
}
.hiw-step h3 { font-family:Poppins,sans-serif; font-weight:700; font-size:18px; color:var(--text); margin:0 0 10px; }
.hiw-step p  { font-size:14px; line-height:1.7; color:var(--text-mid); margin:0; }
@media(max-width:768px){ .hiw-grid{flex-direction:column;gap:16px} .hiw-line{display:none} }

/* ═══════════════════════════════════════════════════════
   TESTIMONIALS
════════════════════════════════════════════════════════ */
.testi-section { background:var(--bg-soft); text-align:center; }
.testi-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
.testi-card {
  background:var(--card);
  border:1.5px solid var(--border);
  border-radius:20px;
  padding:32px 28px;
  text-align:left;
  transition:box-shadow .2s, transform .2s;
}
.testi-card:hover { box-shadow:0 12px 40px rgba(0,0,0,.07); transform:translateY(-4px); }
.testi-stars { color:#f59e0b; font-size:15px; letter-spacing:2px; margin-bottom:14px; }
.testi-card p { font-size:14px; line-height:1.75; color:var(--text-mid); margin:0 0 20px; }
.testi-who { display:flex; align-items:center; gap:12px; }
.testi-av { width:38px; height:38px; border-radius:50%; font-size:12px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.testi-who strong { display:block; font-size:14px; color:var(--text); }
.testi-who span { font-size:12px; color:var(--text-soft); margin-top:1px; display:block; }
@media(max-width:900px){ .testi-grid{grid-template-columns:1fr;gap:16px} }

/* ═══════════════════════════════════════════════════════
   PRICING
════════════════════════════════════════════════════════ */
.price-section { background:var(--bg); text-align:center; }
.price-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:20px; max-width:1060px; margin:0 auto; }
.price-card {
  background:var(--card);
  border:1.5px solid var(--border);
  border-radius:24px;
  padding:40px 36px;
  text-align:left;
  position:relative;
  transition:box-shadow .2s, transform .2s;
}
.price-card.featured {
  border-color:var(--brand);
  box-shadow:0 0 0 3px rgba(118,141,251,.1), 0 20px 50px rgba(118,141,251,.12);
}
.price-card.featured:hover { transform:translateY(-4px); box-shadow:0 0 0 3px rgba(118,141,251,.12), 0 28px 60px rgba(118,141,251,.18); }
.pc-badge {
  position:absolute; top:-14px; left:50%; transform:translateX(-50%);
  background:linear-gradient(135deg,var(--brand) 0%,var(--brand-d) 100%);
  color:#fff; font-size:11px; font-weight:700;
  padding:4px 18px; border-radius:999px; white-space:nowrap;
}
.pc-name { font-family:'Poppins',sans-serif; font-weight:600; font-size:14px; color:var(--text-soft); margin-bottom:10px; letter-spacing:.05em; text-transform:uppercase; }
.pc-price { font-family:Poppins,sans-serif; font-weight:800; font-size:48px; letter-spacing:-.03em; color:var(--text); line-height:1; margin-bottom:12px; }
.pc-price span { font-size:16px; font-weight:500; color:var(--text-soft); letter-spacing:0; }
.pc-desc { font-size:14px; color:var(--text-mid); margin-bottom:28px; }
.pc-list { list-style:none; padding:0; margin:0 0 32px; display:flex; flex-direction:column; gap:12px; }
.pc-list li { display:flex; align-items:center; gap:10px; font-size:14px; font-weight:500; }
.pc-list .on { color:var(--text); }
.pc-list .off { color:#bbb; }
.pc-btn-out {
  width:100%; padding:13px; border-radius:12px;
  border:1.5px solid var(--border); background:transparent;
  color:var(--text); font-size:15px; font-weight:600; cursor:pointer;
  font-family:'Poppins',sans-serif;
  transition:background .15s, border-color .15s;
}
.pc-btn-out:hover { background:var(--bg-soft); border-color:#c4c8f0; }
.pc-btn-fill {
  width:100%; padding:13px; border-radius:12px; border:none;
  background:linear-gradient(135deg,var(--brand) 0%,var(--brand-d) 100%);
  color:#fff; font-size:15px; font-weight:700; cursor:pointer;
  font-family:'Poppins',sans-serif;
  box-shadow:0 4px 18px var(--brand-glow);
  transition:opacity .15s, transform .1s, box-shadow .15s;
}
.pc-btn-fill:hover { opacity:.92; transform:translateY(-1px); box-shadow:0 8px 28px rgba(118,141,251,.3); }
@media(max-width:860px){ .price-grid{grid-template-columns:1fr} }
@media(min-width:861px) and (max-width:1060px){ .price-grid{grid-template-columns:1fr 1fr} }

/* ═══════════════════════════════════════════════════════
   FAQ
════════════════════════════════════════════════════════ */
.faq-section { background:var(--bg-soft); }
.faq-wrap { display:grid; grid-template-columns:1fr 1.6fr; gap:72px; align-items:start; }
.faq-right { display:flex; flex-direction:column; }
.faq-item {
  border-bottom:1.5px solid var(--border);
  padding:20px 0;
  cursor:pointer;
  transition:background .1s;
}
.faq-q {
  display:flex; align-items:center; justify-content:space-between; gap:16px;
  font-size:15px; font-weight:600; color:var(--text); user-select:none;
}
.faq-arr { flex-shrink:0; color:var(--text-soft); transition:transform .22s, color .15s; }
.faq-arr.rot { transform:rotate(180deg); color:var(--brand); }
.faq-a { font-size:14px; line-height:1.75; color:var(--text-mid); padding-top:12px; }
.faq-enter-active,.faq-leave-active { transition:all .22s ease; overflow:hidden; }
.faq-enter-from,.faq-leave-to { opacity:0; max-height:0; padding-top:0; }
.faq-enter-to,.faq-leave-from { opacity:1; max-height:200px; }
@media(max-width:900px){ .faq-wrap{grid-template-columns:1fr;gap:32px} }

/* ═══════════════════════════════════════════════════════
   FINAL CTA
════════════════════════════════════════════════════════ */
.cta-section { background:var(--bg); }
.cta-card {
  background:var(--dark);
  border-radius:28px;
  padding:80px 48px;
  text-align:center;
  position:relative;
  overflow:hidden;
}
.cta-glow-l {
  position:absolute; top:-80px; left:-60px;
  width:300px; height:300px;
  background:radial-gradient(circle,rgba(118,141,251,.3) 0%,transparent 70%);
  pointer-events:none;
}
.cta-glow-r {
  position:absolute; bottom:-80px; right:-60px;
  width:300px; height:300px;
  background:radial-gradient(circle,rgba(167,139,250,.2) 0%,transparent 70%);
  pointer-events:none;
}
.cta-h2 {
  font-family:Poppins,sans-serif;
  font-weight:800; font-size:clamp(2rem,4vw,3rem);
  color:#fff; margin:0 0 18px; letter-spacing:-.03em; position:relative;
}
.cta-p { font-size:17px; color:rgba(255,255,255,.55); max-width:460px; margin:0 auto 36px; line-height:1.65; position:relative; }
.cta-note { font-size:13px; color:rgba(255,255,255,.3); margin-top:16px; font-weight:500; position:relative; }
@media(max-width:600px){ .cta-card{padding:52px 28px} }

/* ═══════════════════════════════════════════════════════
   CONTACT
════════════════════════════════════════════════════════ */
.contact-section { background: var(--dark); }
.contact-inner {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 72px;
  align-items: center;
  max-width: 900px;
  margin: 0 auto;
}
.contact-h2 {
  font-size: clamp(1.75rem, 3.5vw, 2.4rem);
  font-weight: 800;
  color: #fff;
  margin: 12px 0 16px;
  line-height: 1.2;
}
.contact-sub {
  font-size: 15px;
  color: rgba(255,255,255,.4);
  line-height: 1.7;
  margin: 0 0 32px;
}
.contact-info { display: flex; flex-direction: column; gap: 14px; }
.ci-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: rgba(255,255,255,.5);
}
.ci-icon {
  width: 34px; height: 34px;
  border-radius: 10px;
  background: rgba(118,141,251,.12);
  border: 1px solid rgba(118,141,251,.2);
  display: flex; align-items: center; justify-content: center;
  color: #768dfb;
  flex-shrink: 0;
}
.contact-form {
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 20px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.cf-group { display: flex; flex-direction: column; gap: 7px; }
.cf-label { font-size: 13px; font-weight: 500; color: rgba(255,255,255,.45); }
.cf-input,
.cf-textarea {
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 14px;
  color: #fff;
  font-family: inherit;
  outline: none;
  transition: border-color .2s, box-shadow .2s;
  resize: none;
}
.cf-input::placeholder, .cf-textarea::placeholder { color: rgba(255,255,255,.2); }
.cf-input:focus, .cf-textarea:focus {
  border-color: rgba(118,141,251,.6);
  box-shadow: 0 0 0 3px rgba(118,141,251,.12);
}
.cf-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #768dfb;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 13px 24px;
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background .2s, transform .15s;
}
.cf-submit:hover { background: #5b73e8; }
.cf-submit:active { transform: scale(.98); }
.cf-submit.sent { background: #22c55e; cursor: default; }
@media(max-width:768px) {
  .contact-inner { grid-template-columns: 1fr; gap: 40px; }
  .contact-left { text-align: center; }
  .contact-info { align-items: center; }
}

/* ═══════════════════════════════════════════════════════
   FOOTER
════════════════════════════════════════════════════════ */
.land-footer { background:#09090f; padding:64px 24px 32px; }
.ft-wrap {
  max-width:1120px; margin:0 auto 48px;
  display:grid; grid-template-columns:1.4fr 1fr 1fr 1fr; gap:48px;
}
.ft-brand p { font-size:14px; line-height:1.7; color:rgba(255,255,255,.35); margin-top:16px; max-width:220px; }
.ft-links { display:flex; gap:48px; }
.ft-col { display:flex; flex-direction:column; gap:12px; }
.ft-col h4 { font-size:12px; font-weight:600; color:rgba(255,255,255,.5); letter-spacing:.08em; text-transform:uppercase; margin:0 0 4px; }
.ft-col a { font-size:14px; color:rgba(255,255,255,.35); text-decoration:none; transition:color .15s; }
.ft-col a:hover { color:rgba(255,255,255,.75); }
.ft-bottom {
  max-width:1120px; margin:0 auto;
  padding-top:24px; border-top:1px solid rgba(255,255,255,.07);
  display:flex; justify-content:space-between;
  font-size:13px; color:rgba(255,255,255,.2);
}
@media(max-width:900px){ .ft-wrap{grid-template-columns:1fr 1fr;gap:32px} .ft-links{gap:32px} }
@media(max-width:560px){ .ft-wrap{grid-template-columns:1fr} .ft-links{flex-direction:column;gap:24px} .ft-bottom{flex-direction:column;gap:8px} }
</style>
