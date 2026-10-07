export type Language = 'id' | 'en'

export interface Translations {
  // Header
  liveStatus: string

  // Hero
  heroTitle: string
  heroSubtitle: string

  // Market Indicators
  indicatorsTitle: string
  synced: string
  updatedAt: string
  spotGold: string
  exchangeRate: string

  // Quick Tools
  goldCalcTitle: string
  goldCalcDesc: string
  goldCalcBtn: string
  pivotTitle: string
  pivotDesc: string
  pivotBtn: string
  nestBtn: string
  newsTitle: string
  newsDesc: string
  newsBtn: string

  // Charts
  chartsTitle: string
  chartXauusd: string

  // News section
  newsHighlights: string
  viewAllNews: string
  readMore: string
  noNewsAvailable: string

  // States
  loading: string
  errorMessage: string
  retry: string
  lastUpdated: string
  dataUnavailable: string
}

export const translations: Record<Language, Translations> = {
  id: {
    liveStatus: 'LIVE',
    heroTitle: 'Kalkulasi & Informasi Pasar Auva',
    heroSubtitle:
      'Kalkulasi nilai emas fisik, analisis pivot point digital & NEST, data historis, serta berita fundamental pasar terkini.',
    indicatorsTitle: 'INDIKATOR REAL-TIME',
    synced: 'Sinkron',
    updatedAt: 'Diperbarui',
    spotGold: 'Spot Gold',
    exchangeRate: 'Kurs Rupiah (BI/Bank)',
    goldCalcTitle: 'Kalkulator Emas Fisik',
    goldCalcDesc: 'Hitung harga beli, jual, & spread emas',
    goldCalcBtn: 'HITUNG',
    pivotTitle: 'Pivot Point & NEST',
    pivotDesc: 'Classic Pivot & gap sinyal pasar',
    pivotBtn: 'PIVOT',
    nestBtn: 'NEST',
    newsTitle: 'Berita Fundamental',
    newsDesc: 'Analisis makro global & sentimen',
    newsBtn: 'BACA',
    chartsTitle: 'GRAFIK PASAR REAL-TIME',
    chartXauusd: 'Spot Gold (XAU/USD)',
    newsHighlights: 'Sorotan',
    viewAllNews: 'LIHAT SEMUA',
    readMore: 'Baca Selengkapnya',
    noNewsAvailable: 'Belum ada berita terbaru',
    loading: 'Memuat data...',
    errorMessage: 'Data sementara tidak tersedia',
    retry: 'Coba Lagi',
    lastUpdated: 'Terakhir diperbarui',
    dataUnavailable: 'Data tidak tersedia',
  },
  en: {
    liveStatus: 'LIVE',
    heroTitle: 'Auva Market Calculation & Information',
    heroSubtitle:
      'Physical gold calculation, pivot point & NEST analysis, historical data, and fundamental market news.',
    indicatorsTitle: 'REAL-TIME INDICATORS',
    synced: 'Synced',
    updatedAt: 'Updated',
    spotGold: 'Spot Gold',
    exchangeRate: 'USD/IDR Exchange Rate',
    goldCalcTitle: 'Physical Gold Calculator',
    goldCalcDesc: 'Calculate buy, sell price & gold spread',
    goldCalcBtn: 'CALCULATE',
    pivotTitle: 'Pivot Point & NEST',
    pivotDesc: 'Classic Pivot & market gap signals',
    pivotBtn: 'PIVOT',
    nestBtn: 'NEST',
    newsTitle: 'Fundamental News',
    newsDesc: 'Global macro analysis & market sentiment',
    newsBtn: 'READ',
    chartsTitle: 'REAL-TIME MARKET CHARTS',
    chartXauusd: 'Spot Gold (XAU/USD)',
    newsHighlights: 'Highlights',
    viewAllNews: 'VIEW ALL',
    readMore: 'Read More',
    noNewsAvailable: 'No recent articles available',
    loading: 'Loading data...',
    errorMessage: 'Data temporarily unavailable',
    retry: 'Retry',
    lastUpdated: 'Last updated',
    dataUnavailable: 'Data unavailable',
  },
}
