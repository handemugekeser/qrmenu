export type ActivityType = 'SCAN' | 'MENU_UPDATE' | 'NEW_QR' | 'NEW_BUSINESS' | 'PLAN_UPGRADE'

export interface ActivityItem {
  id: string
  type: ActivityType
  title: string
  meta: string
  ago: string  // pre-formatted "5 dk önce"
  color: string
}

export const activityFeed: ActivityItem[] = [
  { id: 'a1', type: 'SCAN', title: '14 yeni tarama', meta: 'Ana Menü · Kebapçı Mehmet', ago: '5 dk önce', color: '#3b5bdb' },
  { id: 'a2', type: 'MENU_UPDATE', title: 'Brunch Menü güncellendi', meta: '3 yeni ürün eklendi', ago: '23 dk önce', color: '#10b981' },
  { id: 'a3', type: 'NEW_QR', title: 'Yeni QR oluşturuldu', meta: 'Masa 12 · Pizza Point', ago: '1 sa önce', color: '#a855f7' },
  { id: 'a4', type: 'SCAN', title: '38 yeni tarama', meta: 'Kahve & Tatlı · Cafe Noir', ago: '2 sa önce', color: '#3b5bdb' },
  { id: 'a5', type: 'PLAN_UPGRADE', title: 'PRO planına geçildi', meta: 'Otomatik yenileme aktif', ago: '5 sa önce', color: '#f59e0b' },
  { id: 'a6', type: 'NEW_BUSINESS', title: 'Yeni işletme: Cafe Breeze', meta: 'Kuruluş tamamlandı', ago: 'Dün', color: '#0ea5e9' },
  { id: 'a7', type: 'SCAN', title: '127 tarama', meta: 'Ana Menü · Premium Steakhouse', ago: 'Dün', color: '#3b5bdb' },
  { id: 'a8', type: 'MENU_UPDATE', title: 'Pide menüsü düzenlendi', meta: 'Fiyat güncellemesi', ago: '2 gün önce', color: '#10b981' },
  { id: 'a9', type: 'NEW_QR', title: '6 yeni QR', meta: 'Masa 7-12 · Burger Shop', ago: '2 gün önce', color: '#a855f7' },
  { id: 'a10', type: 'SCAN', title: '64 tarama', meta: 'Sushi Bar Tokyo · Ana Menü', ago: '3 gün önce', color: '#3b5bdb' },
]
