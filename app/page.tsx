'use client'
import MemoryGame from "@/components/Memorygame"
import { useState, useEffect } from "react"

export default function Home(){
  const [cursorEnabled, setCursorEnabled] = useState(true)
  const [bgGlow, setBgGlow] = useState(false)


  useEffect(() => {
    const interval = setInterval(() => {
      setBgGlow(true)
      setTimeout(() => setBgGlow(false), 500)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <main>
      <MemoryGame/>
      {/* <Weather/>
      <AnimatedCursor enabled={cursorEnabled} /> */}
    </main>
  )
}