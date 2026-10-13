'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Calculator,
  RefreshCw,
  SlidersHorizontal,
  CalendarDays,
  Share2,
  Home,
  Banknote,
  TrendingUp,
  Newspaper,
} from 'lucide-react'
import { calculatePivotLevels, determineSignal } from '@/lib/calculate-pivot'
import type { InstrumentConfig } from '@/lib/instrument-config'
import { AppHeader } from '@/components/goldcalc/app-header'
import { useTranslation } from '@/lib/LanguageContext'

// ── Types ────────────────────────────────────────────────────────────────────

export interface OhlcRow {
  date: string
  open: number
  high: number
  low: number
  close: number
  symbol: string
}

interface PivotCalculatorProps {
  initialData: OhlcRow[]
  config: InstrumentConfig
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const fmtMoney = (n: number) =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)

const fmtDate = (d: string, lang: 'id' | 'en') => {
  try {
    return new Date(d).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return d
  }
}

const fmtShortDate = (d: string, lang: 'id' | 'en') => {
  try {
    return new Date(d).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { month: 'short', day: 'numeric' })
  } catch {
    return d
  }
}

/** Midpoint between two price levels */
const midpoint = (a: number, b: number) => (a + b) / 2

const escapeSvg = (value: string) => value.replace(/[&<>"']/g, (char) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
}[char] ?? char))

interface PivotShareLabels {
  formula: string
  marketSignal: string
  bias: string
  directionalCall: string
  target: string
  invalidation: string
  condition: string
  pivotLevels: string
  standardPivots: string
  pivotPoint: string
  nearestSupport: string
  midpoint: string
  centralBaseline: string
}

const wrapSvgText = (value: string, maxCharacters: number) => {
  const words = value.split(/\s+/)
  const lines: string[] = []
  let line = ''

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (candidate.length > maxCharacters && line) {
      lines.push(line)
      line = word
    } else {
      line = candidate
    }
  }

  if (line) lines.push(line)
  return lines
}

