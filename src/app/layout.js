import { EB_Garamond, Geist_Mono, Sawarabi_Gothic } from 'next/font/google'
import { cookies } from 'next/headers'
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

const sawarabiGothic = Sawarabi_Gothic({
  variable: '--font-sawarabi-gothic',
  weight: ['400'],
})

export const metadata = {
  title: Package.name,
}

export default function RootLayout({ children }) {
  const cookieStore = cookies()
  const cookieLocale = cookieStore.get('locale')?.value
  const lang = cookieLocale && ['ru', 'en', 'jp'].includes(cookieLocale) ? cookieLocale : 'en'

  return (
    <html lang={lang}>
      <body className={`${ebGaramond.variable} ${geistMono.variable} ${sawarabiGothic.variable} mx-auto container relative max-w-2xl pt-30 pb-[65vh] antialiased bg-background text-foreground`}>{children}</body>
    </html>
  )
}
