'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'
import {
  emptyGoldCalculatorDraft,
  GOLD_TOZ,
  type GoldCalculatorDraft,
  type GoldCalculatorResult,
  type GoldHistory,
} from '@/lib/goldcalc-data'

type GoldHistoryContextValue = {
  goldItems: GoldHistory[]
  addGold: (x: GoldHistory) => void
  setGoldItems: Dispatch<SetStateAction<GoldHistory[]>>
  calculatorDraft: GoldCalculatorDraft
  setCalculatorDraft: Dispatch<SetStateAction<GoldCalculatorDraft>>
  loadGoldCalculation: (item: GoldHistory) => void
}

const GoldHistoryContext = createContext<GoldHistoryContextValue | null>(null)

function isGoldHistory(value: unknown): value is GoldHistory {
  if (!value || typeof value !== 'object') return false
  const item = value as Record<string, unknown>
  return (
    typeof item.id === 'string' &&
    typeof item.capital === 'number' &&
    typeof item.buyingPrice === 'number' &&
    typeof item.sellingPrice === 'number' &&
    typeof item.quantity === 'number' &&
    typeof item.profit === 'number' &&
    typeof item.date === 'string'
  )
}

function isGoldCalculatorResult(value: unknown): value is GoldCalculatorResult {
  if (!value || typeof value !== 'object') return false
  const result = value as Record<string, unknown>
  return [
    result.quantityGrams,
    result.totalBuyingPrice,
    result.totalSellingPrice,
    result.spreadPerGram,
    result.profit,
    result.profitPercent,
  ].every((field) => typeof field === 'number')
}

function isGoldCalculatorDraft(value: unknown): value is GoldCalculatorDraft {
  if (!value || typeof value !== 'object') return false
  const draft = value as Record<string, unknown>
  return (
    typeof draft.capital === 'string' &&
    typeof draft.buyingPrice === 'string' &&
    typeof draft.sellingPrice === 'string' &&
    typeof draft.exchangeRate === 'string' &&
    typeof draft.toz === 'string' &&
    (draft.result === null || isGoldCalculatorResult(draft.result))
  )
}

export function GoldHistoryProvider({ children }: { children: ReactNode }) {
  const [goldItems, setGoldItems] = useState<GoldHistory[]>([])
  const [calculatorDraft, setCalculatorDraft] = useState<GoldCalculatorDraft>(
    emptyGoldCalculatorDraft,
  )
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    try {
      const savedItems = localStorage.getItem('auva-gold-history')
      if (savedItems) {
        const parsedItems: unknown = JSON.parse(savedItems)
        if (Array.isArray(parsedItems)) setGoldItems(parsedItems.filter(isGoldHistory))
      }
    } catch (error) {
      console.error('Failed to restore gold calculation history from local storage.', error)
    }

    try {
      const savedDraft = localStorage.getItem('auva-gold-calculator')
      if (savedDraft) {
        const parsedDraft: unknown = JSON.parse(savedDraft)
        if (isGoldCalculatorDraft(parsedDraft)) {
          setCalculatorDraft({ ...parsedDraft, toz: String(GOLD_TOZ) })
        }
      }
    } catch (error) {
      console.error('Failed to restore gold calculator state from local storage.', error)
    }

    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated) return
    try {
      localStorage.setItem('auva-gold-history', JSON.stringify(goldItems))
    } catch (error) {
      console.error('Failed to save gold calculation history to local storage.', error)
    }
  }, [goldItems, isHydrated])

  useEffect(() => {
    if (!isHydrated) return
    try {
      localStorage.setItem('auva-gold-calculator', JSON.stringify(calculatorDraft))
    } catch (error) {
      console.error('Failed to save gold calculator state to local storage.', error)
    }
  }, [calculatorDraft, isHydrated])

  const addGold = useCallback((x: GoldHistory) => {
    setGoldItems((items) => [x, ...items])
  }, [])

  const loadGoldCalculation = useCallback((item: GoldHistory) => {
    const exchangeRate =
      item.exchangeRate && item.exchangeRate > 0
        ? item.exchangeRate
        : item.buyingPriceUsd && item.buyingPriceUsd > 0
          ? (item.buyingPrice * GOLD_TOZ) / item.buyingPriceUsd
          : 1
    const buyingPrice =
      item.buyingPriceUsd ?? (item.buyingPrice * GOLD_TOZ) / exchangeRate
    const sellingPrice =
      item.sellingPriceUsd ?? (item.sellingPrice * GOLD_TOZ) / exchangeRate

    setCalculatorDraft({
      capital: String(item.capital),
      buyingPrice: String(buyingPrice),
      sellingPrice: String(sellingPrice),
      exchangeRate: String(exchangeRate),
      toz: String(GOLD_TOZ),
      result: null,
    })
  }, [])

  const value = useMemo(
    () => ({
      goldItems,
      addGold,
      setGoldItems,
      calculatorDraft,
      setCalculatorDraft,
      loadGoldCalculation,
    }),
    [goldItems, addGold, calculatorDraft, loadGoldCalculation]
  )

  return (
    <GoldHistoryContext.Provider value={value}>
      {children}
    </GoldHistoryContext.Provider>
  )
}

export function useGoldHistory() {
  const ctx = useContext(GoldHistoryContext)
  if (!ctx) {
    throw new Error('useGoldHistory must be used within GoldHistoryProvider')
  }
  return ctx
}