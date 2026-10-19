import { NextRequest, NextResponse } from 'next/server'
import { INSTRUMENTS, isValidSlug } from '@/lib/instrument-config'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get('symbol') ?? 'gold'

  if (!isValidSlug(symbol)) {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid instrument symbol',
      },
      { status: 400 },
    )
  }

  try {
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
      .from('ohlc_data')
      .select('date, open, close')
      .eq('symbol', INSTRUMENTS[symbol].dbSymbol)
      .order('date', { ascending: false })
      .limit(7)

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      data: data ?? [],
    })
  } catch (error) {
    console.error('NEST historical error:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}