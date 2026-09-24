// Single source of truth for all tradeable instruments.
// Add a new instrument here — pages and components pick it up automatically.

export interface InstrumentConfig {
  /** Supabase ohlc_data symbol value */
  dbSymbol: string
  /** Human-readable name shown in UI */
  label: string
  /** Text for the Live badge in the header */
  liveBadge: string
  /** Sub-heading shown below the main title */
  subtitle: string
  /**
   * Tailwind gradient classes used as background for cards and CTAs.
   * Must be valid Tailwind utility classes (from/via/to).
   */
  gradient: string
  /** CSS hex / hsl colour used for the gradient start (used as accent text) */
  accentColor: string
  /** Soft background used for the active level and signal cards */
  softColor: string
  /** Short market name used in the analysis eyebrow */
  analysisName: string
}

export const INSTRUMENTS: Record<string, InstrumentConfig> = {
  gold: {
    dbSymbol: 'XAUUSD',
    label: 'GOLD',
    liveBadge: 'Reference XAU/USD',
    subtitle:
      'XAU/USD Market.',
    gradient: 'from-[#D4AF37] via-[#c98905] to-[#f0c040]',
    accentColor: '#b8860b',
    softColor: '#fff9dc',
    analysisName: 'DIGITAL GOLD',
  },
  hangseng: {
    dbSymbol: 'HSI',
    label: 'HANGSENG Index',
    liveBadge: 'Reference HSI',
    subtitle:
      'HSI Market.',
    gradient: 'from-[#A80038] to-[#FD3A69]',
    accentColor: '#A80038',
    softColor: '#fff0f3',
    analysisName: 'HANG SENG INDEX',
  },
  nikkei: {
    dbSymbol: 'NIKKEI',
    label: 'NIKKEI INDEX',
    liveBadge: 'Reference NIKKEI',
    subtitle:
      'Nikkei 225 Market.',
    gradient: 'from-[#291F6C] to-[#00A9E8]',
    accentColor: '#291F6C',
    softColor: '#eaf7ff',
    analysisName: 'NIKKEI INDEX',
  },
}

/** Type-safe slug check */
export function isValidSlug(slug: string): slug is keyof typeof INSTRUMENTS {
  return Object.prototype.hasOwnProperty.call(INSTRUMENTS, slug)
}
