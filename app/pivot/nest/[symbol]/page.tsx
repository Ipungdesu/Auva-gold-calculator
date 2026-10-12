import { notFound } from 'next/navigation'
import { INSTRUMENTS, isValidSlug } from '@/lib/instrument-config'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { getDummyPivotData } from '@/lib/pivot-dummy-data'
import type { OhlcRow } from '@/components/pivot/PivotCalculator'
import NestCalculatorPage from '@/components/pages/nest-calculator-page'

// Selalu ambil data terbaru, sama seperti halaman Pivot
export const revalidate = 0

interface PageProps {
  params: Promise<{
    symbol: string
  }>
}

export default async function NestSymbolPage({ params }: PageProps) {
  const { symbol } = await params

  if (!isValidSlug(symbol)) {
    notFound()
  }

  const config = INSTRUMENTS[symbol as keyof typeof INSTRUMENTS]

  // Sumber data yang sama dengan Pivot: 7 baris OHLC terbaru
  let initialData: OhlcRow[] = []

  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('ohlc_data')
      .select('date, open, high, low, close, symbol')
      .eq('symbol', config.dbSymbol)
      .order('date', { ascending: false })
      .limit(7)

    if (error) {
      console.error(`[nest/${symbol}] Supabase error:`, error.message)
    } else if (data && data.length > 0) {
      initialData = data.map((r) => ({
        date: r.date as string,
        open: Number(r.open),
        high: Number(r.high),
        low: Number(r.low),
        close: Number(r.close),
        symbol: r.symbol as string,
      }))
    }
  } catch (err) {
    console.error(`[nest/${symbol}] Connection error:`, err)
  }

  // Fallback yang sama dengan Pivot: Hang Seng dan Nikkei memakai data lokal
  if (initialData.length === 0 && config.dbSymbol !== 'XAUUSD') {
    initialData = getDummyPivotData(config.dbSymbol)
  }

  return <NestCalculatorPage symbol={symbol} initialData={initialData} />
}