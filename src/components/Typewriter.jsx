import { useEffect, useState } from 'react'

// 逐字流式显示纯文本（用于多轮追问回复）
export default function Typewriter({ text, speed = 28, onDone }) {
  const [n, setN] = useState(0)

  useEffect(() => {
    setN(0)
    let i = 0
    const timer = setInterval(() => {
      i += 1
      setN(i)
      if (i >= text.length) {
        clearInterval(timer)
        onDone && onDone()
      }
    }, speed)
    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  const done = n >= text.length
  return (
    <span className={done ? '' : 'cursor-blink'}>{text.slice(0, n)}</span>
  )
}
