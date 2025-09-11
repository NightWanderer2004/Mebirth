import { EB_Garamond, Geist_Mono } from 'next/font/google'
import './globals.css'
import Package from '../../package.json'

const ebGaramond = EB_Garamond({
  variable: '--font-eb-garamond',
  subsets: ['latin', 'cyrillic'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin', 'cyrillic'],
})

export const metadata = {
  title: Package.name,
}

export default function RootLayout({ children }) {
  return (
    <html lang='ru'>
      <body className={`${ebGaramond.variable} ${geistMono.variable} mx-auto container max-w-2xl py-30 antialiased bg-background text-foreground`}>
        {children}
      </body>
    </html>
  )
}
