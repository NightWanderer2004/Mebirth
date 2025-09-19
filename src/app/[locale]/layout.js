import { use } from 'react'
import HtmlLangSetter from '../components/HtmlLangSetter'
import { cn } from '@/utils/cn'

export default function LocaleLayout({ children, params }) {
  const { locale } = use(params)
  return (
    <>
      <HtmlLangSetter lang={locale} />
      <div className={cn(`locale-${locale}`, locale === 'jp' ? 'font-jp' : 'font-book')}>{children}</div>
    </>
  )
}

export function generateStaticParams() {
  return [{ locale: 'ru' }, { locale: 'en' }, { locale: 'jp' }]
}
