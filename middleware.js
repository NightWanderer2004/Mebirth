import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl
  const segments = pathname.split('/').filter(Boolean)
  const first = segments[0]
  const supported = new Set(['ru', 'en', 'jp'])
  const locale = supported.has(first) ? first : undefined

  const response = NextResponse.next()
  if (locale) {
    response.cookies.set('locale', locale, { path: '/' })
  }
  return response
}
