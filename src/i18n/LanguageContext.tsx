import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react'
import type { ReactNode } from 'react'
import type { Locale, Translations } from './types.ts'
import zh from './zh.ts'
import en from './en.ts'

const translations: Record<Locale, Translations> = { zh, en }

interface LanguageContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function getInitialLocale(): Locale {
  const saved = localStorage.getItem('lang')
  if (saved === 'zh' || saved === 'en') return saved
  return 'zh'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale)

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('lang', newLocale)
    document.documentElement.lang = newLocale === 'zh' ? 'zh-Hant' : 'en'
  }, [])

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: translations[locale],
    }),
    [locale, setLocale],
  )

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context)
    throw new Error('useLanguage must be used within LanguageProvider')
  return context
}
