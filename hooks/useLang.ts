'use client'
import { useState, useEffect, useCallback } from 'react'
import { translations, LANGUAGES, type LangCode } from '@/lib/i18n'

const STORAGE_KEY = 'ob_lang'
const LANG_EVENT  = 'ob:langchange'

export function useLang() {
  const [lang, setLangState] = useState<LangCode>('en')

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as LangCode | null
    if (saved && saved in translations) setLangState(saved)

    function onLangChange(e: Event) {
      setLangState((e as CustomEvent<LangCode>).detail)
    }
    window.addEventListener(LANG_EVENT, onLangChange)
    return () => window.removeEventListener(LANG_EVENT, onLangChange)
  }, [])

  const setLang = useCallback((newLang: LangCode) => {
    localStorage.setItem(STORAGE_KEY, newLang)
    setLangState(newLang)
    window.dispatchEvent(new CustomEvent(LANG_EVENT, { detail: newLang }))
  }, [])

  const t = useCallback((key: string): string => {
    return translations[lang]?.[key] ?? translations.sr[key] ?? key
  }, [lang])

  const currentLang = LANGUAGES.find(l => l.code === lang) ?? LANGUAGES[0]

  return { lang, setLang, t, currentLang, LANGUAGES }
}
