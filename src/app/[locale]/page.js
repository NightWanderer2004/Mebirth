'use client'

import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'

function parseDialogFile(text) {
  const normalized = text.replace(/\r\n/g, '\n').trim()
  if (!normalized) return []
  const blocks = normalized.split(/\n{2,}/)
  return blocks.map((block) => block.split('\n').map((line) => line.trim())).map((lines) => lines.filter((l) => l.length > 0).join('\n'))
}

const MESSAGES = {
  ru: { failed: 'Не удалось загрузить dialog.txt' },
  en: { failed: 'Failed to load dialog.txt' },
  jp: { failed: 'dialog.txt を読み込めませんでした' },
}

export default function Home() {
  const { locale } = useParams()
  const [segments, setSegments] = useState([])
  const [visibleCount, setVisibleCount] = useState(1)
  const [error, setError] = useState(null)
  const [typingIndex, setTypingIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)

  const total = useMemo(() => segments.length, [segments])

  const advance = useCallback(() => {
    if (total === 0) return
    setVisibleCount((current) => current + 1)
  }, [total])

  useEffect(() => {
    let isCancelled = false
    ;(async () => {
      try {
        const response = await fetch(`/api/dialog?locale=${encodeURIComponent(locale)}`, { cache: 'no-store' })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const text = await response.text()
        if (isCancelled) return
        setSegments(parseDialogFile(text))
        setVisibleCount(1)
        setTypingIndex(0)
      } catch (e) {
        if (isCancelled) return
        const dict = MESSAGES[locale] || MESSAGES.ru
        setError(dict.failed)
      }
    })()
    return () => {
      isCancelled = true
    }
  }, [advance, locale])

  useEffect(() => {
    if (visibleCount < 1) return
    const scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)
    window.scrollTo({ top: scrollHeight, behavior: 'smooth' })
  }, [visibleCount])

  const fullLoops = total > 0 ? Math.floor((visibleCount - 1) / total) : 0
  const remainderCount = total > 0 ? ((visibleCount - 1) % total) + 1 : 0

  const currentSegment = useMemo(() => {
    if (total === 0 || remainderCount === 0) return ''
    return segments[remainderCount - 1]
  }, [segments, total, remainderCount])

  useLayoutEffect(() => {
    if (!currentSegment) return
    setTypingIndex(0)
    setIsTyping(true)
    const interval = setInterval(() => {
      setTypingIndex((prev) => {
        if (prev + 1 >= currentSegment.length) {
          clearInterval(interval)
          setIsTyping(false)
          return currentSegment.length
        }
        return prev + 1
      })
    }, 20)
    return () => clearInterval(interval)
  }, [currentSegment])

  const elements = []
  for (let loopIndex = 0; loopIndex < fullLoops; loopIndex++) {
    for (let segmentIndex = 0; segmentIndex < total; segmentIndex++) {
      elements.push(
        <p key={`loop-${loopIndex}-seg-${segmentIndex}`} className="fade-in">
          {segments[segmentIndex]}
        </p>
      )
    }
    elements.push(<div key={`loop-spacer-${loopIndex}`} aria-hidden className="h-40" />)
  }
  for (let segmentIndex = 0; segmentIndex < remainderCount; segmentIndex++) {
    const isLastInCurrentLoop = segmentIndex === remainderCount - 1
    const fullText = segments[segmentIndex]
    const content = isLastInCurrentLoop ? fullText.slice(0, typingIndex) : fullText
    elements.push(
      <p key={`current-seg-${segmentIndex}`} className="fade-in relative">
        {content}
        {isLastInCurrentLoop && !isTyping ? (
          <button
            type="button"
            aria-label="Tap to continue"
            onClick={(e) => {
              e.stopPropagation()
              handleUserAdvance()
            }}
            className="fade-in absolute -left-10 top-0 "
          >
            <img src="/pointer.png" alt="continue" className="animate-pulse w-6 mix-blend-overlay opacity-90" />
          </button>
        ) : null}
      </p>
    )
  }

  const handleUserAdvance = useCallback(() => {
    if (total === 0 || remainderCount === 0) return
    const currentText = segments[remainderCount - 1]
    if (typingIndex < currentText.length) {
      setTypingIndex(currentText.length)
      setIsTyping(false)
      return
    }
    advance()
  }, [advance, total, remainderCount, segments, typingIndex])

  useEffect(() => {
    const onClick = (e) => {
      handleUserAdvance()
    }
    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [handleUserAdvance])

  return (
    <div className="font-medium tracking-wide text-2xl flex flex-col gap-6 items-start [&>p]:px-5 [&>p]:whitespace-pre-wrap [&>p:nth-child(even)]:italic [&>p:nth-child(even)]:bg-foreground/60 [&>p:nth-child(even)]:text-background [&>p:nth-child(even)>button]:-top-2 select-none">
      {elements}
      {error ? <p className="font-mono text-base opacity-60">{error}</p> : null}
    </div>
  )
}
