import { notFound } from 'next/navigation'
import { INSTRUMENTS, isValidSlug } from '@/lib/instrument-config'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { PivotCalculator, type OhlcRow } from '@/components/pivot/PivotCalculator'
import { getDummyPivotData } from '@/lib/pivot-dummy-data'

// Re-generate on every request so data is always fresh
export const revalidate = 0

// ── Static params for SSG ────────────────────────────────────────────────────

export function generateStaticParams() {
  return Object.keys(INSTRUMENTS).map((slug) => ({ symbol: slug }))
}

// ── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ symbol: string }>
}) {
  const { symbol } = await params
  if (!isValidSlug(symbol)) return {}
  const config = INSTRUMENTS[symbol]
  return {
    title: `${config.label} Pivot Calculator — AUVA`,
    description: config.subtitle,
  }
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function SymbolPivotPage({
  params,
}: {
  params: Promise<{ symbol: string }>
}) {
  const { symbol } = await params

  // Validate slug — notFound() throws internally, but we need TS narrowing too
  if (!isValidSlug(symbol)) {
    notFound()
  }

  // After isValidSlug guard, symbol is a valid key
  const config = INSTRUMENTS[symbol as keyof typeof INSTRUMENTS]


  // Query 7 most-recent OHLC rows for this instrument
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
      console.error(`[pivot/${symbol}] Supabase error:`, error.message)
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
    console.error(`[pivot/${symbol}] Connection error:`, err)
  }

  // Hang Seng and Nikkei are intentionally backed by local fixtures until scraping is available.
  if (initialData.length === 0 && config.dbSymbol !== 'XAUUSD') {
    initialData = getDummyPivotData(config.dbSymbol)
  }

  return <PivotCalculator initialData={initialData} config={config} />
}
