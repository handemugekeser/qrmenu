import { PrismaClient, SubscriptionPlan, Language } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo user
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'demo@qrmenu.app' },
    update: {},
    create: {
      email: 'demo@qrmenu.app',
      password: hashedPassword,
      name: 'Demo Restaurant',
      plan: SubscriptionPlan.PRO,
    },
  });

  // Create business
  const business = await prisma.business.upsert({
    where: { slug: 'demo-restaurant' },
    update: {},
    create: {
      userId: user.id,
      name: 'Demo Restaurant',
      slug: 'demo-restaurant',
      description: 'A wonderful dining experience',
      phone: '+90 212 555 0100',
      address: 'Bağcılar, Istanbul',
      currency: 'TRY',
      defaultLang: Language.TR,
    },
  });

  // Create menu
  const menu = await prisma.menu.create({
    data: {
      businessId: business.id,
      name: 'Ana Menü',
      description: 'Our main menu',
      isActive: true,
      isDefault: true,
      themeColor: '#FF6B35',
    },
  });

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        menuId: menu.id,
        name: 'Başlangıçlar',
        description: 'Starters & Appetizers',
        sortOrder: 1,
      },
    }),
    prisma.category.create({
      data: {
        menuId: menu.id,
        name: 'Ana Yemekler',
        description: 'Main Courses',
        sortOrder: 2,
      },
    }),
    prisma.category.create({
      data: {
        menuId: menu.id,
        name: 'İçecekler',
        description: 'Beverages',
        sortOrder: 3,
      },
    }),
    prisma.category.create({
      data: {
        menuId: menu.id,
        name: 'Tatlılar',
        description: 'Desserts',
        sortOrder: 4,
      },
    }),
  ]);

  // Products for starters
  const hummus = await prisma.product.create({
    data: {
      categoryId: categories[0].id,
      name: 'Humus',
      description: 'Nohut püresi, tahin, zeytinyağı ile',
      basePrice: 85.00,
      isAvailable: true,
      isPopular: true,
      sortOrder: 1,
    },
  });

  await prisma.product.create({
    data: {
      categoryId: categories[0].id,
      name: 'Çoban Salatası',
      description: 'Taze domates, salatalık, soğan',
      basePrice: 65.00,
      isAvailable: true,
      sortOrder: 2,
    },
  });

  // Products for main courses
  const adana = await prisma.product.create({
    data: {
      categoryId: categories[1].id,
      name: 'Adana Kebap',
      description: 'Acılı kıyma kebabı, lavaş ekmeği ile',
      basePrice: 220.00,
      isAvailable: true,
      isPopular: true,
      sortOrder: 1,
    },
  });

  await prisma.product.create({
    data: {
      categoryId: categories[1].id,
      name: 'Izgara Tavuk',
      description: 'Marine edilmiş tavuk göğsü, sebzeler ile',
      basePrice: 180.00,
      isAvailable: true,
      sortOrder: 2,
    },
  });

  // Variants for Adana
  await prisma.variant.createMany({
    data: [
      { productId: adana.id, name: 'Tek', price: 220.00, isDefault: true, sortOrder: 1 },
      { productId: adana.id, name: 'Çift', price: 380.00, sortOrder: 2 },
      { productId: adana.id, name: 'Karışık', price: 260.00, sortOrder: 3 },
    ],
  });

  // Extras for Hummus
  await prisma.extra.createMany({
    data: [
      { productId: hummus.id, name: 'Ekstra Ekmek', price: 15.00, sortOrder: 1 },
      { productId: hummus.id, name: 'Acı Sos', price: 10.00, sortOrder: 2 },
      { productId: hummus.id, name: 'Zeytinyağı +', price: 5.00, sortOrder: 3 },
    ],
  });

  // Beverages
  const ayran = await prisma.product.create({
    data: {
      categoryId: categories[2].id,
      name: 'Ayran',
      description: 'Ev yapımı taze ayran',
      basePrice: 25.00,
      isAvailable: true,
      sortOrder: 1,
    },
  });

  await prisma.variant.createMany({
    data: [
      { productId: ayran.id, name: 'Küçük (250ml)', price: 25.00, isDefault: true, sortOrder: 1 },
      { productId: ayran.id, name: 'Büyük (500ml)', price: 40.00, sortOrder: 2 },
    ],
  });

  await prisma.product.create({
    data: {
      categoryId: categories[2].id,
      name: 'Türk Çayı',
      description: 'Demlik çay',
      basePrice: 20.00,
      isAvailable: true,
      sortOrder: 2,
    },
  });

  // Desserts
  await prisma.product.create({
    data: {
      categoryId: categories[3].id,
      name: 'Baklava',
      description: 'Antep fıstıklı geleneksel baklava',
      basePrice: 120.00,
      isAvailable: true,
      isPopular: true,
      sortOrder: 1,
    },
  });

  // Translations (EN)
  await prisma.translation.createMany({
    data: [
      { entityType: 'category', entityId: categories[0].id, categoryId: categories[0].id, language: Language.EN, field: 'name', value: 'Starters' },
      { entityType: 'category', entityId: categories[1].id, categoryId: categories[1].id, language: Language.EN, field: 'name', value: 'Main Courses' },
      { entityType: 'category', entityId: categories[2].id, categoryId: categories[2].id, language: Language.EN, field: 'name', value: 'Beverages' },
      { entityType: 'category', entityId: categories[3].id, categoryId: categories[3].id, language: Language.EN, field: 'name', value: 'Desserts' },
      { entityType: 'product', entityId: hummus.id, productId: hummus.id, language: Language.EN, field: 'name', value: 'Hummus' },
      { entityType: 'product', entityId: hummus.id, productId: hummus.id, language: Language.EN, field: 'description', value: 'Chickpea puree with tahini and olive oil' },
    ],
  });

  // Sample analytics
  const deviceTypes = ['MOBILE', 'TABLET', 'DESKTOP'] as const;
  for (let i = 0; i < 30; i++) {
    await prisma.analytics.create({
      data: {
        menuId: menu.id,
        deviceType: deviceTypes[i % 3],
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      },
    });
  }

  console.log('✅ Seed complete!');
  console.log('📧 Email: demo@qrmenu.app');
  console.log('🔑 Password: password123');
  console.log(`🔗 Public menu: /menu/demo-restaurant`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
