import fs from 'node:fs/promises'
import path from 'node:path'

export async function GET() {
  try {
    const workspaceRoot = process.cwd()
    const candidatePaths = [
      path.join(workspaceRoot, 'public', '@dialog.txt'),
      path.join(workspaceRoot, 'public', 'dialog.txt'),
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

