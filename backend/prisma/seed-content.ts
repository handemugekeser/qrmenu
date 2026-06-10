// Rich QR-menu content for 4 distinct business types.
// Run after the main seed (idempotent: skips if menu already has categories).
import { PrismaClient, Language } from '@prisma/client';

interface VariantSpec { name: string; price: number; isDefault?: boolean }
interface ExtraSpec { name: string; price: number; isRequired?: boolean; maxSelect?: number }
interface ProductSpec {
  name: string;
  nameEn?: string;
  description?: string;
  descriptionEn?: string;
  basePrice: number;
  calories?: number;
  allergens?: string[];
  isPopular?: boolean;
  variants?: VariantSpec[];
  extras?: ExtraSpec[];
}
interface CategorySpec {
  name: string;
  nameEn?: string;
  description?: string;
  products: ProductSpec[];
}
interface BusinessContent {
  slug: string;
  themeColor: string;
  qrCount: number;
  categories: CategorySpec[];
}

// ───────────────────────────────────────────────────────────
// 1) TÜRK LOKANTASI — Kebapçı Mehmet
// ───────────────────────────────────────────────────────────
const TURK_LOKANTASI: BusinessContent = {
  slug: 'kebapci-mehmet',
  themeColor: '#FF6B35',
  qrCount: 12,
  categories: [
    {
      name: 'Başlangıçlar', nameEn: 'Starters',
      products: [
        { name: 'Humus', nameEn: 'Hummus', description: 'Nohut püresi, tahin, zeytinyağı', basePrice: 95, isPopular: true,
          extras: [{ name: 'Ekstra Ekmek', price: 15 }, { name: 'Acı Sos', price: 10 }] },
        { name: 'Haydari', nameEn: 'Haydari', description: 'Süzme yoğurt, nane, sarımsak', basePrice: 75 },
        { name: 'Çoban Salatası', nameEn: 'Shepherd Salad', description: 'Domates, salatalık, soğan, biber', basePrice: 85, calories: 180 },
        { name: 'Mevsim Salata', nameEn: 'Seasonal Salad', basePrice: 95, calories: 160 },
        { name: 'Sigara Böreği', nameEn: 'Cheese Rolls', description: '5 adet, beyaz peynirli', basePrice: 110, allergens: ['gluten', 'milk'] },
      ],
    },
    {
      name: 'Çorbalar', nameEn: 'Soups',
      products: [
        { name: 'Mercimek Çorbası', nameEn: 'Lentil Soup', basePrice: 65, isPopular: true, calories: 220 },
        { name: 'İşkembe Çorbası', nameEn: 'Tripe Soup', basePrice: 95 },
        { name: 'Yayla Çorbası', nameEn: 'Yogurt Soup', basePrice: 75 },
      ],
    },
    {
      name: 'Kebaplar', nameEn: 'Kebabs',
      products: [
        { name: 'Adana Kebap', nameEn: 'Adana Kebab', description: 'Acılı kıyma kebabı, lavaş', basePrice: 280, isPopular: true, calories: 680,
          variants: [
            { name: 'Tek (180g)', price: 280, isDefault: true },
            { name: 'Çift (320g)', price: 460 },
            { name: 'Karışık', price: 320 },
          ],
          extras: [{ name: 'Ekstra Pilav', price: 35 }, { name: 'Bulgur Pilavı', price: 35 }, { name: 'Acılı Ezme', price: 20 }],
        },
        { name: 'Urfa Kebap', nameEn: 'Urfa Kebab', description: 'Acısız kıyma kebabı', basePrice: 280, calories: 660,
          variants: [{ name: 'Tek', price: 280, isDefault: true }, { name: 'Çift', price: 460 }] },
        { name: 'Tavuk Şiş', nameEn: 'Chicken Skewer', description: 'Marine edilmiş tavuk', basePrice: 235, isPopular: true },
        { name: 'Et Şiş', nameEn: 'Meat Skewer', description: 'Dana antrikot', basePrice: 360 },
        { name: 'Beyti', nameEn: 'Beyti', description: 'Yufka sarmalı kebap, yoğurt', basePrice: 340, allergens: ['gluten', 'milk'] },
      ],
    },
    {
      name: 'Pide & Lahmacun', nameEn: 'Pide & Lahmacun',
      products: [
        { name: 'Karışık Pide', nameEn: 'Mixed Pide', description: 'Kuşbaşı, sucuk, kaşar', basePrice: 195, isPopular: true, allergens: ['gluten', 'milk'] },
        { name: 'Kaşarlı Pide', nameEn: 'Cheese Pide', basePrice: 175, allergens: ['gluten', 'milk'] },
        { name: 'Kıymalı Pide', nameEn: 'Minced Meat Pide', basePrice: 185, allergens: ['gluten'] },
        { name: 'Lahmacun', nameEn: 'Lahmacun', description: 'Acılı/acısız seçeneği', basePrice: 55,
          variants: [{ name: 'Acılı', price: 55, isDefault: true }, { name: 'Acısız', price: 55 }] },
      ],
    },
    {
      name: 'Tatlılar', nameEn: 'Desserts',
      products: [
        { name: 'Künefe', nameEn: 'Künefe', description: 'Antep fıstıklı, sıcak servis', basePrice: 165, isPopular: true, allergens: ['gluten', 'milk', 'nuts'] },
        { name: 'Baklava', nameEn: 'Baklava', description: 'Fıstıklı, 3 dilim', basePrice: 145, allergens: ['gluten', 'nuts'] },
        { name: 'Sütlaç', nameEn: 'Rice Pudding', basePrice: 85, allergens: ['milk'] },
      ],
    },
    {
      name: 'İçecekler', nameEn: 'Beverages',
      products: [
        { name: 'Ayran', nameEn: 'Ayran', basePrice: 25,
          variants: [{ name: 'Küçük (250ml)', price: 25, isDefault: true }, { name: 'Büyük (500ml)', price: 45 }] },
        { name: 'Şalgam', nameEn: 'Şalgam', basePrice: 35 },
        { name: 'Türk Çayı', nameEn: 'Turkish Tea', basePrice: 20 },
        { name: 'Türk Kahvesi', nameEn: 'Turkish Coffee', basePrice: 55 },
        { name: 'Limonata', nameEn: 'Lemonade', basePrice: 65 },
        { name: 'Cola', basePrice: 45 },
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────
// 2) CAFE — Cafe Noir
// ───────────────────────────────────────────────────────────
const CAFE: BusinessContent = {
  slug: 'cafe-noir',
  themeColor: '#3b5bdb',
  qrCount: 18,
  categories: [
    {
      name: 'Sıcak Kahveler', nameEn: 'Hot Coffees',
      products: [
        { name: 'Espresso', basePrice: 55,
          variants: [{ name: 'Single', price: 55, isDefault: true }, { name: 'Double', price: 75 }] },
        { name: 'Americano', basePrice: 70, calories: 15 },
        { name: 'Cappuccino', basePrice: 85, isPopular: true, calories: 120, allergens: ['milk'],
          variants: [{ name: 'Single (240ml)', price: 85, isDefault: true }, { name: 'Double (360ml)', price: 105 }],
          extras: [{ name: 'Ekstra Shot', price: 15 }, { name: 'Vanilya Şurubu', price: 12 }, { name: 'Karamel Şurubu', price: 12 }] },
        { name: 'Latte', basePrice: 90, isPopular: true, allergens: ['milk'],
          extras: [{ name: 'Vanilya', price: 12 }, { name: 'Karamel', price: 12 }, { name: 'Fındık', price: 12 }] },
        { name: 'Flat White', basePrice: 90, allergens: ['milk'] },
        { name: 'Mocha', basePrice: 95, allergens: ['milk'] },
        { name: 'Türk Kahvesi', nameEn: 'Turkish Coffee', basePrice: 60,
          variants: [{ name: 'Az Şekerli', price: 60, isDefault: true }, { name: 'Orta', price: 60 }, { name: 'Sade', price: 60 }] },
      ],
    },
    {
      name: 'Soğuk Kahveler', nameEn: 'Cold Coffees',
      products: [
        { name: 'Ice Latte', basePrice: 95, isPopular: true, allergens: ['milk'] },
        { name: 'Ice Americano', basePrice: 75 },
        { name: 'Frappuccino', basePrice: 115, isPopular: true, allergens: ['milk'],
          variants: [{ name: 'Karamel', price: 115, isDefault: true }, { name: 'Mocha', price: 115 }, { name: 'Vanilya', price: 115 }] },
        { name: 'Cold Brew', basePrice: 90 },
      ],
    },
    {
      name: 'Çaylar', nameEn: 'Teas',
      products: [
        { name: 'Earl Grey', basePrice: 50 },
        { name: 'Yeşil Çay', nameEn: 'Green Tea', basePrice: 50 },
        { name: 'Bitki Çayı', nameEn: 'Herbal Tea', basePrice: 55,
          variants: [{ name: 'Papatya', price: 55, isDefault: true }, { name: 'Ihlamur', price: 55 }, { name: 'Adaçayı', price: 55 }] },
        { name: 'Chai Latte', basePrice: 85, allergens: ['milk'] },
      ],
    },
    {
      name: 'Tatlılar', nameEn: 'Desserts',
      products: [
        { name: 'Cheesecake', description: 'San Sebastian usulü', basePrice: 145, isPopular: true, allergens: ['gluten', 'milk', 'egg'] },
        { name: 'Brownie', description: 'Sıcak, dondurma ile', basePrice: 135, allergens: ['gluten', 'milk', 'egg', 'nuts'] },
        { name: 'Tiramisu', basePrice: 145, allergens: ['gluten', 'milk', 'egg'] },
        { name: 'Mousse au Chocolat', nameEn: 'Chocolate Mousse', basePrice: 125, allergens: ['milk', 'egg'] },
        { name: 'Macaron', description: '3 adet karışık', basePrice: 95, allergens: ['nuts', 'egg'] },
      ],
    },
    {
      name: 'Atıştırmalıklar', nameEn: 'Snacks',
      products: [
        { name: 'Croissant', description: 'Sade ya da çikolatalı', basePrice: 65, allergens: ['gluten', 'milk'],
          variants: [{ name: 'Sade', price: 65, isDefault: true }, { name: 'Çikolatalı', price: 75 }, { name: 'Bademli', price: 80 }] },
        { name: 'Avokadolu Tost', nameEn: 'Avocado Toast', description: 'Tam buğday, çekirdek, lime', basePrice: 165, isPopular: true, allergens: ['gluten'] },
        { name: 'Kulüp Sandviç', nameEn: 'Club Sandwich', basePrice: 185, allergens: ['gluten', 'milk', 'egg'] },
        { name: 'Caesar Salad', basePrice: 175, allergens: ['gluten', 'milk', 'egg'] },
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────
// 3) PIZZA — Pizza Point
// ───────────────────────────────────────────────────────────
const PIZZA: BusinessContent = {
  slug: 'pizza-point',
  themeColor: '#10b981',
  qrCount: 15,
  categories: [
    {
      name: 'Klasik Pizzalar', nameEn: 'Classic Pizzas',
      products: [
        { name: 'Margherita', description: 'Domates sosu, mozzarella, fesleğen', basePrice: 165, isPopular: true, allergens: ['gluten', 'milk'],
          variants: [
            { name: 'Küçük (24cm)', price: 165, isDefault: true },
            { name: 'Orta (32cm)', price: 215 },
            { name: 'Büyük (40cm)', price: 285 },
          ],
          extras: [
            { name: 'Ekstra Peynir', price: 20 },
            { name: 'Mantar', price: 15 },
            { name: 'Zeytin', price: 12 },
            { name: 'Soğan', price: 10 },
          ] },
        { name: 'Pepperoni', description: 'Pepperoni, mozzarella', basePrice: 195, isPopular: true, allergens: ['gluten', 'milk'],
          variants: [{ name: 'Küçük', price: 195, isDefault: true }, { name: 'Orta', price: 245 }, { name: 'Büyük', price: 315 }] },
        { name: 'Quattro Formaggi', description: '4 peynir karışımı', basePrice: 235, allergens: ['gluten', 'milk'],
          variants: [{ name: 'Küçük', price: 235, isDefault: true }, { name: 'Orta', price: 285 }, { name: 'Büyük', price: 355 }] },
        { name: 'Marinara', description: 'Domates sosu, sarımsak (peynirsiz)', basePrice: 145, allergens: ['gluten'] },
      ],
    },
    {
      name: 'Özel Pizzalar', nameEn: 'Specialty Pizzas',
      products: [
        { name: 'BBQ Chicken', description: 'BBQ sos, tavuk, soğan, mısır', basePrice: 245, isPopular: true, allergens: ['gluten', 'milk'],
          variants: [{ name: 'Küçük', price: 245, isDefault: true }, { name: 'Orta', price: 295 }, { name: 'Büyük', price: 365 }] },
        { name: 'Vegetarian', description: 'Mevsim sebzeleri, mantar, biber', basePrice: 215, allergens: ['gluten', 'milk'] },
        { name: 'Hawaii', description: 'Jambon, ananas, mozzarella', basePrice: 225, allergens: ['gluten', 'milk'] },
        { name: 'Tonno', description: 'Ton balığı, soğan, kapari', basePrice: 235, allergens: ['gluten', 'milk', 'fish'] },
        { name: 'Mantar & Trüf', nameEn: 'Mushroom & Truffle', basePrice: 295, isPopular: true, allergens: ['gluten', 'milk'] },
      ],
    },
    {
      name: 'Yan Lezzetler', nameEn: 'Sides',
      products: [
        { name: 'Tavuk Kanat', nameEn: 'Chicken Wings', description: '6 adet, BBQ sos', basePrice: 145,
          extras: [{ name: 'Ranch Sos', price: 15 }, { name: 'Acı Sos', price: 10 }] },
        { name: 'Patates Kızartması', nameEn: 'French Fries', basePrice: 75,
          variants: [{ name: 'Klasik', price: 75, isDefault: true }, { name: 'Parmesan', price: 95 }, { name: 'Acılı', price: 85 }] },
        { name: 'Sarımsaklı Ekmek', nameEn: 'Garlic Bread', basePrice: 65, allergens: ['gluten'] },
        { name: 'Mozzarella Stick', description: '5 adet, marinara sos', basePrice: 115, allergens: ['gluten', 'milk', 'egg'] },
      ],
    },
    {
      name: 'Salatalar', nameEn: 'Salads',
      products: [
        { name: 'Sezar Salata', nameEn: 'Caesar Salad', basePrice: 145, allergens: ['gluten', 'milk', 'egg'] },
        { name: 'Akdeniz Salata', nameEn: 'Mediterranean Salad', basePrice: 135 },
        { name: 'Quinoa Salatası', nameEn: 'Quinoa Salad', basePrice: 155 },
      ],
    },
    {
      name: 'İçecekler', nameEn: 'Beverages',
      products: [
        { name: 'Coca Cola', basePrice: 45,
          variants: [{ name: '330ml', price: 45, isDefault: true }, { name: '500ml', price: 60 }] },
        { name: 'Fanta', basePrice: 45 },
        { name: 'Sprite', basePrice: 45 },
        { name: 'Soda', basePrice: 25 },
        { name: 'Maden Suyu', nameEn: 'Mineral Water', basePrice: 25 },
        { name: 'Birra Moretti', description: '330ml', basePrice: 95, allergens: ['gluten'] },
      ],
    },
    {
      name: 'Tatlılar', nameEn: 'Desserts',
      products: [
        { name: 'Tiramisu', basePrice: 125, allergens: ['gluten', 'milk', 'egg'] },
        { name: 'Panna Cotta', basePrice: 105, allergens: ['milk'] },
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────
// 4) SUSHI BAR — Sushi Bar Tokyo
// ───────────────────────────────────────────────────────────
const SUSHI: BusinessContent = {
  slug: 'sushi-bar-tokyo',
  themeColor: '#a855f7',
  qrCount: 10,
  categories: [
    {
      name: 'Nigiri', nameEn: 'Nigiri',
      description: '2 adet, suşi pirinci üzerinde',
      products: [
        { name: 'Somon Nigiri', nameEn: 'Salmon Nigiri', basePrice: 95, isPopular: true, allergens: ['fish'] },
        { name: 'Ton Nigiri', nameEn: 'Tuna Nigiri', basePrice: 105, isPopular: true, allergens: ['fish'] },
        { name: 'Karides Nigiri', nameEn: 'Shrimp Nigiri', basePrice: 110, allergens: ['shellfish'] },
        { name: 'Tamago Nigiri', nameEn: 'Egg Nigiri', basePrice: 75, allergens: ['egg'] },
        { name: 'Unagi Nigiri', nameEn: 'Eel Nigiri', basePrice: 135, allergens: ['fish'] },
      ],
    },
    {
      name: 'Sashimi', nameEn: 'Sashimi',
      description: '5 adet ince dilim',
      products: [
        { name: 'Somon Sashimi', nameEn: 'Salmon Sashimi', basePrice: 195, isPopular: true, allergens: ['fish'] },
        { name: 'Ton Sashimi', nameEn: 'Tuna Sashimi', basePrice: 225, allergens: ['fish'] },
        { name: 'Karışık Sashimi', nameEn: 'Mixed Sashimi', description: '9 dilim (somon, ton, hamachi)', basePrice: 345, isPopular: true, allergens: ['fish'] },
      ],
    },
    {
      name: 'Maki Roll', nameEn: 'Maki Roll',
      description: '8 adet rulo',
      products: [
        { name: 'California Roll', description: 'Yengeç, avokado, salatalık', basePrice: 165, isPopular: true, allergens: ['shellfish'] },
        { name: 'Philadelphia Roll', description: 'Somon, krem peynir, salatalık', basePrice: 185, allergens: ['fish', 'milk'] },
        { name: 'Spicy Tuna Roll', description: 'Acılı ton, salatalık', basePrice: 175, isPopular: true, allergens: ['fish'] },
        { name: 'Rainbow Roll', description: 'California üzerinde 5 çeşit balık', basePrice: 245, allergens: ['fish', 'shellfish'] },
        { name: 'Vegetable Roll', description: 'Avokado, salatalık, havuç', basePrice: 125 },
        { name: 'Dragon Roll', description: 'Unagi, avokado, salatalık', basePrice: 275, allergens: ['fish'] },
      ],
    },
    {
      name: 'Çorba & Salata', nameEn: 'Soup & Salad',
      products: [
        { name: 'Miso Çorbası', nameEn: 'Miso Soup', description: 'Tofu, deniz yosunu, scallion', basePrice: 65, allergens: ['soy'] },
        { name: 'Edamame', description: 'Tuzlanmış yeşil soya', basePrice: 75, allergens: ['soy'] },
        { name: 'Wakame Salata', nameEn: 'Wakame Salad', description: 'Deniz yosunu, susam', basePrice: 95, allergens: ['soy'] },
      ],
    },
    {
      name: 'Ana Yemekler', nameEn: 'Main Dishes',
      products: [
        { name: 'Yaki Udon', description: 'Tavuk veya sebzeli kalın erişte', basePrice: 215, allergens: ['gluten', 'soy'],
          variants: [{ name: 'Tavuklu', price: 215, isDefault: true }, { name: 'Karidesli', price: 245 }, { name: 'Sebzeli', price: 195 }] },
        { name: 'Chicken Teriyaki', description: 'Pilav, mevsim sebzeleri ile', basePrice: 245, isPopular: true, allergens: ['soy'] },
        { name: 'Salmon Teriyaki', basePrice: 295, allergens: ['fish', 'soy'] },
      ],
    },
    {
      name: 'İçecekler', nameEn: 'Beverages',
      products: [
        { name: 'Yeşil Çay', nameEn: 'Green Tea', basePrice: 45 },
        { name: 'Sake', description: '180ml', basePrice: 145,
          variants: [{ name: 'Sıcak', price: 145, isDefault: true }, { name: 'Soğuk', price: 145 }] },
        { name: 'Asahi Bira', nameEn: 'Asahi Beer', basePrice: 95, allergens: ['gluten'] },
        { name: 'Ramune', description: 'Japon limonatası', basePrice: 75 },
        { name: 'Maden Suyu', nameEn: 'Mineral Water', basePrice: 25 },
      ],
    },
  ],
};

const ALL_CONTENT: BusinessContent[] = [TURK_LOKANTASI, CAFE, PIZZA, SUSHI];

export async function seedContent(prisma: PrismaClient) {
  console.log('\n🍽️  Seeding rich QR-menu content for 4 business types...');

  for (const content of ALL_CONTENT) {
    const business = await prisma.business.findUnique({ where: { slug: content.slug } });
    if (!business) {
      console.log(`  ⚠️  ${content.slug}: business not found, skipping.`);
      continue;
    }

    let menu = await prisma.menu.findFirst({
      where: { businessId: business.id, isDefault: true },
    });
    if (!menu) {
      menu = await prisma.menu.findFirst({ where: { businessId: business.id } });
    }
    if (!menu) {
      console.log(`  ⚠️  ${content.slug}: no menu found, skipping.`);
      continue;
    }

    const existingCats = await prisma.category.count({ where: { menuId: menu.id } });
    if (existingCats > 0) {
      console.log(`  ⏭️  ${business.name}: already has ${existingCats} categories, skipping.`);
      continue;
    }

    // Update menu theme color to match business type
    await prisma.menu.update({
      where: { id: menu.id },
      data: { themeColor: content.themeColor },
    });

    let categoryOrder = 0;
    let productTotal = 0;

    for (const catSpec of content.categories) {
      const category = await prisma.category.create({
        data: {
          menuId: menu.id,
          name: catSpec.name,
          description: catSpec.description,
          sortOrder: categoryOrder++,
        },
      });

      if (catSpec.nameEn) {
        await prisma.translation.create({
          data: {
            entityType: 'category',
            entityId: category.id,
            categoryId: category.id,
            language: Language.EN,
            field: 'name',
            value: catSpec.nameEn,
          },
        });
      }

      let productOrder = 0;
      for (const prodSpec of catSpec.products) {
        const product = await prisma.product.create({
          data: {
            categoryId: category.id,
            name: prodSpec.name,
            description: prodSpec.description,
            basePrice: prodSpec.basePrice,
            calories: prodSpec.calories,
            allergens: prodSpec.allergens || [],
            isPopular: prodSpec.isPopular ?? false,
            isAvailable: true,
            sortOrder: productOrder++,
          },
        });
        productTotal++;

        if (prodSpec.nameEn) {
          await prisma.translation.create({
            data: {
              entityType: 'product',
              entityId: product.id,
              productId: product.id,
              language: Language.EN,
              field: 'name',
              value: prodSpec.nameEn,
            },
          });
        }
        if (prodSpec.descriptionEn) {
          await prisma.translation.create({
            data: {
              entityType: 'product',
              entityId: product.id,
              productId: product.id,
              language: Language.EN,
              field: 'description',
              value: prodSpec.descriptionEn,
            },
          });
        }

        if (prodSpec.variants?.length) {
          await prisma.variant.createMany({
            data: prodSpec.variants.map((v, i) => ({
              productId: product.id,
              name: v.name,
              price: v.price,
              isDefault: v.isDefault ?? i === 0,
              sortOrder: i,
            })),
          });
        }

        if (prodSpec.extras?.length) {
          await prisma.extra.createMany({
            data: prodSpec.extras.map((e, i) => ({
              productId: product.id,
              name: e.name,
              price: e.price,
              isRequired: e.isRequired ?? false,
              maxSelect: e.maxSelect ?? 1,
              sortOrder: i,
            })),
          });
        }
      }
    }

    // QR codes (table QRs)
    const baseUrl = `https://qrmenu.app/menu/${business.slug}`;
    const qrData = Array.from({ length: content.qrCount }).map((_, i) => ({
      menuId: menu!.id,
      label: `Masa ${i + 1}`,
      tableNumber: i + 1,
      url: `${baseUrl}?table=${i + 1}`,
    }));
    await prisma.qrCode.createMany({ data: qrData });

    console.log(
      `  ✅ ${business.name}: ${content.categories.length} kategori, ${productTotal} ürün, ${content.qrCount} QR`,
    );
  }
}