const createShareSvg = (
  config: InstrumentConfig,
  signal: NonNullable<ReturnType<typeof determineSignal>>,
  levels: ReturnType<typeof calculatePivotLevels>,
  condition: string,
  labels: PivotShareLabels,
) => {
  const width = 420
  const margin = 16
  const cardWidth = width - margin * 2
  const contentX = margin + 16
  const contentRight = width - margin - 16
  const elements: string[] = []
  let y = 24

  const text = (
    value: string,
    x: number,
    baseline: number,
    options: { size?: number; color?: string; weight?: number; anchor?: string } = {},
  ) => {
    elements.push(
      `<text x="${x}" y="${baseline}" fill="${options.color ?? '#172033'}" font-family="Arial, sans-serif" font-size="${options.size ?? 14}" font-weight="${options.weight ?? 400}"${options.anchor ? ` text-anchor="${options.anchor}"` : ''}>${escapeSvg(value)}</text>`,
    )
  }
  const rect = (x: number, top: number, w: number, h: number, fill: string, radius = 10, stroke?: string) => {
    elements.push(
      `<rect x="${x}" y="${top}" width="${w}" height="${h}" rx="${radius}" fill="${fill}"${stroke ? ` stroke="${stroke}"` : ''}/>`,
    )
  }
  const wrappedText = (value: string, x: number, baseline: number, maxCharacters: number, lineHeight: number, color: string, size = 12) => {
    const lines = wrapSvgText(value, maxCharacters)
    lines.forEach((line, index) => text(line, x, baseline + index * lineHeight, { size, color }))
    return lines.length
  }

  elements.push(`<rect width="${width}" height="100%" fill="#f4f7fb"/>`)
  text(labels.formula, margin, y, { size: 10, color: config.accentColor, weight: 700 })
  y += 24
  text(`${config.label} Pivot`, margin, y, { size: 23, weight: 700 })
  y += 16
  y += 8

  // Market Signal card
  const conditionLines = wrapSvgText(condition, 44)
  const signalHeight = 214 + conditionLines.length * 15
  const signalTop = y
  rect(margin, signalTop, cardWidth, signalHeight, '#ffffff', 16, '#e2e8f0')
  text(labels.marketSignal, contentX, signalTop + 26, { size: 12, color: '#334155', weight: 700 })
  elements.push(`<line x1="${contentX}" y1="${signalTop + 38}" x2="${contentRight}" y2="${signalTop + 38}" stroke="#f1f5f9"/>`)
  const biasWidth = Math.max(72, labels.bias.length * 6 + 20)
  rect(contentRight - biasWidth, signalTop + 10, biasWidth, 22, config.softColor, 11, config.accentColor)
  text(labels.bias, contentRight - 10, signalTop + 25, {
    size: 9,
    color: config.accentColor,
    weight: 600,
    anchor: 'end',
  })

  const signalColor =
    signal.direction === 'BUY' ? '#168343' : signal.direction === 'SELL' ? '#c6284d' : '#475569'
  text(labels.directionalCall, contentX, signalTop + 57, {
    size: 9,
    color: '#64748b',
    weight: 700,
  })
  const directionY = signalTop + 64
  rect(contentX, directionY, cardWidth - 32, 48, signalColor, 10)
  text(`${signal.direction === 'BUY' ? '↑' : signal.direction === 'SELL' ? '↓' : '•'}  ${signal.direction}`, contentX + 12, directionY + 30, {
    size: 19,
    color: '#ffffff',
    weight: 700,
  })
  text(signal.bias, contentRight - 10, directionY + 28, {
    size: 11,
    color: '#ffffff',
    weight: 700,
    anchor: 'end',
  })

  const detailGap = 8
  const detailWidth = (cardWidth - 40) / 2
  const detailY = directionY + 56
  ;[
    { label: labels.target, value: signal.targetResistanceText },
    { label: labels.invalidation, value: signal.nearestInvalidationText },
  ].forEach(({ label, value }, index) => {
    const detailX = contentX + index * (detailWidth + detailGap)
    rect(detailX, detailY, detailWidth, 52, '#f8fafc', 9, '#edf0f4')
    const labelLineCount = wrappedText(label, detailX + 8, detailY + 13, 24, 10, '#64748b', 7)
    text(value, detailX + 8, detailY + 37 + (labelLineCount - 1) * 2, { size: 9, weight: 700 })
  })

  const conditionTop = detailY + 64
  rect(contentX, conditionTop, cardWidth - 32, 26 + conditionLines.length * 15, config.softColor, 9, `${config.accentColor}30`)
  text(labels.condition, contentX + 10, conditionTop + 16, { size: 9, color: '#334155', weight: 700 })
  wrappedText(condition, contentX + 10, conditionTop + 32, 44, 15, '#334155', 9)
  y = signalTop + signalHeight + 14

  // Pivot Point levels card
  const pivotTop = y
  const pivotRowX = contentX
  const pivotRowWidth = cardWidth - 32
  const pivotCardStart = elements.length
  y = pivotTop + 58
  const gradientColors = config.gradient.match(/#[\da-fA-F]{6}/g) ?? []
  const gradientStart = gradientColors[0] ?? config.accentColor
  const gradientEnd = gradientColors[gradientColors.length - 1] ?? config.accentColor

  const addLevel = (label: string, value: number, style: 'regular' | 'r1' | 'pp' | 's1' = 'regular') => {
    const isPivot = style === 'pp'
    const isSupport = style === 's1'
    const rowHeight = isPivot ? 44 : isSupport ? 38 : style === 'r1' ? 36 : 32
    const fill = isPivot ? 'url(#pivot-gradient)' : '#f8fafc'
    rect(pivotRowX, y, pivotRowWidth, rowHeight, fill, isPivot || isSupport ? 12 : 10)
    if (isSupport) {
      text(label, pivotRowX + 12, y + 16, { size: 12, color: '#1e293b', weight: 700 })
      text(labels.nearestSupport, pivotRowX + 12, y + 29, { size: 8, color: '#94a3b8' })
    } else if (isPivot) {
      text(label, pivotRowX + 12, y + 27, { size: 12, color: '#ffffffb3', weight: 800 })
      text(labels.pivotPoint, pivotRowX + 38, y + 27, { size: 11, color: '#ffffff', weight: 700 })
    } else {
      text(label, pivotRowX + 12, y + rowHeight / 2 + 4, {
        size: 12,
        color: style === 'r1' ? '#1e293b' : '#7888a3',
        weight: 700,
      })
    }
    text(fmtMoney(value), contentRight - 12, y + rowHeight / 2 + 4, {
      size: isPivot ? 14 : 12,
      color: isPivot ? '#ffffff' : '#1e293b',
      weight: isPivot ? 800 : 700,
      anchor: 'end',
    })
    y += rowHeight + 6
  }

  const addMidpoint = (a: number, b: number) => {
    const rowY = y
    text('—', pivotRowX + 12, rowY + 13, { size: 10, color: '#cbd5e1', weight: 400 })
    text(labels.midpoint, pivotRowX + 27, rowY + 13, { size: 9, color: '#94a3b8' })
    text(fmtMoney(midpoint(a, b)), contentRight - 12, rowY + 13, {
      size: 10,
      color: '#94a3b8',
      weight: 600,
      anchor: 'end',
    })
    y += 20
  }

  text(labels.pivotLevels, contentX, pivotTop + 25, { size: 15, weight: 700 })
  text(labels.standardPivots, contentX, pivotTop + 43, { size: 10, color: '#64748b' })
  addLevel('R4', levels.r4)
  addMidpoint(levels.r4, levels.r3)
  addLevel('R3', levels.r3)
  addMidpoint(levels.r3, levels.r2)
  addLevel('R2', levels.r2)
  addMidpoint(levels.r2, levels.r1)
  addLevel('R1', levels.r1, 'r1')
  addMidpoint(levels.r1, levels.p)

  const baselineY = y + 2
  elements.push(`<line x1="${pivotRowX}" y1="${baselineY}" x2="${pivotRowX + pivotRowWidth}" y2="${baselineY}" stroke="#e2e8f0"/>`)
  const baselineWidth = labels.centralBaseline.length * 5.5 + 20
  rect(width / 2 - baselineWidth / 2, baselineY - 7, baselineWidth, 14, '#ffffff', 0)
  text(labels.centralBaseline, width / 2, baselineY + 3, {
    size: 7,
    color: '#94a3b8',
    weight: 800,
    anchor: 'middle',
  })
  y += 20

  addLevel('PP', levels.p, 'pp')
  addMidpoint(levels.p, levels.s1)
  addLevel('S1', levels.s1, 's1')
  addMidpoint(levels.s1, levels.s2)
  addLevel('S2', levels.s2)
  addMidpoint(levels.s2, levels.s3)
  addLevel('S3', levels.s3)
  addMidpoint(levels.s3, levels.s4)
  addLevel('S4', levels.s4)

  const pivotCardHeight = y - pivotTop + 10
  elements.splice(pivotCardStart, 0, `<rect x="${margin}" y="${pivotTop}" width="${cardWidth}" height="${pivotCardHeight}" rx="16" fill="#ffffff" stroke="#e2e8f0"/>`)
  const height = y + 24
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><defs><linearGradient id="pivot-gradient" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="${gradientStart}"/><stop offset="100%" stop-color="${gradientEnd}"/></linearGradient></defs>${elements.join('')}</svg>`
}

async function sharePivotImage(
  config: InstrumentConfig,
  signal: NonNullable<ReturnType<typeof determineSignal>>,
  levels: ReturnType<typeof calculatePivotLevels>,
  condition: string,
  labels: PivotShareLabels,
) {
  const svg = createShareSvg(config, signal, levels, condition, labels)
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
  const imageUrl = URL.createObjectURL(blob)
  let png: Blob | null
  try {
    const image = new Image()
    image.src = imageUrl
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve()
      image.onerror = () => reject(new Error('Unable to create share image'))
    })
    const canvas = document.createElement('canvas')
    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Unable to create image canvas')
    context.drawImage(image, 0, 0)
    png = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
  } finally {
    URL.revokeObjectURL(imageUrl)
  }
  if (!png) throw new Error('Unable to export share image')

  const file = new File([png], `auva-${config.dbSymbol.toLowerCase()}-pivot.png`, { type: 'image/png' })
  if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
    await navigator.share({ title: `${config.label} Pivot Analysis`, text: `${signal.direction} signal - ${signal.bias}`, files: [file] })
    return
  }

  const downloadUrl = URL.createObjectURL(png)
  const link = document.createElement('a')
  link.href = downloadUrl
  link.download = file.name
  link.click()
  URL.revokeObjectURL(downloadUrl)
  window.open(`https://wa.me/?text=${encodeURIComponent(`${config.label} Pivot Signal: ${signal.direction} - ${signal.bias}`)}`, '_blank', 'noopener,noreferrer')
}

// ── Component ────────────────────────────────────────────────────────────────

export function PivotCalculator({ initialData, config }: PivotCalculatorProps) {
  const { translate, lang } = useTranslation()
  const primary = initialData[0] ?? { open: 0, high: 0, low: 0, close: 0, date: '', symbol: '' }

  // Form state — editable overrides (prefilled from latest DB row)
  const [open, setOpen] = useState(String(primary.open))
  const [high, setHigh] = useState(String(primary.high))
  const [low, setLow] = useState(String(primary.low))
  const [close, setClose] = useState(String(primary.close))
  const [openToday, setOpenToday] = useState(String(primary.open))

  // Calculated pivot levels (null = not yet calculated)
  const [levels, setLevels] = useState<ReturnType<typeof calculatePivotLevels> | null>(
    initialData.length > 0 ? calculatePivotLevels(primary) : null,
  )
  const [calcOpenToday, setCalcOpenToday] = useState<number | null>(
    initialData.length > 0 ? primary.open : null,
  )

  const handleCalculate = useCallback(() => {
    const o = parseFloat(open)
    const h = parseFloat(high)
    const l = parseFloat(low)
    const c = parseFloat(close)
    const ot = parseFloat(openToday)
    if ([o, h, l, c, ot].some(isNaN)) return

    setLevels(calculatePivotLevels({ open: o, high: h, low: l, close: c }))
    setCalcOpenToday(ot)
  }, [open, high, low, close, openToday])

  const handleUseHistoricalData = useCallback((row: OhlcRow) => {
    setOpen(String(row.open))
    setHigh(String(row.high))
    setLow(String(row.low))
    setClose(String(row.close))
    setOpenToday(String(row.open))
    setLevels(calculatePivotLevels(row))
    setCalcOpenToday(row.open)
  }, [])

  const handleReset = useCallback(() => {
    setOpen(String(primary.open))
    setHigh(String(primary.high))
    setLow(String(primary.low))
    setClose(String(primary.close))
    setOpenToday(String(primary.open))
    setLevels(null)
    setCalcOpenToday(null)
  }, [primary])

  const signal = levels !== null && calcOpenToday !== null
    ? determineSignal(calcOpenToday, levels)
    : null

  const handleQuickShare = useCallback(async () => {
    if (!levels || !signal) return
    const labels: PivotShareLabels = {
      formula: translate(`${config.analysisName} FORMULA`),
      marketSignal: translate('MARKET SIGNAL'),
      bias: translate(signal.bias),
      directionalCall: translate('DIRECTIONAL CALL'),
      target: translate('Target Resistance:'),
      invalidation: translate('Nearest Invalidation:'),
      condition: translate('Condition:'),
      pivotLevels: translate('Calculated Pivot Levels'),
      standardPivots: translate('Standard Floor Pivots'),
      pivotPoint: translate('Pivot Point'),
      nearestSupport: translate('Nearest Support'),
      midpoint: translate('Midpoint'),
      centralBaseline: translate('CENTRAL BASELINE'),
    }
    try {
      await sharePivotImage(
        config,
        signal,
        levels,
        translate(signal.conditionText),
        labels,
      )
    } catch (error) {
      if ((error as Error).name !== 'AbortError') console.error('Quick share failed:', error)
    }
  }, [config, levels, signal, translate])

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-900 font-sans antialiased pb-24">
      {/* ── Top Header ── */}
      <AppHeader backHref="/pivot" />

      <main className="mx-auto flex w-full max-w-md flex-col gap-5 px-4 py-5 sm:max-w-xl">
        {/* ── Section Title ── */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
            style={{ color: config.accentColor }}>
            <TrendingUp className="h-4 w-4" />
            {translate(`${config.analysisName} FORMULA`)}
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            {translate('Pivot Point Calculator')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            {translate(config.subtitle)}
          </p>
        </div>

        {/* ── Calculate Data Card ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          {/* Card header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" style={{ color: config.accentColor }} />
              {translate(initialData.length > 0 ? 'Calculate Data' : 'Manual Input Data')}
            </h2>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-600">
              {translate('Daily Timeframe')}
            </span>
          </div>

          {/* 2-col OHLC grid */}
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                { label: 'OPEN', value: open, setter: setOpen, id: 'field-open' },
                { label: 'HIGH', value: high, setter: setHigh, id: 'field-high' },
                { label: 'LOW', value: low, setter: setLow, id: 'field-low' },
                { label: 'CLOSE', value: close, setter: setClose, id: 'field-close' },
              ] as Array<{ label: string; value: string; setter: (v: string) => void; id: string }>
            ).map(({ label, value, setter, id }) => (
              <div key={label} className="flex flex-col gap-1">
                <label htmlFor={id} className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {label}
                </label>
                <input
                  id={id}
                  type="number"
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-900 focus:border-[#0292e3] focus:outline-none focus:ring-2 focus:ring-[#0292e3]/20 transition-colors"
                />
              </div>
            ))}
          </div>

          {/* Open Today — full width, purely manual */}
          <div className="mt-3 flex flex-col gap-1">
            <label htmlFor="field-open-today" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {translate('REFERENCE OPEN')}
            </label>
            <input
              id="field-open-today"
              type="number"
              value={openToday}
              onChange={(e) => setOpenToday(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-900 focus:border-[#0292e3] focus:outline-none focus:ring-2 focus:ring-[#0292e3]/20 transition-colors"
            />
          </div>

          {/* Calculate button */}
          <button
            id="btn-calculate"
            onClick={handleCalculate}
            className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r ${config.gradient} py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:opacity-95 active:scale-[0.99]`}
          >
            <Calculator className="h-4 w-4" />
            <span>{translate('Calculate')}</span>
          </button>
        </div>

        {/* ── Market Signal ── */}
        {levels !== null && calcOpenToday !== null && signal !== null && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: config.accentColor }} />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">{translate('MARKET SIGNAL')}</span>
              </div>
              <span
                className="rounded-full border px-3 py-1 text-[11px] font-semibold"
                style={{ color: config.accentColor, borderColor: config.accentColor, backgroundColor: config.softColor }}
              >
                {translate(signal.bias)}
              </span>
            </div>

            <div className="mt-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{translate('DIRECTIONAL CALL')}</span>
                <div className={`mt-1 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-xl font-extrabold text-white shadow-sm ${signal.direction === 'BUY' ? 'bg-[#168343]' : signal.direction === 'SELL' ? 'bg-[#c6284d]' : 'bg-slate-600'}`}>
                  <span className="text-2xl">{signal.direction === 'BUY' ? '↑' : signal.direction === 'SELL' ? '↓' : '•'}</span>
                  <span>{signal.direction}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3">
                <div className="text-[10px] font-medium text-slate-400">{translate('Target Resistance:')}</div>
                <div className="mt-0.5 text-xs font-bold text-slate-900">{signal.targetResistanceText}</div>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3">
                <div className="text-[10px] font-medium text-slate-400">{translate('Nearest Invalidation:')}</div>
                <div className="mt-0.5 text-xs font-bold text-slate-900">{signal.nearestInvalidationText}</div>
              </div>
            </div>
            <div className="mt-3 rounded-xl border p-3 text-xs leading-relaxed text-slate-600" style={{ borderColor: `${config.accentColor}30`, backgroundColor: config.softColor }}>
              <span className="font-semibold text-slate-800">{translate('Condition:')} </span>
              {translate(signal.conditionText)}
            </div>
            <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3 text-xs leading-relaxed text-slate-600">
              <span className="font-semibold text-slate-800">{translate('How to read it:')} </span>
              {translate('Pivot Point = (High + Low + Close) / 3. BUY means the Pivot Point is above the reference open; SELL means it is below the reference open. This is a directional calculation, not a live trading signal.')}
            </div>
            <button
              type="button"
              onClick={handleQuickShare}
              className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r ${config.gradient} py-3 text-sm font-bold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.99]`}
            >
              <Share2 className="h-4 w-4" />
              {translate('Quick Share Image')}
            </button>
          </div>
        )}

        {/* ── Historical Data Applied ── */}
        {initialData.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">{translate('Historical Data Applied')}</h2>
                <span className="text-xs text-slate-400">{translate('Timeframe: Daily')}</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                <CalendarDays className="h-3.5 w-3.5" style={{ color: config.accentColor }} />
                {fmtDate(initialData[0].date, lang)}
              </div>
            </div>

            <div className="mt-4 overflow-x-auto scrollbar-thin">
              <table className="min-w-190 w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="pb-2.5 font-bold pl-1">{translate('DATE')}</th>
                    <th className="pb-2.5 text-right font-bold">{translate('OPEN')}</th>
                    <th className="pb-2.5 text-right font-bold">{translate('HIGH')}</th>
                    <th className="pb-2.5 text-right font-bold">{translate('LOW')}</th>
                    <th className="pb-2.5 text-right font-bold">{translate('CLOSE')}</th>
                    <th className="pb-2.5 text-right font-bold pr-1">{translate('ACTION')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {initialData.map((row, idx) => (
                    <tr
                      key={row.date + idx}
                      className={idx === 0 ? 'text-slate-900' : 'text-slate-800'}
                      style={idx === 0 ? { backgroundColor: config.softColor } : undefined}
                    >
                      <td className="py-3 pr-3 pl-1">
                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                          <span className="font-semibold">{fmtShortDate(row.date, lang)}</span>
                          {idx === 0 && (
                            <span className="rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide" style={{ color: config.accentColor, borderColor: `${config.accentColor}45`, backgroundColor: `${config.softColor}` }}>
                              {translate('MARKET DATA USED')}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 text-right font-mono font-medium whitespace-nowrap">
                        {fmtMoney(row.open)}
                      </td>
                      <td className="py-3 text-right font-mono font-medium whitespace-nowrap">
                        {fmtMoney(row.high)}
                      </td>
                      <td className="py-3 text-right font-mono font-medium whitespace-nowrap">
                        {fmtMoney(row.low)}
                      </td>
                      <td className="py-3 text-right font-mono font-bold whitespace-nowrap text-[#241e52]">
                        {fmtMoney(row.close)}
                      </td>
                      <td className="py-3 text-right pr-1">
                        <button
                          type="button"
                          onClick={() => handleUseHistoricalData(row)}
                          className="whitespace-nowrap rounded-lg px-3 py-2 text-[11px] font-bold text-white transition-colors hover:opacity-90 active:scale-[0.98]"
                          style={{ backgroundColor: config.accentColor }}
                        >
                          {translate('Use this')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Calculated Pivot Levels (shown after clicking Calculate) ── */}
        {levels !== null && calcOpenToday !== null && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between pb-4">
              <h2 className="text-base font-bold text-slate-900">{translate('Calculated Pivot Levels')}</h2>
              <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold text-white shadow-sm bg-linear-to-r ${config.gradient}`}>
                {translate('Standard Floor Pivots')}
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              {/* ── R4 ── */}
              <LevelRow label="R4" value={levels.r4} />
              <MidpointRow value={midpoint(levels.r4, levels.r3)} />

              {/* ── R3 ── */}
              <LevelRow label="R3" value={levels.r3} />
              <MidpointRow value={midpoint(levels.r3, levels.r2)} />

              {/* ── R2 ── */}
              <LevelRow label="R2" value={levels.r2} />
              <MidpointRow value={midpoint(levels.r2, levels.r1)} />

              {/* ── R1 ── */}
              <div className="relative flex items-center justify-between rounded-xl bg-[#f8fafc] px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#1e293b]">R1</span>
                </div>
                <div className="text-right">
                  <div className="font-mono font-extrabold text-sm text-[#1e293b]">{fmtMoney(levels.r1)}</div>
                </div>
              </div>

              {/* ── Midpoint R1 → PP ── */}
              <MidpointRow value={midpoint(levels.r1, levels.p)} />

              {/* ── Central Baseline divider ── */}
              <div className="relative my-2 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <span className="relative bg-white px-3 text-[10px] font-extrabold uppercase tracking-widest text-[#94a3b8]">
                  {translate('CENTRAL BASELINE')}
                </span>
              </div>

              {/* ── PP ── */}
              <div className={`flex items-center justify-between rounded-2xl bg-linear-to-r ${config.gradient} px-4 py-3.5 text-white shadow-sm`}>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm text-white/70">PP</span>
                  <span className="font-bold text-xs text-white">{translate('Pivot Point')}</span>
                </div>
                <span className="font-mono font-extrabold text-base sm:text-lg text-white">
                  {fmtMoney(levels.p)}
                </span>
              </div>

              {/* ── Midpoint PP → S1 ── */}
              <MidpointRow value={midpoint(levels.p, levels.s1)} />

              {/* ── S1 ── */}
              <div className="relative flex items-center justify-between rounded-2xl bg-[#f8fafc] px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#1e293b]">S1</span>
                  <span className="text-[10px] font-medium text-[#94a3b8]">{translate('Nearest Support')}</span>
                </div>
                <div className="font-mono font-extrabold text-sm text-[#1e293b]">
                  {fmtMoney(levels.s1)}
                </div>
              </div>

              {/* ── Midpoint S1 → S2 ── */}
              <MidpointRow value={midpoint(levels.s1, levels.s2)} />

              {/* ── S2 ── */}
              <LevelRow label="S2" value={levels.s2} />
              <MidpointRow value={midpoint(levels.s2, levels.s3)} />

              {/* ── S3 ── */}
              <LevelRow label="S3" value={levels.s3} />
              <MidpointRow value={midpoint(levels.s3, levels.s4)} />

              {/* ── S4 ── */}
              <LevelRow label="S4" value={levels.s4} />
            </div>
          </div>
        )}

        {/* ── New Calculation button ── */}
        <button
          id="btn-new-calculation"
          onClick={handleReset}
          className={`flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r ${config.gradient} py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:opacity-95 active:scale-[0.99]`}
        >
          <RefreshCw className="h-4 w-4" />
          <span>{translate('New Calculation')}</span>
        </button>
      </main>

      {/* ── Bottom Navigation ── */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t border-slate-200 bg-white/95 px-2 backdrop-blur-md">
        <Link
          href="/"
          className="flex flex-1 flex-col items-center justify-center gap-1 py-1 text-slate-400 hover:text-slate-600"
        >
          <Home className="h-5 w-5" />
          <span className="text-[11px] font-bold tracking-wider">{translate('HOME')}</span>
        </Link>
        <Link
          href="/gold"
          className="flex flex-1 flex-col items-center justify-center gap-1 py-1 text-slate-400 hover:text-slate-600"
        >
          <Banknote className="h-5 w-5" />
          <span className="text-[11px] font-bold tracking-wider">{translate('GOLD')}</span>
        </Link>
        <Link
          href="/pivot"
          className="flex flex-1 flex-col items-center justify-center gap-1 py-1 text-[#0292e3]"
        >
          <TrendingUp className="h-5 w-5" />
          <span className="text-[11px] font-bold tracking-wider">{translate('PIVOT')}</span>
        </Link>
        <Link
          href="/news"
          className="flex flex-1 flex-col items-center justify-center gap-1 py-1 text-slate-400 hover:text-slate-600"
        >
          <Newspaper className="h-5 w-5" />
          <span className="text-[11px] font-bold tracking-wider">{translate('NEWS')}</span>
        </Link>
      </nav>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function LevelRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-[#f8fafc] px-4 py-2.5 text-xs">
      <span className="font-bold text-[#7888a3]">{label}</span>
      <span className="font-mono font-bold text-[#1e293b]">{fmtMoney(value)}</span>
    </div>
  )
}

function MidpointRow({ value }: { value: number }) {
  const { translate } = useTranslation()

  return (
    <div className="flex items-center justify-between px-4 py-0.5">
      <span className="flex items-center gap-1.5 text-[10px] text-slate-400">
        <span className="h-px w-3 bg-slate-300" />
        {translate('Midpoint')}
      </span>
      <span className="font-mono text-[11px] font-semibold text-slate-400">{fmtMoney(value)}</span>
    </div>
  )
}
