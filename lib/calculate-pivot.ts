export interface OHLCData {
  // Semua data OHLC diinput dari HARI KEMARIN
  open: number
  high: number
  low: number
  close: number
}

export interface PivotLevels {
  p: number
  r1: number
  r2: number
  r3: number
  r4: number
  s1: number
  s2: number
  s3: number
  s4: number
}

export interface MarketSignal {
  bias: 'Bullish Bias' | 'Bearish Bias' | 'Neutral'
  direction: 'BUY' | 'SELL' | 'NEUTRAL'

  positionText: string
  targetResistanceText: string
  nearestInvalidationText: string
  conditionText: string

  activeLevel:
    | 'R4'
    | 'R3'
    | 'R2'
    | 'R1'
    | 'PP'
    | 'S1'
    | 'S2'
    | 'S3'
    | 'S4'

  nextTargetLevel:
    | 'R4'
    | 'R3'
    | 'R2'
    | 'R1'
    | 'S1'
    | 'S2'
    | 'S3'
    | 'S4'
    | null
}

/**
 * Menghitung Pivot Point berdasarkan data OHLC HARI KEMARIN.
 */
export function calculatePivotLevels(
  ohlc: OHLCData
): PivotLevels {
  const { high, low, close } = ohlc

  // Pivot Point
  const p = (high + low + close) / 3

  // Range harga kemarin
  const range = high - low

  // Resistance
  const r1 = (2 * p) - low
  const r2 = p + range
  const r3 = p + (range * 2)
  const r4 = p + (range * 3)

  // Support
  const s1 = (2 * p) - high
  const s2 = p - range
  const s3 = p - (range * 2)
  const s4 = p - (range * 3)

  return {
    p,
    r1,
    r2,
    r3,
    r4,
    s1,
    s2,
    s3,
    s4,
  }
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)

/**
 * Menentukan signal berdasarkan:
 *
 * Pivot Point vs Open Hari Ini.
 *
 * P > Open Hari Ini  = BUY
 * P < Open Hari Ini  = SELL
 * P = Open Hari Ini  = NEUTRAL
 */
export function determineSignal(
  openToday: number,
  levels: PivotLevels
): MarketSignal {

  // BUY
  if (levels.p > openToday) {
    return {
      bias: 'Bullish Bias',
      direction: 'BUY',

      positionText:
        `Pivot (${fmt(levels.p)}) is above today's Open (${fmt(openToday)})`,

      targetResistanceText:
        `R1 (${fmt(levels.r1)})`,

      nearestInvalidationText:
        `Pivot (${fmt(levels.p)})`,

      conditionText:
        `Pivot Point is above today's Open price. BUY signal generated.`,

      activeLevel: 'PP',
      nextTargetLevel: 'R1',
    }
  }

  // SELL
  if (levels.p < openToday) {
    return {
      bias: 'Bearish Bias',
      direction: 'SELL',

      positionText:
        `Pivot (${fmt(levels.p)}) is below today's Open (${fmt(openToday)})`,

      targetResistanceText:
        `S1 (${fmt(levels.s1)})`,

      nearestInvalidationText:
        `Pivot (${fmt(levels.p)})`,

      conditionText:
        `Pivot Point is below today's Open price. SELL signal generated.`,

      activeLevel: 'PP',
      nextTargetLevel: 'S1',
    }
  }

  // NEUTRAL
  return {
    bias: 'Neutral',
    direction: 'NEUTRAL',

    positionText:
      `Pivot (${fmt(levels.p)}) is equal to today's Open (${fmt(openToday)})`,

    targetResistanceText: '-',

    nearestInvalidationText: '-',

    conditionText:
      `Pivot Point is equal to today's Open price. No clear signal.`,

    activeLevel: 'PP',
    nextTargetLevel: null,
  }
}