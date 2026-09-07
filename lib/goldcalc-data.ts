export type NewsItem = {
  id: number
  title: string
  source: string
  published: string
  category: string
  summary: string
  image?: string
  url?: string
}

export const goldPrice = {
  symbol: 'XAUUSD',
  price: 2341.12,
  change: 0.32,
  open: 2335.15,
  high: 2352.15,
  low: 2330.10,
  close: 2341.12,
  r1: 2352.15,
  s1: 2330.10,
  updated: 'Sep 7, 2026, 08:30 UTC',
}

export const marketSeries = {
  '1D': [2330, 2335, 2332, 2339, 2336, 2345, 2341, 2348, 2343, 2352, 2341.12],
  '1W': [2310, 2322, 2318, 2335, 2328, 2340, 2336, 2345, 2342, 2350, 2341.12],
  '1M': [2280, 2295, 2290, 2315, 2330, 2320, 2340, 2335, 2345, 2348, 2341.12],
  '3M': [2150, 2200, 2230, 2210, 2270, 2310, 2290, 2330, 2325, 2340, 2341.12],
}

export const news: NewsItem[] = [
  {
    id: 1,
    title: 'Central Banks Continue to Accumulate Gold Reserves',
    source: 'Financial Times',
    published: 'Oct 24, 2024',
    category: 'Central Bank',
    summary: 'Global central banks extended their gold buying streak into the third quarter, signaling continued efforts to diversify strategic reserves amid geopolitical shifts.',
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    title: 'US Dollar Index Shows Resilience Ahead of Key Data',
    source: 'Bloomberg',
    published: 'Oct 23, 2024',
    category: 'US Dollar',
    summary: 'The DXY maintained its strength in early trading as investors await critical inflation metrics that could influence the Federal Reserve’s rate trajectory.',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    title: 'Physical Gold Demand Surges in Asian Markets',
    source: 'Reuters',
    published: 'Oct 22, 2024',
    category: 'Gold Market',
    summary: 'Retail and institutional demand for physical gold has seen a significant uptick in major Asian hubs, driven by seasonal purchasing and currency stability concerns.',
    image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 4,
    title: 'Geopolitical Tensions Keep Safe-Haven Assets Bid',
    source: 'WSJ',
    published: 'Oct 21, 2024',
    category: 'Geopolitical',
    summary: 'Ongoing regional conflicts continue to provide a strong floor for traditional safe-haven assets, as risk managers adjust macro portfolio allocations.',
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 5,
    title: 'Inflation Core Metrics Show Sticky Underlying Pressures',
    source: 'CNBC',
    published: 'Oct 20, 2024',
    category: 'Inflation',
    summary: 'The latest core PCE data indicates that while headline inflation cools, underlying price pressures in the services sector remain persistent.',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 6,
    title: 'Treasury Yields Stabilize as Market Digests Policy Paths',
    source: 'Auva Insights',
    published: 'Oct 19, 2024',
    category: 'Global Economy',
    summary: 'Bond markets found temporary equilibrium this week as traders balanced recent hawkish commentary against softer-than-expected retail growth.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
  },
]

export const categories = [
  'All News',
  'Global Economy',
  'US Dollar',
  'Central Bank',
  'Inflation',
  'Interest Rates',
  'Geopolitical',
  'Gold Market',
]

export const mockOHLC = {
  open: 2335.15,
  high: 2352.15,
  low: 2330.10,
  close: 2341.12,
}

export function calculatePivot(open: number, high: number, low: number, close: number) {
  const p = (high + low + close) / 3
  const r1 = 2 * p - low
  const r2 = p + (high - low)
  const r3 = high + 2 * (p - low)
  const r4 = r3 + (high - low)
  const s1 = 2 * p - high
  const s2 = p - (high - low)
  const s3 = low - 2 * (high - p)
  const s4 = s3 - (high - low)
  return { p, r1, r2, r3, r4, s1, s2, s3, s4 }
}

export const purityFactors: Record<string, number> = {
  '24K': 1,
  '23K': 23 / 24,
  '22K': 22 / 24,
  '21K': 21 / 24,
  '18K': 18 / 24,
}

export const money = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n)

export const formatRupiah = (n: number) =>
  `Rp ${Math.round(n).toLocaleString('id-ID')}`

export const number = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export type PivotResult = ReturnType<typeof calculatePivot>
export type GoldHistory = { id: string; capital: number; buyingPrice: number; sellingPrice: number; quantity: number; profit: number; date: string }
export type PivotHistory = { id: string; type: string; ohlc: typeof mockOHLC; result: PivotResult; date: string }
export const defaultPivot = calculatePivot(mockOHLC.open, mockOHLC.high, mockOHLC.low, mockOHLC.close)

export function getGreeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}
