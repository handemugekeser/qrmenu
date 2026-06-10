export interface ScanPoint {
  date: string  // YYYY-MM-DD
  scans: number
  unique: number
}

export interface TopMenu {
  id: string
  name: string
  business: string
  scans: number
  trend: number  // % change vs previous period
  themeColor: string
}

export interface TopProduct {
  id: string
  name: string
  category: string
  views: number
  price: string
}

function buildTrend(days = 30): ScanPoint[] {
  const out: ScanPoint[] = []
  const now = Date.now()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now - i * 24 * 60 * 60 * 1000)
    const iso = d.toISOString().slice(0, 10)
    const base = 40 + Math.sin(i / 4) * 18 + Math.cos(i / 7) * 12
    const weekend = [0, 6].includes(d.getDay()) ? 1.35 : 1
    const noise = (Math.sin(i * 13) + 1) * 8
    const scans = Math.max(8, Math.round((base + noise) * weekend))
    out.push({ date: iso, scans, unique: Math.round(scans * 0.72) })
  }
  return out
}

export const scansTrend: ScanPoint[] = buildTrend(30)

export const topMenus: TopMenu[] = [
  { id: 'm1', name: 'Ana Menü', business: 'Kebapçı Mehmet', scans: 1284, trend: 18, themeColor: '#FF6B35' },
  { id: 'm2', name: 'Brunch Menü', business: 'Cafe Noir', scans: 962, trend: 7, themeColor: '#3b5bdb' },
  { id: 'm3', name: 'Pizza Menüsü', business: 'Pizza Point', scans: 814, trend: -3, themeColor: '#10b981' },
]

export const topProducts: TopProduct[] = [
  { id: 'p1', name: 'Adana Kebap', category: 'Ana Yemekler', views: 542, price: '₺220' },
  { id: 'p2', name: 'Cappuccino', category: 'Kahveler', views: 488, price: '₺55' },
  { id: 'p3', name: 'Margarita Pizza', category: 'Pizzalar', views: 451, price: '₺185' },
  { id: 'p4', name: 'Cheeseburger', category: 'Burgerler', views: 412, price: '₺145' },
  { id: 'p5', name: 'Lahmacun', category: 'Ana Yemekler', views: 389, price: '₺55' },
]
