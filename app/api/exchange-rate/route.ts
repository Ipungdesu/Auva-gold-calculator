import { NextResponse } from 'next/server'

// Source: https://open.er-api.com — Free exchange rate API, no API key required.
// Data is updated daily. This route acts as a server-side proxy so the client
// never calls the external API directly.

export const revalidate = 300 // Cache for 5 minutes

export async function GET() {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      next: { revalidate: 300 },
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch exchange rate from provider' },
        { status: 502 },
      )
    }

    const data = await res.json()
    const idrRate = data?.rates?.IDR

    if (!idrRate) {
      return NextResponse.json(
        { error: 'IDR rate not found in provider response' },
        { status: 404 },
      )
    }

    return NextResponse.json({
      rate: idrRate as number,
      lastUpdate: (data.time_last_update_utc as string) || new Date().toISOString(),
    })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error while fetching exchange rate' },
      { status: 500 },
    )
  }
}
