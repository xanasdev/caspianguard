export const locales = ['en', 'ru', 'kk', 'az'] as const

export type AppLocale = (typeof locales)[number]

export const defaultLocale: AppLocale = 'ru'
