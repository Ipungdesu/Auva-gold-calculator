'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { translations, type Language, type Translations } from './i18n'

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
  t: Translations
  translate: (text: string) => string
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'id',
  setLang: () => {},
  t: translations.id,
  translate: (text) => text,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('id')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('auva-lang')
    if (saved === 'id' || saved === 'en') {
      setLangState(saved)
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = (l: Language) => {
    setLangState(l)
    localStorage.setItem('auva-lang', l)
  }

  // Use default 'id' until hydrated to prevent mismatch
  const currentLang = mounted ? lang : 'id'
  const translate = (text: string) => translations[currentLang].content[text] ?? text

  return (
    <LanguageContext.Provider
      value={{ lang: currentLang, setLang, t: translations[currentLang], translate }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useTranslation() {
  return useContext(LanguageContext)
}
