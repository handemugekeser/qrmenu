import { PrismaClient, SubscriptionPlan, Language, UserRole, DeviceType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { seedContent } from './seed-content';

const prisma = new PrismaClient();

const SUPER_ADMIN_EMAIL = 'hasan.siwi@gmail.com';

const DUMMY_USERS: Array<{
  email: string;
  name: string;
  plan: SubscriptionPlan;
  businesses: Array<{ name: string; slug: string; menus: string[] }>;
}> = [
  { email: 'mehmet@kebapci.com', name: 'Mehmet Yılmaz', plan: SubscriptionPlan.PRO, businesses: [
    { name: 'Kebapçı Mehmet', slug: 'kebapci-mehmet', menus: ['Ana Menü', 'Kahvaltı'] },
  ]},
  { email: 'ayse@cafenoir.com', name: 'Ayşe Demir', plan: SubscriptionPlan.PREMIUM, businesses: [
    { name: 'Cafe Noir', slug: 'cafe-noir', menus: ['Kahve & Tatlı', 'Atıştırmalık'] },
    { name: 'Cafe Noir Beşiktaş', slug: 'cafe-noir-besiktas', menus: ['Şube Menü'] },
  ]},
  { email: 'osman@pideci.com', name: 'Osman Kaya', plan: SubscriptionPlan.FREE, businesses: [
    { name: 'Pideci Osman', slug: 'pideci-osman', menus: ['Pide & Lahmacun'] },
  ]},
  { email: 'fatma@balikci.com', name: 'Fatma Şahin', plan: SubscriptionPlan.PRO, businesses: [
    { name: 'Balıkçı Fatma', slug: 'balikci-fatma', menus: ['Mevsim Menüsü'] },
  ]},
  { email: 'ali@pizzapoint.com', name: 'Ali Çelik', plan: SubscriptionPlan.PREMIUM, businesses: [
    { name: 'Pizza Point', slug: 'pizza-point', menus: ['Pizza', 'İçecek'] },
    { name: 'Pizza Point Express', slug: 'pizza-point-express', menus: ['Hızlı Menü'] },
    { name: 'Pizza Point Kadıköy', slug: 'pizza-point-kadikoy', menus: ['Kadıköy Şube'] },
  ]},
  { email: 'zeynep@brunchhouse.com', name: 'Zeynep Aksoy', plan: SubscriptionPlan.PRO, businesses: [
    { name: 'Brunch House', slug: 'brunch-house', menus: ['Brunch', 'Tatlı'] },
  ]},
  { email: 'emre@burgershop.com', name: 'Emre Yıldız', plan: SubscriptionPlan.FREE, businesses: [
    { name: 'Burger Shop', slug: 'burger-shop', menus: ['Burger'] },
  ]},
  { email: 'selin@kasapdoner.com', name: 'Selin Arslan', plan: SubscriptionPlan.PRO, businesses: [
    { name: 'Kasap Döner', slug: 'kasap-doner', menus: ['Döner & Lahmacun'] },
  ]},
  { email: 'baris@steakhouse.com', name: 'Barış Doğan', plan: SubscriptionPlan.PREMIUM, businesses: [
    { name: 'Premium Steakhouse', slug: 'premium-steakhouse', menus: ['Et', 'Şarap'] },
  ]},
  { email: 'gizem@sushibar.com', name: 'Gizem Polat', plan: SubscriptionPlan.PRO, businesses: [
    { name: 'Sushi Bar Tokyo', slug: 'sushi-bar-tokyo', menus: ['Sushi & Sashimi'] },
  ]},
  { email: 'kerem@meyhane.com', name: 'Kerem Acar', plan: SubscriptionPlan.FREE, businesses: [
    { name: 'Klasik Meyhane', slug: 'klasik-meyhane', menus: ['Rakı Sofrası'] },
  ]},
  { email: 'ipek@kahvaltici.com', name: 'İpek Tan', plan: SubscriptionPlan.PRO, businesses: [
    { name: 'Köy Kahvaltısı', slug: 'koy-kahvaltisi', menus: ['Serpme Kahvaltı'] },
  ]},
  { email: 'tolga@dondurma.com', name: 'Tolga Erdem', plan: SubscriptionPlan.FREE, businesses: [
    { name: 'Dondurma Dükkanı', slug: 'dondurma-dukkani', menus: ['Çeşitler'] },
  ]},
  { email: 'esra@vejetaryen.com', name: 'Esra Koç', plan: SubscriptionPlan.PRO, businesses: [
    { name: 'Yeşil Mutfak', slug: 'yesil-mutfak', menus: ['Vejetaryen', 'Vegan'] },
  ]},
  { email: 'mert@pubgrill.com', name: 'Mert Şen', plan: SubscriptionPlan.PRO, businesses: [
    { name: 'Pub & Grill', slug: 'pub-grill', menus: ['Bira & Atıştırmalık'] },
  ]},
  { email: 'deniz@cafebreeze.com', name: 'Deniz Kara', plan: SubscriptionPlan.FREE, businesses: [
    { name: 'Cafe Breeze', slug: 'cafe-breeze', menus: ['Kahve'] },
  ]},
  { email: 'yusuf@lokanta.com', name: 'Yusuf Erol', plan: SubscriptionPlan.PRO, businesses: [
    { name: 'Lokanta Klasik', slug: 'lokanta-klasik', menus: ['Ev Yemekleri'] },
  ]},
  { email: 'melisa@waffle.com', name: 'Melisa Uçar', plan: SubscriptionPlan.FREE, businesses: [
    { name: 'Waffle Stop', slug: 'waffle-stop', menus: ['Waffle Çeşitleri'] },
  ]},
];

const THEMES = ['#FF6B35', '#3b5bdb', '#768dfb', '#10b981', '#a855f7', '#f59e0b'];

async function main() {
  console.log('🌱 Seeding database...');
  const password = await bcrypt.hash('password123', 10);

  // Demo user (PREMIUM — owns the 4 rich businesses)
  const demo = await prisma.user.upsert({
    where: { email: 'demo@qrmenu.app' },
    update: { role: UserRole.USER, plan: SubscriptionPlan.PREMIUM },
    create: {
      email: 'demo@qrmenu.app',
      password,
      name: 'Demo Restaurant',
      plan: SubscriptionPlan.PREMIUM,
      role: UserRole.USER,
    },
  });

  // Super admin
  await prisma.user.upsert({
    where: { email: SUPER_ADMIN_EMAIL },
    update: { role: UserRole.SUPER_ADMIN, plan: SubscriptionPlan.PREMIUM },
    create: {
      email: SUPER_ADMIN_EMAIL,
      password,
      name: 'Hasan (menusflow)',
      plan: SubscriptionPlan.PREMIUM,
      role: UserRole.SUPER_ADMIN,
    },
  });

  // Remove legacy "Demo Restaurant" business — we replace it with 4 rich businesses below
  await prisma.business.deleteMany({ where: { slug: 'demo-restaurant' } });

  // Dummy users
  for (let i = 0; i < DUMMY_USERS.length; i++) {
    const u = DUMMY_USERS[i];
    const createdAt = new Date(Date.now() - (i + 1) * 3 * 24 * 60 * 60 * 1000); // staggered
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { plan: u.plan, role: UserRole.USER },
      create: {
        email: u.email,
        password,
        name: u.name,
        plan: u.plan,
        role: UserRole.USER,
        createdAt,
      },
    });

    for (const biz of u.businesses) {
      const business = await prisma.business.upsert({
        where: { slug: biz.slug },
        update: {},
        create: {
          userId: user.id,
          name: biz.name,
          slug: biz.slug,
          currency: 'TRY',
          defaultLang: Language.TR,
          phone: `+90 5${30 + (i % 60)} ${String(100 + i).padStart(3, '0')} ${String(1000 + i * 7).slice(-4)} `.trim(),
        },
      });

      for (let mi = 0; mi < biz.menus.length; mi++) {
        const existing = await prisma.menu.findFirst({
          where: { businessId: business.id, name: biz.menus[mi] },
        });
        if (existing) continue;
        const menu = await prisma.menu.create({
          data: {
            businessId: business.id,
            name: biz.menus[mi],
            isActive: true,
            isDefault: mi === 0,
            themeColor: THEMES[(i + mi) % THEMES.length],
          },
        });

        // Sprinkle some analytics so dashboards show data
        const devices: DeviceType[] = [DeviceType.MOBILE, DeviceType.TABLET, DeviceType.DESKTOP];
        const events = 5 + ((i * 3 + mi) % 20);
        const analyticsData = Array.from({ length: events }).map((_, k) => ({
          menuId: menu.id,
          deviceType: devices[k % 3],
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        }));
        await prisma.analytics.createMany({ data: analyticsData });
      }
    }
  }

  // Reassign 4 rich businesses to demo (so demo sees them on login)
  const RICH_SLUGS = ['kebapci-mehmet', 'cafe-noir', 'pizza-point', 'sushi-bar-tokyo'];
  for (const slug of RICH_SLUGS) {
    await prisma.business.updateMany({
      where: { slug },
      data: { userId: demo.id },
    });
  }
  console.log(`\n🔄 Reassigned ${RICH_SLUGS.length} rich businesses to demo@qrmenu.app`);

  // Rich QR-menu content for 4 distinct business types
  await seedContent(prisma);

  console.log('\n✅ Seed complete!');
  console.log(`📧 Demo: demo@qrmenu.app / password123`);
  console.log(`👑 Super Admin: ${SUPER_ADMIN_EMAIL} / password123`);
  console.log(`👥 ${DUMMY_USERS.length} dummy users with businesses & menus seeded.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
