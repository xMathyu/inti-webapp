import type { Metadata } from 'next'
import { poppins } from './fonts'
import './globals.css'

// NEXT-INTL SETUP
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { AppShell } from './components/AppShell'

export const metadata: Metadata = {
  title: 'Parco dei Colori',
  description: 'Associazione di Giardini e Farfalle',
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  return (
    <html lang={locale}>
      <body className={`${poppins.variable} bg-gray-50`}>
        <NextIntlClientProvider locale={locale}>
          <AppShell>{children}</AppShell>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
