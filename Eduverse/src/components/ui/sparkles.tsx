// components/ui/sparkles.tsx
import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"

interface SparklesCoreProps {
  background?: string
  minSize?: number
  maxSize?: number
  particleDensity?: number
  className?: string
  particleColor?: string
}

export function SparklesCore({
  background = "transparent",
  minSize = 0.5,
  maxSize = 1.5,
  particleDensity = 80,
  className,
  particleColor = "#fff",
}: SparklesCoreProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number

    const resize = () => {
      if (!canvas) return
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
    }

    resize()
    window.addEventListener("resize", resize)

    const createParticle = () => {
      const size = Math.random() * (maxSize - minSize) + minSize
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size,
        alpha: Math.random(),
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
      }
    }

    const particles = Array.from({ length: particleDensity }, createParticle)

    const draw = () => {
      ctx.fillStyle = background
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (const p of particles) {
        ctx.globalAlpha = p.alpha
        ctx.fillStyle = particleColor
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()

        p.x += p.dx
        p.y += p.dy

        if (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
          Object.assign(p, createParticle())
        }
      }

      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [background, maxSize, minSize, particleColor, particleDensity])

  return <canvas ref={canvasRef} className={cn("w-full h-full", className)} />
}
