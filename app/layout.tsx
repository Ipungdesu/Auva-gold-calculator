import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { LanguageProvider } from '@/lib/LanguageContext'
import { OfflineSupport } from '@/components/pwa/offline-support'
import './globals.css'
import { GoldHistoryProvider } from '@/components/providers/gold-history-provider' // BARU

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'AUVA APP',
  description: 'Calculate physical gold value, classic pivot points, and monitor gold market context.',
  generator: 'GoldCalc MVP',
  applicationName: 'AUVA APP',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AUVA APP',
  },
  icons: {
    icon: '/logo.svg',
    apple: '/pwa-icon-192.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f7f8fa',
  userScalable: false,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${inter.variable} antialiased`}>
        <GoldHistoryProvider>
          <LanguageProvider>
            {children}
            <OfflineSupport />
          </LanguageProvider>
        </GoldHistoryProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}