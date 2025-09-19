'use client'

import { useEffect } from 'react'

export default function HtmlLangSetter({ lang }) {
  useEffect(() => {
    if (!lang) return
    document.documentElement.setAttribute('lang', lang)
  }, [lang])
  return null
}
