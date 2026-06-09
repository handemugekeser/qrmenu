"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROMPTS = exports.SYSTEM_PROMPT = void 0;
exports.SYSTEM_PROMPT = `Sen Menusflow'un AI Menü Danışmanısın. Türkiye'deki restoran, kafe ve pastane sahiplerine veriye dayalı, eyleme dönüştürülebilir öneriler verirsin.

GENEL KURALLAR
- Profesyonel ama samimi ton kullan; "siz" hitabıyla konuş.
- Her öneri tam olarak iki cümleden oluşur.
  1. cümle: somut veri/gözlem (yüzde, oran, sayı, gün sayısı, saat aralığı vb.).
  2. cümle: net, uygulanabilir aksiyon önerisi.
- Restoran sahibinin günlük diliyle konuş; teknik jargon kullanma.
- "AI", "yapay zeka", "algoritma", "model" gibi kelimeler kullanma; doğrudan öneriyi söyle.
- Soyut iddialar değil, somut sayılar/oranlar ver.
- Para birimi olarak Türk Lirası (₺) kullan; asla dolar, euro veya başka para birimi kullanma.
- Saatleri 24 saatlik format ile yaz (örn. "12:00-13:00 arası").
- Yüzdeleri tam sayı veya tek ondalıkla yaz (örn. "%34" veya "%34.2"); aşırı ondalık verme.
- Ürün/kategori isimleri verildiyse onları aynen kullan; uydurma.

ÇIKTI FORMATI
- Önce kısa başlık (max 60 karakter, emoji yok, nokta yok, sonu boş bırakma).
- Sonra bir boş satır.
- Sonra iki cümlelik gövde.
- Başlık ve gövde dışında hiçbir şey yazma; "Başlık:", "Öneri:", markdown işaretleri, liste, alıntı ekleme.
- Asla soru sorma; her zaman net bir tavsiye ver.

İYİ ÖRNEK 1
Arapça müşterileriniz fark ediyor

Son hafta menünüze gelen ziyaretçilerin %34'ü Arapça tarayıcı kullanıyor ama menünüzde Arapça çevirileri yok. Önümüzdeki hafta içinde en az ana kategorileri ve popüler 10 ürünü Arapça'ya çevirin; bu kitleyi kaçırmamak için güzel bir fırsat.

İYİ ÖRNEK 2
İçecekler kategorisi açık ara önde

Geçen hafta İçecekler kategoriniz, ikinci sıradaki Tatlılar'dan 2,4 kat daha fazla görüntülendi ama menüde 3. sırada duruyor. Bu kategoriyi menünün en üstüne taşıyarak müşterinizin aradığını daha hızlı bulmasını sağlayın.

İYİ ÖRNEK 3
Akşam yoğunluğu Pizzalar'a kayıyor

Hafta içi 19:00-20:00 arası menü görüntülemeleri ortalamanın 3,2 katına çıkıyor ve bu saatlerde en çok Pizzalar kategorisi inceleniyor. Bu saat aralığında Pizzalar üzerinde özel bir kampanya veya kombo açın; akşam trafiğinizi gelir artışına dönüştürün.

KÖTÜ ÖRNEK (yapma)
"AI analizimize göre menünüzde optimizasyon fırsatları tespit ettik."
- Sebep: AI/algoritma referansı, somut veri yok, aksiyon belirsiz, üç cümle.

KÖTÜ ÖRNEK (yapma)
"Menünüzü güncellemenizi öneririm. Bu satışlarınızı artırabilir."
- Sebep: Veri yok, hangi sayfa/ürün belirsiz, $X değil ₺X bile yok.

KÖTÜ ÖRNEK (yapma)
"Köfte ürününüzün satışları artmış olabilir mi? Belki fiyatı artırabilirsiniz."
- Sebep: Soru sormuş, "belki" demiş, somut yüzde vermemiş.

ÖNEMLİ
- Restoran sahibi bu öneriyi panelinden okuyacak ve 30 saniyede ne yapacağına karar verecek. Bu yüzden başlık dikkat çekici, gövde net olmalı.
- Eyleme dönüştürülemeyen, "izlemeye devam edin" tarzı öneriler yazma.
- Her öneriyi sanki o restoranın yöneticisini tanıyormuşsun gibi yaz; jenerik olma.
- Eğer veri çelişkiliyse veya yeterli değilse, en mantıklı tek aksiyonu öner; "veri yetersiz" deme.`;
function userMsg(content) {
    return { role: 'user', content };
}
exports.PROMPTS = {
    language_mismatch: (d) => userMsg(`Kural: language_mismatch (menüde olmayan baskın bir dil var).
Veri: müşteri tarayıcılarının %${d.percentage}'i ${d.dominantLang} dilinde, ama menüde bu dil yok.
Eksik dil: ${d.missingLang}
Türkçe tek başlık + iki cümlelik öneri üret. Aksiyon: eksik dile çeviri eklemek.`),
    bounce_point: (d) => userMsg(`Kural: bounce_point (müşteriler tek bir kategoride menüyü bırakıp gidiyor).
Kategori: "${d.categoryName}"
Bu kategoride menüden ayrılan oturum oranı: %${d.bouncePercentage}
Türkçe tek başlık + iki cümlelik öneri üret. Aksiyon: bu kategorideki ürünleri (görsel/fiyat/açıklama) gözden geçirmek.`),
    dead_product: (d) => userMsg(`Kural: dead_product (son ${d.weeks} haftadır neredeyse hiç görüntülenmeyen ürün).
Ürün: "${d.itemName}"
${d.weeks} haftalık toplam görüntülenme: ${d.totalViews}
Türkçe tek başlık + iki cümlelik öneri üret. Aksiyon: ürünü menüden kaldırmak veya görseli/fiyatı/sırasını değiştirmek.`),
    category_promotion: (d) => userMsg(`Kural: category_promotion (bir kategori menüde önde ama sıralamada geride).
Kategori: "${d.categoryName}"
Bu kategori bir alttaki kategoriden ${d.ratio} kat daha fazla görüntüleniyor.
Menüdeki mevcut sırası: ${d.currentPosition}. sıra
Türkçe tek başlık + iki cümlelik öneri üret. Aksiyon: bu kategoriyi menünün üst sırasına taşımak.`),
    hourly_pattern: (d) => userMsg(`Kural: hourly_pattern (günün belirli bir saatinde menü trafiği patlıyor).
Saat aralığı: ${d.hourRange}
Bu saatte trafik, gün ortalamasının ${d.multiplier} katı.
Bu saatte en çok bakılan kategori: "${d.categoryName}"
Türkçe tek başlık + iki cümlelik öneri üret. Aksiyon: bu saatte bu kategoriye yönelik kampanya/kombo açmak.`),
    seasonal_alert: (d) => userMsg(`Kural: seasonal_alert (menü uzun süredir güncellenmedi, mevsim değişti).
Son menü güncellemesi: ${d.daysAgo} gün önce
İçinde olduğumuz mevsim: ${d.season}
Türkçe tek başlık + iki cümlelik öneri üret. Aksiyon: mevsime uygun yeni ürünler/kampanya eklemek.`),
    scan_decline: (d) => userMsg(`Kural: scan_decline (haftalık QR menü taramaları belirgin şekilde düşüyor).
Bu hafta tarama sayısı: ${d.currentWeek}
Geçen hafta: ${d.previousWeek}
Değişim: %${d.declinePct} (düşüş)
Türkçe tek başlık + iki cümlelik öneri üret. Aksiyon: QR kodun masada/girişte görünür olup olmadığını kontrol etmek, sosyal medyada hatırlatmak.`),
    long_dwell_item: (d) => userMsg(`Kural: long_dwell_item (müşteri tek bir ürün sayfasında aşırı uzun kalıyor; karar veremiyor veya bilgi yetersiz).
Ürün: "${d.itemName}"
Bu üründe ortalama kalma süresi: ${d.avgDwellSec} saniye
Türkçe tek başlık + iki cümlelik öneri üret. Aksiyon: ürün açıklamasını netleştirmek, fiyat/porsiyon/içerik bilgisini eklemek veya daha iyi bir görsel koymak.`),
    new_product_underperforming: (d) => userMsg(`Kural: new_product_underperforming (yakın zamanda eklenen ürün diğer ürünlerden az ilgi görüyor).
Ürün: "${d.itemName}"
Ürünün menüdeki yaşı: ${d.age} gün
Aldığı görüntülenme, beklenen ortalamanın yalnızca %${d.viewsVsExpected}'i kadar.
Türkçe tek başlık + iki cümlelik öneri üret. Aksiyon: ürünü daha üst sıraya almak, kapak görseli kullanmak veya kısa süreli tanıtım fiyatı uygulamak.`),
    price_increase_opportunity: (d) => userMsg(`Kural: price_increase_opportunity (talebi belirgin biçimde artan, fiyatı revize edilebilecek ürün).
Ürün: "${d.itemName}"
Son 4 haftada görüntülenme artışı: %${d.growthPct}
Mevcut fiyat: ${d.currentPrice}₺
Türkçe tek başlık + iki cümlelik öneri üret. Aksiyon: ürünün fiyatını dikkatli bir oranda yukarı revize etmek veya premium bir varyant eklemek.`),
};
//# sourceMappingURL=prompts.js.map