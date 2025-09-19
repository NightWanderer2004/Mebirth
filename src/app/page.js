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
        const response = await fetch('/api/dialog', { cache: 'no-store' })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const text = await response.text()
        if (isCancelled) return
        setSegments(parseDialogFile(text))
        setVisibleCount(1)
        setTypingIndex(0)
      } catch (e) {
        if (isCancelled) return
        setError('Не удалось загрузить dialog.txt')
      }
    })()
    return () => {
      isCancelled = true
    }
  }, [advance])

  // Smoothly scroll to the bottom after each reveal
  useEffect(() => {
    if (visibleCount < 1) return
    const scrollHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    )
    window.scrollTo({ top: scrollHeight, behavior: 'smooth' })
  }, [visibleCount])

  const fullLoops = total > 0 ? Math.floor((visibleCount - 1) / total) : 0
  const remainderCount = total > 0 ? ((visibleCount - 1) % total) + 1 : 0

  const currentSegment = useMemo(() => {
    if (total === 0 || remainderCount === 0) return ''
    return segments[remainderCount - 1]
  }, [segments, total, remainderCount])

  // Typewriter effect for the current segment
  useEffect(() => {
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
      elements.push(<p key={`loop-${loopIndex}-seg-${segmentIndex}`}>{segments[segmentIndex]}</p>)
    }
    elements.push(<div key={`loop-spacer-${loopIndex}`} aria-hidden className='h-10' />)
  }
  for (let segmentIndex = 0; segmentIndex < remainderCount; segmentIndex++) {
    const isLastInCurrentLoop = segmentIndex === remainderCount - 1
    const fullText = segments[segmentIndex]
    const content = isLastInCurrentLoop ? fullText.slice(0, typingIndex) : fullText
    elements.push(<p key={`current-seg-${segmentIndex}`}>{content}</p>)
  }

  // Handle user tap/click: while typing -> reveal instantly; otherwise -> advance
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
      // Let dedicated button handle its own stopPropagation
      handleUserAdvance()
    }
    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [handleUserAdvance])

  return (
    <div className='font-book font-medium tracking-wide text-2xl flex flex-col gap-6 items-start [&>p]:px-5 [&>p]:whitespace-pre-wrap [&>p:nth-child(even)]:italic [&>p:nth-child(even)]:bg-foreground/60 [&>p:nth-child(even)]:text-background select-none'>
      {elements}
      {error ? <p className='font-mono text-base opacity-60'>{error}</p> : null}

      {/* Advance indicator: bottom-right bouncing down arrow */}
      <div className='fixed bottom-6 right-6 pointer-events-none'>
        <button
          type='button'
          aria-label='Tap to continue'
          onClick={(e) => {
            e.stopPropagation()
            handleUserAdvance()
          }}
          className='pointer-events-auto relative inline-flex items-center justify-center'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            className='h-7 w-7 text-foreground animate-bounce'
            aria-hidden
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7' />
          </svg>
        </button>
      </div>
    </div>
  )
}
