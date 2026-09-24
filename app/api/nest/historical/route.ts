import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  try {
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
      .from('ohlc_data')
      .select('date, open, close')
      .eq('symbol', 'XAUUSD')
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