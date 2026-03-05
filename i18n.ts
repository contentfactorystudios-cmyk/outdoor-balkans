import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ locale }) => {
  const validLocales = ['sr', 'en', 'bs', 'hr']
  const resolvedLocale = validLocales.includes(locale ?? '') ? locale! : 'sr'

  return {
    locale: resolvedLocale,
    messages: {}
  }
})
