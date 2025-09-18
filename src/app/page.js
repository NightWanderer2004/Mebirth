"use client"

import { useCallback, useEffect, useState } from 'react'

export default function Home() {
  const lines = [
    "> Меня не по себе.",
    "> Почему?",
    "> Я витаю в просторной, стерильной комнате с огромным окном, которое открывает вид на прекрасный дзен-сад. Всё моё внимание обращено на него. Я аккуратно решаюсь в него заглянуть, никаких угроз обнаружено не было. Я в предвкушении делаю расслабленный шаг и бьюсь об незаметное стекло, ловля глупый ступор и недоумение.",
  ]

  const [visibleCount, setVisibleCount] = useState(1)

  const advance = useCallback(() => {
    setVisibleCount((current) => (current >= lines.length ? 1 : current + 1))
  }, [lines.length])

  useEffect(() => {
    const handleClick = () => advance()
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [advance])

  return (
    <div className='font-book font-medium tracking-wide text-2xl flex flex-col gap-6 items-start [&>p]:px-5 [&>p:nth-child(even)]:italic [&>p:nth-child(even)]:bg-foreground/60 [&>p:nth-child(even)]:text-background select-none'>
      {lines.slice(0, visibleCount).map((text, index) => (
        <p key={index}>{text}</p>
      ))}
    </div>
  )
}
