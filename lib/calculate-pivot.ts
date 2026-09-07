export interface OHLCData {
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
  activeLevel: 'R4' | 'R3' | 'R2' | 'R1' | 'PP' | 'S1' | 'S2' | 'S3' | 'S4'
  nextTargetLevel: 'R4' | 'R3' | 'R2' | 'R1' | 'S1' | 'S2' | 'S3' | 'S4' | null
}

export function calculatePivotLevels(ohlc: OHLCData): PivotLevels {
  const p = (ohlc.high + ohlc.low + ohlc.close) / 3
  const r1 = 2 * p - ohlc.low
  const r2 = p + (ohlc.high - ohlc.low)
  const r3 = ohlc.high + 2 * (p - ohlc.low)
  const r4 = r3 + (ohlc.high - ohlc.low)

  const s1 = 2 * p - ohlc.high
  const s2 = p - (ohlc.high - ohlc.low)
  const s3 = ohlc.low - 2 * (ohlc.high - p)
  const s4 = s3 - (ohlc.high - ohlc.low)

  return { p, r1, r2, r3, r4, s1, s2, s3, s4 }
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n)

export function determineSignal(currentPrice: number, levels: PivotLevels): MarketSignal {
  if (currentPrice >= levels.r1) {
    return {
      bias: 'Bullish Bias',
      direction: 'BUY',
      positionText: `Above R1 (${fmt(levels.r1)})`,
      targetResistanceText: `R2 (${fmt(levels.r2)})`,
      nearestInvalidationText: `Pivot (${fmt(levels.p)})`,
      conditionText: `Current gold spot is trading above R1 (${fmt(levels.r1)}). Strong intraday upward bias pointing toward R2 resistance.`,
      activeLevel: 'R1',
      nextTargetLevel: 'R2',
    }
  } else if (currentPrice >= levels.p) {
    return {
      bias: 'Bullish Bias',
      direction: 'BUY',
      positionText: `Above Pivot (${fmt(levels.p)})`,
      targetResistanceText: `R1 (${fmt(levels.r1)})`,
      nearestInvalidationText: `Pivot (${fmt(levels.p)})`,
      conditionText: `Current gold spot is trading above Pivot (${fmt(levels.p)}). Upward momentum heading toward R1 resistance.`,
      activeLevel: 'PP',
      nextTargetLevel: 'R1',
    }
  } else if (currentPrice <= levels.s1) {
    return {
      bias: 'Bearish Bias',
      direction: 'SELL',
      positionText: `Below S1 (${fmt(levels.s1)})`,
      targetResistanceText: `S2 (${fmt(levels.s2)})`,
      nearestInvalidationText: `Pivot (${fmt(levels.p)})`,
      conditionText: `Current gold spot is trading below S1 (${fmt(levels.s1)}). Downward pressure pointing toward S2 support.`,
      activeLevel: 'S1',
      nextTargetLevel: 'S2',
    }
  } else {
    return {
      bias: 'Bearish Bias',
      direction: 'SELL',
      positionText: `Below Pivot (${fmt(levels.p)})`,
      targetResistanceText: `S1 (${fmt(levels.s1)})`,
      nearestInvalidationText: `Pivot (${fmt(levels.p)})`,
      conditionText: `Current gold spot is trading below Pivot (${fmt(levels.p)}). Testing nearest support at S1.`,
      activeLevel: 'PP',
      nextTargetLevel: 'S1',
    }
  }
}
