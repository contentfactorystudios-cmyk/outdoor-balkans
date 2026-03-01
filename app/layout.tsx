import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navigation from '@/components/Navigation'
import SocialSidebar from '@/components/SocialSidebar'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default:  'OutdoorBalkans — Lov i Ribolov na Balkanu',
    template: '%s | OutdoorBalkans',
  },
  description: 'Pronađi najbolje lokacije za lov i ribolov u Srbiji, Hrvatskoj, Bosni i celom Balkanu.',
  metadataBase: new URL('https://outdoorbalkans.com'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sr">
      <body className={inter.className}>
        <Navigation />
      <SocialSidebar />
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
