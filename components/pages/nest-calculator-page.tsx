'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Home,
  Banknote,
  TrendingUp,
  Newspaper,
  SlidersHorizontal,
  Smartphone,
  History,
  RotateCcw,
  CalendarDays,
} from 'lucide-react'

interface NestCalculatorPageProps {
  symbol: string
}

interface HistoricalData {
  date: string
  open: number
  close: number
}

type ThemeConfig = {
  label: string
  shortLabel: string
  color: string
  lightColor: string
  borderColor: string
  gradient: string
}

const THEMES: Record<string, ThemeConfig> = {
  gold: {
    label: 'DIGITAL GOLD ANALYSIS',
    shortLabel: 'Gold',
    color: '#e0b91b',
    lightColor: '#fff8d9',
    borderColor: '#f0c800',
    gradient: 'linear-gradient(135deg, #D4AF37 0%, #FFDF00 100%)',
  },

  hangseng: {
    label: 'HANGSENG INDEX ANALYSIS',
    shortLabel: 'Hangseng',
    color: '#d50045',
    lightColor: '#fff0f4',
    borderColor: '#ff2864',
    gradient: 'linear-gradient(135deg, #A80038 0%, #FD3A69 100%)',
  },

  nikkei: {
    label: 'NIKKEI INDEX ANALYSIS',
    shortLabel: 'Nikkei',
    color: '#079fd8',
    lightColor: '#eefaff',
    borderColor: '#08afe5',
    gradient: 'linear-gradient(135deg, #291F6C 0%, #00A9E8 100%)',
  },
}

function getTheme(symbol: string): ThemeConfig {
  return THEMES[symbol.toLowerCase()] ?? THEMES.gold
}

