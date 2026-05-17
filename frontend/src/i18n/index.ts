import { createI18n } from 'vue-i18n'
import tr from './locales/tr'
import en from './locales/en'
import ar from './locales/ar'

export type SupportedLocale = 'tr' | 'en' | 'ar'

export const SUPPORTED_LOCALES: SupportedLocale[] = ['tr', 'en', 'ar']
export const RTL_LOCALES: SupportedLocale[] = ['ar']

const STORAGE_KEY = 'mf_locale'

function detectLocale(): SupportedLocale {
  const stored = localStorage.getItem(STORAGE_KEY) as SupportedLocale | null
  if (stored && SUPPORTED_LOCALES.includes(stored)) return stored

  const browserLang = navigator.language.toLowerCase().split('-')[0]
  if (browserLang === 'tr') return 'tr'
  if (browserLang === 'ar') return 'ar'
  if (browserLang === 'en') return 'en'

  return 'tr'
}

export function saveLocale(locale: SupportedLocale) {
  localStorage.setItem(STORAGE_KEY, locale)
}

export const i18n = createI18n({
  legacy: false,
  locale: detectLocale(),
  fallbackLocale: 'tr',
  messages: { tr, en, ar },
})

export default i18n
