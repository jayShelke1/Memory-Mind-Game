"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, useAnimation, AnimatePresence } from "framer-motion"
import { Star, Sparkles } from "lucide-react"

interface CursorProps {
  enabled: boolean
}

const AnimatedCursor: React.FC<CursorProps> = ({ enabled }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isPointer, setIsPointer] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const cursorAnimation = useAnimation()
  const trailElements = 5

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY })
    }

    const updateCursorType = () => {
      const hoveredElement = document.elementFromPoint(mousePosition.x, mousePosition.y)
      setIsPointer(window.getComputedStyle(hoveredElement as Element).cursor === "pointer")
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    if (enabled) {
      window.addEventListener("mousemove", updateMousePosition)
      window.addEventListener("mousemove", updateCursorType)
      window.addEventListener("mousedown", handleMouseDown)
      window.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      window.removeEventListener("mousemove", updateMousePosition)
      window.removeEventListener("mousemove", updateCursorType)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [enabled, mousePosition.x, mousePosition.y])

  useEffect(() => {
    if (enabled) {
      cursorAnimation.start({
        x: mousePosition.x - 16,
        y: mousePosition.y - 16,
        transition: { type: "spring", mass: 0.6 },
      })
    }
  }, [mousePosition, cursorAnimation, enabled])

  if (!enabled) return null

  return (
    <>
      <style jsx global>{`
        body {
          cursor: none;
        }
        a, button, [role="button"] {
          cursor: none;
        }
      `}</style>
      <AnimatePresence>
        {Array.from({ length: trailElements }).map((_, index) => (
          <motion.div
            key={index}
            className="fixed top-0 left-0 pointer-events-none z-50"
            initial={{ scale: 0, x: mousePosition.x - 8, y: mousePosition.y - 8 }}
            animate={{
              scale: 1 - index * 0.2,
              x: mousePosition.x - 8,
              y: mousePosition.y - 8,
              opacity: 1 - index * 0.2,
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <Star size={16} className="text-yellow-400 opacity-50" />
          </motion.div>
        ))}
      </AnimatePresence>
      <motion.div className="fixed top-0 left-0 pointer-events-none z-50" animate={cursorAnimation}>
        <motion.div
          animate={{
            rotate: 360,
            scale: isClicking ? 0.8 : isPointer ? 1.2 : 1,
          }}
          transition={{
            rotate: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            scale: { duration: 0.3 },
          }}
        >
          {isPointer ? (
            <Sparkles size={32} className="text-yellow-400 drop-shadow-lg" />
          ) : (
            <Star size={32} className="text-yellow-400 drop-shadow-lg" />
          )}
        </motion.div>
      </motion.div>
    </>
  )
}

export default AnimatedCursor