function formatMoney(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function formatDate(dateString: string) {
  const date = new Date(dateString)

  if (Number.isNaN(date.getTime())) {
    return dateString
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatShortDate(dateString: string) {
  const date = new Date(dateString)

  if (Number.isNaN(date.getTime())) {
    return dateString
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export default function NestCalculatorPage({
  symbol,
}: NestCalculatorPageProps) {
  const theme = getTheme(symbol)

  // =========================================================
  // STEP 7 — STATE DATA HISTORIS
  // =========================================================

  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([])
  const [loadingHistory, setLoadingHistory] = useState(true)

  // =========================================================
  // STATE DATA YANG DIPILIH UNTUK PERHITUNGAN
  // =========================================================

  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedOpen, setSelectedOpen] = useState<number | null>(null)
  const [selectedClose, setSelectedClose] = useState<number | null>(null)

  // Open hari ini
 const [openToday, setOpenToday] = useState('')

  // =========================================================
  // STATE HASIL PERHITUNGAN
  // =========================================================

  const [signal, setSignal] = useState<'BUY' | 'SELL' | 'NEUTRAL' | null>(
    null,
  )

  const [conditionText, setConditionText] = useState('')

  // =========================================================
  // AMBIL DATA HISTORIS DARI API
  // =========================================================

  useEffect(() => {
    async function fetchHistoricalData() {
      try {
        setLoadingHistory(true)

        const response = await fetch('/api/nest/historical', {
          cache: 'no-store',
        })

        if (!response.ok) {
          throw new Error('Failed to fetch historical data')
        }

        const result = await response.json()

        if (result.success && Array.isArray(result.data)) {
          const formattedData: HistoricalData[] = result.data.map(
            (item: HistoricalData) => ({
              date: item.date,
              open: Number(item.open),
              close: Number(item.close),
            }),
          )

          setHistoricalData(formattedData)
        } else {
          setHistoricalData([])
        }
      } catch (error) {
        console.error('Failed to load NEST historical data:', error)
        setHistoricalData([])
      } finally {
        setLoadingHistory(false)
      }
    }

    fetchHistoricalData()
  }, [])

  // =========================================================
  // USE THIS
  // =========================================================

  function handleUseThis(item: HistoricalData) {
    setSelectedDate(item.date)
    setSelectedOpen(item.open)
    setSelectedClose(item.close)

    // Untuk sementara Open Today mengikuti Open dari data yang dipilih.
    // Nanti bisa diganti dengan data live/current dari API.
    
    // Setiap kali memilih data baru,
    // hasil perhitungan lama dihapus.
    setSignal(null)
    setConditionText('')
  }

  // =========================================================
  // CALCULATE NEST
  // =========================================================

 function handleCalculate() {
  if (selectedClose === null || openToday.trim() === '') {
    return
  }

  const todayOpen = Number(openToday)

  if (Number.isNaN(todayOpen)) {
    return
  }

  // NEST:
  // Open Today > Previous Close => SELL
  // Open Today < Previous Close => BUY
  // Open Today = Previous Close => NEUTRAL

  if (todayOpen > selectedClose) {
    setSignal('SELL')
    setConditionText(
      `Today's open is above the previous close.`,
    )
  } else if (todayOpen < selectedClose) {
    setSignal('BUY')
    setConditionText(
      `Today's open is below the previous close.`,
    )
  } else {
    setSignal('NEUTRAL')
    setConditionText(
      `Today's open is equal to the previous close.`,
    )
  }
}

  // =========================================================
  // NEW CALCULATION
  // =========================================================

  function handleNewCalculation() {
    setSelectedDate(null)
    setSelectedOpen(null)
    setSelectedClose(null)
    setOpenToday('')
    setSignal(null)
    setConditionText('')
  }

  const signalLabel =
    signal === 'BUY'
      ? 'Bullish Bias'
      : signal === 'SELL'
        ? 'Bearish Bias'
        : signal === 'NEUTRAL'
          ? 'Neutral'
          : ''

  return (
    <div className="min-h-screen bg-[#f4f7fb] pb-24 font-sans antialiased text-slate-900">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-30 flex h-[72px] w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md">
        <Link
          href="/pivot/nest"
          className="flex h-8 w-8 items-center justify-center text-slate-600"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-200 bg-white shadow-sm">
            <svg
              className="h-5 w-5 text-[#0292e3]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2L2 22h5.5l2.5-5h8l2.5 5H22L12 2zm0 6.5L14.7 14H9.3L12 8.5z" />
            </svg>
          </div>

          <span className="text-xl font-extrabold tracking-tight text-[#14509b]">
            AUVA
          </span>
        </div>

        <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-[#172554]">
          <span className="h-2 w-2 rounded-full bg-[#0292e3]" />
          Live XAUUSD
        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto w-full max-w-md px-4 py-5">
        {/* PAGE TITLE */}

        <div className="mb-3">
          <div
            className="mb-1 flex items-center gap-2 text-xs font-extrabold tracking-wider"
            style={{ color: theme.color }}
          >
            <TrendingUp className="h-4 w-4" />
            {theme.label}
          </div>

          <h1 className="text-[30px] font-extrabold leading-tight tracking-tight text-slate-900">
            NEST Calculator
          </h1>

          <p className="mt-1 text-sm leading-5 text-slate-500">
            Konsep transaksi yang menggunakan perbandingan harga pembukaan hari ini dengan harga penutupan sesi sebelumnya 
            untuk menentukan bias arah transaksi.
          </p>
        </div>

        {/* ===================================================
            CALCULATE DATA CARD
        =================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal
                className="h-4 w-4"
                style={{ color: theme.color }}
              />

              <span className="text-base font-bold text-slate-800">
                Calculate Data
              </span>
            </div>

            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-600">
              Daily Timeframe
            </span>
          </div>

          {/* OPEN & CLOSE */}

          <div className="mt-3 grid grid-cols-2 gap-2.5">
            <div className="rounded-xl border border-slate-200 bg-[#f5f7fb] p-3">
              <span className="text-[10px] font-bold tracking-wider text-slate-500">
                OPEN
              </span>

              <div className="mt-1 text-base font-extrabold text-[#1e1b4b]">
                {selectedOpen !== null
                  ? formatMoney(selectedOpen)
                  : '-'}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-[#f5f7fb] p-3">
              <span className="text-[10px] font-bold tracking-wider text-slate-500">
                CLOSE
              </span>

              <div className="mt-1 text-base font-extrabold text-[#1e1b4b]">
                {selectedClose !== null
                  ? formatMoney(selectedClose)
                  : '-'}
              </div>
            </div>
          </div>

          {/* OPEN TODAY */}

<div className="mt-2.5 rounded-xl border border-slate-200 bg-[#f5f7fb] p-3">
  <label className="text-[10px] font-bold tracking-wider text-slate-500">
    OPEN TODAY
  </label>

  <input
  type="text"
  inputMode="decimal"
  value={openToday}
  onChange={(e) => {
    const value = e.target.value

    if (/^\d*\.?\d*$/.test(value)) {
      setOpenToday(value)
    }
  }}
  placeholder="Enter today's open"
  className="mt-1 w-full bg-transparent text-base font-extrabold text-[#1e1b4b] outline-none placeholder:text-slate-300"
/>
</div>

          {/* CALCULATE BUTTON */}

          <button
            type="button"
            onClick={handleCalculate}
            disabled={
              selectedOpen === null ||
              selectedClose === null ||
              openToday === null
            }
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white shadow-sm transition-all active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              background: theme.gradient,
            }}
          >
            <Smartphone className="h-4 w-4" />
            Calculate
          </button>

          
        </section>

        {/* ===================================================
            MARKET SIGNAL
            HANYA MUNCUL SETELAH CALCULATE
        =================================================== */}

        {signal !== null && (
          <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: theme.color }}
                />

                <span className="text-xs font-extrabold tracking-wider text-slate-800">
                  MARKET SIGNAL
                </span>
              </div>

              <span
                className="rounded-full px-3 py-1 text-[11px] font-semibold"
                style={{
                  color: theme.color,
                  backgroundColor: theme.lightColor,
                  border: `1px solid ${theme.borderColor}`,
                }}
              >
                {signalLabel}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
  {/* DIRECTIONAL CALL */}
  <div>
    <span className="block text-[10px] font-bold tracking-wider text-slate-500">
      DIRECTIONAL CALL
    </span>

    <div
      className={`mt-2 inline-flex items-center rounded-xl px-4 py-2 text-xl font-extrabold text-white ${
        signal === 'BUY'
          ? 'bg-green-600'
          : signal === 'SELL'
            ? 'bg-red-600'
            : 'bg-slate-500'
      }`}
    >
      {signal === 'BUY'
        ? '↑ BUY'
        : signal === 'SELL'
          ? '↓ SELL'
          : '— NEUTRAL'}
    </div>
  </div>

  {/* PRICE POSITION */}
  <div className="text-right">
    <span className="block text-[10px] font-bold tracking-wider text-slate-500">
      PRICE POSITION
    </span>

    <div className="mt-2 text-base font-extrabold text-[#312e81]">
      {signal === 'BUY'
        ? 'Below Close'
        : signal === 'SELL'
          ? 'Above Close'
          : 'At Close'}
    </div>

    <div className="text-xs font-semibold text-slate-400">
      {selectedClose !== null
        ? formatMoney(selectedClose)
        : '-'}
    </div>
  </div>
</div>

            <div className="mt-3 border-t border-slate-100 pt-3">
              <div
                className="rounded-xl border p-3 text-xs leading-5"
                style={{
                  backgroundColor: theme.lightColor,
                  borderColor: `${theme.borderColor}55`,
                  color: '#334155',
                }}
              >
                <span className="font-semibold">Condition: </span>
                {conditionText}
              </div>
            </div>
          </section>
        )}

        {/* ===================================================
            HISTORICAL DATA APPLIED
        =================================================== */}

        <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-800">
                Historical Data Applied
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Timeframe: Daily
              </p>
            </div>

            {selectedDate && (
              <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-bold text-slate-600">
                <CalendarDays className="h-3.5 w-3.5" />
                {formatDate(selectedDate)}
              </div>
            )}
          </div>

          <div className="mt-3 border-t border-slate-100 pt-3">
            {loadingHistory ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Loading historical data...
              </div>
            ) : historicalData.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No historical data available.
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#f5f7fb] text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="px-2.5 py-3 text-left">
                        DATE
                      </th>

                      <th className="px-2 py-3 text-right">
                        OPEN
                      </th>

                      <th className="px-2 py-3 text-right">
                        CLOSE
                      </th>

                      <th className="px-2 py-3 text-center">
                        ACTION
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {historicalData.map((item) => {
                      const isSelected =
                        selectedDate === item.date

                      return (
                        <tr
                          key={item.date}
                          className="border-t border-slate-200"
                          style={
                            isSelected
                              ? {
                                  backgroundColor:
                                    theme.lightColor,
                                }
                              : undefined
                          }
                        >
                          <td className="px-2.5 py-3 font-medium text-slate-600">
                            <div className="whitespace-nowrap">
                              {formatShortDate(item.date)}
                            </div>

                            {isSelected && (
                              <span
                                className="mt-0.5 inline-block text-[8px] font-bold uppercase"
                                style={{ color: theme.color }}
                              >
                                Market Data Used
                              </span>
                            )}
                          </td>

                          <td className="px-2 py-3 text-right font-semibold text-slate-600">
                            {formatMoney(item.open)}
                          </td>

                          <td className="px-2 py-3 text-right font-semibold text-slate-600">
                            {formatMoney(item.close)}
                          </td>

                          <td className="px-2 py-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleUseThis(item)}
                              className="rounded-lg px-2 py-1.5 text-[9px] font-bold text-white transition-all active:scale-95"
                              style={{
                                background:
                                  theme.gradient,
                              }}
                            >
                              {isSelected
                                ? 'Selected'
                                : 'Use this'}
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* ===================================================
            NEW CALCULATION
        =================================================== */}

        <button
          type="button"
          onClick={handleNewCalculation}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white shadow-sm transition-all active:scale-[0.99]"
          style={{
            background: theme.gradient,
          }}
        >
          <RotateCcw className="h-4 w-4" />
          New Calculation
        </button>
      </main>

      {/* =====================================================
          BOTTOM NAV
      ===================================================== */}

      <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t border-slate-200 bg-white/95 px-2 backdrop-blur-md">
        <Link
          href="/"
          className="flex flex-1 flex-col items-center justify-center gap-1 py-1 text-slate-400"
        >
          <Home className="h-5 w-5" />
          <span className="text-[11px] font-bold tracking-wider">
            HOME
          </span>
        </Link>

        <Link
          href="/gold"
          className="flex flex-1 flex-col items-center justify-center gap-1 py-1 text-slate-400"
        >
          <Banknote className="h-5 w-5" />
          <span className="text-[11px] font-bold tracking-wider">
            GOLD
          </span>
        </Link>

        <Link
          href="/pivot"
          className="flex flex-1 flex-col items-center justify-center gap-1 py-1 text-[#0292e3]"
        >
          <TrendingUp className="h-5 w-5" />
          <span className="text-[11px] font-bold tracking-wider">
            METHOD
          </span>
        </Link>

        <Link
          href="/news"
          className="flex flex-1 flex-col items-center justify-center gap-1 py-1 text-slate-400"
        >
          <Newspaper className="h-5 w-5" />
          <span className="text-[11px] font-bold tracking-wider">
            NEWS
          </span>
        </Link>
      </nav>
    </div>
  )
}