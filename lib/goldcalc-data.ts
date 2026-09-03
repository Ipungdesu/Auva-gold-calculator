export type NewsItem = { id: number; title: string; source: string; published: string; category: string; summary: string }

export const goldPrice = { symbol: 'XAUUSD', price: 3428.60, change: 1.24, open: 3392.10, high: 3446.80, low: 3384.50, close: 3386.70, updated: '31 Aug 2026, 14:32 UTC' }

export const marketSeries = {
  '1D': [3390, 3398, 3394, 3408, 3412, 3405, 3418, 3425, 3419, 3432, 3428.6],
  '1W': [3338, 3352, 3344, 3370, 3362, 3388, 3395, 3412, 3407, 3428.6],
  '1M': [3185, 3210, 3198, 3250, 3278, 3245, 3308, 3330, 3370, 3405, 3428.6],
  '3M': [2890, 2940, 3015, 2980, 3070, 3125, 3090, 3210, 3265, 3330, 3428.6],
}

export const news: NewsItem[] = [
  { id: 1, title: 'Gold steadies near record levels as markets weigh rate outlook', source: 'MarketWatch', published: '2 hours ago', category: 'Gold Market', summary: 'Bullion prices held firm in afternoon trading as investors assessed the path of global interest rates and fresh macroeconomic data.' },
  { id: 2, title: 'US dollar retreats after softer inflation expectations', source: 'Reuters', published: '5 hours ago', category: 'US Dollar', summary: 'The dollar index eased modestly, supporting demand for dollar-denominated commodities including gold.' },
  { id: 3, title: 'Central banks maintain steady pace of gold purchases', source: 'World Gold Council', published: 'Yesterday', category: 'Central Bank', summary: 'Official-sector demand remains a meaningful theme in the gold market, according to the latest monthly data.' },
  { id: 4, title: 'Manufacturing data points to mixed global growth picture', source: 'Bloomberg', published: 'Yesterday', category: 'Economy', summary: 'New business surveys presented a varied picture across major economies ahead of the next policy meetings.' },
  { id: 5, title: 'Treasury yields edge lower ahead of key employment report', source: 'CNBC', published: '28 Aug 2026', category: 'Interest Rate', summary: 'Bond markets were quiet as traders positioned for incoming labor market data and its implications for policy.' },
  { id: 6, title: 'Geopolitical risk keeps safe-haven demand in focus', source: 'Financial Times', published: '27 Aug 2026', category: 'Geopolitical', summary: 'Investors continued to monitor developments that may influence demand for defensive assets.' },
]

export const mockOHLC = { open: 3386.7, high: 3446.8, low: 3384.5, close: 3428.6 }

export function calculatePivot(open: number, high: number, low: number, close: number) {
  const p = (high + low + close) / 3
  return { p, r1: 2 * p - low, r2: p + high - low, r3: high + 2 * (p - low), s1: 2 * p - high, s2: p - high + low, s3: low - 2 * (high - p) }
}

export const purityFactors: Record<string, number> = { '24K': 1, '23K': 23 / 24, '22K': 22 / 24, '21K': 21 / 24, '18K': 18 / 24 }
export const money = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n)
export const number = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
export const categories = ['All', 'Gold Market', 'Economy', 'Inflation', 'US Dollar', 'Interest Rate', 'Central Bank', 'Geopolitical']

export type PivotResult = ReturnType<typeof calculatePivot>
export type GoldHistory = { id: string; weight: number; purity: string; price: number; result: number; date: string }
export type PivotHistory = { id: string; type: string; ohlc: typeof mockOHLC; result: PivotResult; date: string }
export const defaultPivot = calculatePivot(mockOHLC.open, mockOHLC.high, mockOHLC.low, mockOHLC.close)

export function getGreeting() { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening' }

