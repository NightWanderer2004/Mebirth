"use client"

import { useCallback, useEffect, useMemo, useState } from 'react'

function parseDialogFile(text) {
  const normalized = text.replace(/\r\n/g, '\n').trim()
  if (!normalized) return []
  const blocks = normalized.split(/\n{2,}/)
  return blocks
    .map((block) => block.split('\n').map((line) => line.trim()))
    .map((lines) => lines.filter((l) => l.length > 0).join('\n'))
}

export default function Home() {
  const [segments, setSegments] = useState([])
  const [visibleCount, setVisibleCount] = useState(1)
  const [error, setError] = useState(null)

  const total = useMemo(() => segments.length, [segments])

  const advance = useCallback(() => {
    if (total === 0) return
    setVisibleCount((current) => current + 1)
  }, [total])

  useEffect(() => {
    let isCancelled = false
    ;(async () => {
      try {
        const response = await fetch('/api/dialog', { cache: 'no-store' })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const text = await response.text()
        if (isCancelled) return
        setSegments(parseDialogFile(text))
        setVisibleCount(1)
      } catch (e) {
        if (isCancelled) return
        setError('Не удалось загрузить dialog.txt')
      }
    })()
    const handleClick = () => advance()
    window.addEventListener('click', handleClick)
    return () => {
      isCancelled = true
      window.removeEventListener('click', handleClick)
    }
  }, [advance])

  const fullLoops = total > 0 ? Math.floor((visibleCount - 1) / total) : 0
  const remainderCount = total > 0 ? ((visibleCount - 1) % total) + 1 : 0

  const elements = []
  for (let loopIndex = 0; loopIndex < fullLoops; loopIndex++) {
    for (let segmentIndex = 0; segmentIndex < total; segmentIndex++) {
      elements.push(<p key={`loop-${loopIndex}-seg-${segmentIndex}`}>{segments[segmentIndex]}</p>)
    }
    elements.push(<div key={`loop-spacer-${loopIndex}`} aria-hidden className='h-10' />)
  }
  for (let segmentIndex = 0; segmentIndex < remainderCount; segmentIndex++) {
    elements.push(<p key={`current-seg-${segmentIndex}`}>{segments[segmentIndex]}</p>)
  }

  return (
    <div className='font-book font-medium tracking-wide text-2xl flex flex-col gap-6 items-start [&>p]:px-5 [&>p]:whitespace-pre-wrap [&>p:nth-child(even)]:italic [&>p:nth-child(even)]:bg-foreground/60 [&>p:nth-child(even)]:text-background select-none'>
      {elements}
      {error ? <p className='font-mono text-base opacity-60'>{error}</p> : null}
    </div>
  )
}
