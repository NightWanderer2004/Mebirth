import fs from 'node:fs/promises'
import path from 'node:path'

function normalizeLocale(input) {
  if (!input) return 'ru'
  const lc = String(input).toLowerCase()
  const map = {
    ru: 'ru',
    rus: 'ru',
    russian: 'ru',
    en: 'en',
    eng: 'en',
    english: 'en',
    jp: 'jp',
    ja: 'jp',
    jpn: 'jp',
    japanese: 'jp',
    nihongo: 'jp',
  }
  return map[lc] || 'ru'
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  let locale = normalizeLocale(searchParams.get('locale'))
  try {
    const workspaceRoot = process.cwd()
    const candidatePaths = [
      path.join(workspaceRoot, 'public', `@dialog.${locale}.txt`),
      path.join(workspaceRoot, 'public', `dialog.${locale}.txt`),
      path.join(workspaceRoot, 'public', '@dialog.txt'),
      path.join(workspaceRoot, 'public', 'dialog.txt'),
      path.join(workspaceRoot, `@dialog.${locale}.txt`),
      path.join(workspaceRoot, `dialog.${locale}.txt`),
      path.join(workspaceRoot, '@dialog.txt'),
      path.join(workspaceRoot, 'dialog.txt'),
    ]

    let fileContent = null
    for (const filePath of candidatePaths) {
      try {
        const data = await fs.readFile(filePath, 'utf-8')
        fileContent = data
        break
      } catch {}
    }

    if (fileContent == null) {
      return new Response('dialog file not found', { status: 404 })
    }

    return new Response(fileContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    return new Response('internal error', { status: 500 })
  }
}
