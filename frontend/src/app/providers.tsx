'use client'

import { ReactNode, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NextIntlClientProvider } from 'next-intl'
import { ThemeProvider } from '@/modules/theme/ThemeProvider'
import { Toaster } from '@/shared/components/ui/Sonner'

interface ProvidersProps {
  children: ReactNode
  locale: string
  messages: Record<string, unknown>
}

export function Providers({ children, locale, messages }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <NextIntlClientProvider key={locale} locale={locale} messages={messages} timeZone="Europe/Moscow">
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </NextIntlClientProvider>
    </QueryClientProvider>
  )
}
