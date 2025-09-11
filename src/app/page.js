import { cn } from '@/utils/cn'

export default function Home() {
  return (
    <div className='font-book font-medium tracking-wide text-2xl flex flex-col gap-6 items-start [&>p]:px-5 [&>p:nth-child(even)]:italic [&>p:nth-child(even)]:bg-foreground/60 [&>p:nth-child(even)]:text-background '>
      <p>{'>'} Меня не по себе.</p>
      <p>{'>'} Почему?</p>
      <p>
        {'>'} Я витаю в просторной, стерильной комнате с огромным окном, которое открывает вид на прекрасный дзен-сад. Всё моё внимание обращено на него. Я
        аккуратно решаюсь в него заглянуть, никаких угроз обнаружено не было. Я в предвкушении делаю расслабленный шаг и бьюсь об незаметное стекло, ловля
        глупый ступор и недоумение.
      </p>
    </div>
  )
}
