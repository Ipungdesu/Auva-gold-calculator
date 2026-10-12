'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'
import type { GoldHistory } from '@/lib/goldcalc-data'

type GoldHistoryContextValue = {
  goldItems: GoldHistory[]
  addGold: (x: GoldHistory) => void
  setGoldItems: Dispatch<SetStateAction<GoldHistory[]>>
}

const GoldHistoryContext = createContext<GoldHistoryContextValue | null>(null)

export function GoldHistoryProvider({ children }: { children: ReactNode }) {
  const [goldItems, setGoldItems] = useState<GoldHistory[]>([])

  const addGold = useCallback((x: GoldHistory) => {
    setGoldItems((items) => [x, ...items])
  }, [])

  const value = useMemo(
    () => ({ goldItems, addGold, setGoldItems }),
    [goldItems, addGold]
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