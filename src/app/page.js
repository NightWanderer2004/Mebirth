'use client'

import { useRouter } from 'next/navigation'

export default function RootLangGate() {
  const router = useRouter()
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20">
      <h1 className="text-3xl font-book">Choose language</h1>
      <div className="font-medium flex items-center gap-3">
        <button className="border border-foreground/10 px-3 py-1.5 hover:bg-foreground/10" onClick={() => router.push('/ru')}>
          ru
        </button>
        <button className="border border-foreground/10 px-3 py-1.5 hover:bg-foreground/10" onClick={() => router.push('/en')}>
          en
        </button>
        <button className="border border-foreground/10 px-3 py-1.5 hover:bg-foreground/10" onClick={() => router.push('/jp')}>
          jp
        </button>
      </div>
    </div>
  )
}
