"use client"

import { useEffect, useRef } from "react"

export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener("resize", handleResize)

    // Mouse tracking for warp dynamics
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 }
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / width - 0.5) * 60
      mouse.targetY = (e.clientY / height - 0.5) * 60
    }
    window.addEventListener("mousemove", handleMouseMove)

    // Set up line configurations
    const lineCount = 65
    const lines: Array<{
      baseRadius: number
      thickness: number
      color: string
      speed: number
      phaseOffset: number
    }> = []

    // Palette inspired by Vanta.js dark forest / lime green shades
    const greenColors = [
      "rgba(74, 222, 128, ",   // Green 400
      "rgba(132, 204, 22, ",   // Lime 500
      "rgba(163, 230, 53, ",   // Lime 400
      "rgba(34, 197, 94, ",    // Green 500
      "rgba(21, 128, 61, ",    // Green 700
      "rgba(101, 163, 13, ",   // Lime 600
    ]

    for (let i = 0; i < lineCount; i++) {
      const baseRadius = 180 + i * 14 + Math.random() * 8
      const thickness = Math.random() * 3 + 0.5
      const colorBase = greenColors[Math.floor(Math.random() * greenColors.length)]
      const speed = 0.001 + Math.random() * 0.002
      const phaseOffset = Math.random() * Math.PI * 2

      lines.push({
        baseRadius,
        thickness,
        color: colorBase,
        speed,
        phaseOffset,
      })
    }

    let time = 0

    const animate = () => {
      // Background gradient matching the mockup preview
      const bgGrad = ctx.createRadialGradient(
        width * 0.15,
        height * 0.5,
        20,
        width * 0.5,
        height * 0.5,
        width * 0.9
      )
      bgGrad.addColorStop(0, "#03140e")   // Deepest dark forest emerald
      bgGrad.addColorStop(0.6, "#010705") // Dark green transitions
      bgGrad.addColorStop(1, "#000100")   // Almost black edges
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, width, height)

      // Mouse smoothing
      mouse.x += (mouse.targetX - mouse.x) * 0.04
      mouse.y += (mouse.targetY - mouse.y) * 0.04

      // Vortex focal points with drift & mouse offset
      const centerX = -width * 0.2 + mouse.x + Math.sin(time * 0.004) * 30
      const centerY = height * 0.5 + mouse.y + Math.cos(time * 0.0025) * 30

      time += 1.2

      // Draw each curve
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]

        ctx.beginPath()
        ctx.lineWidth = line.thickness

        // Dynamically modulate line shape
        const waveOffset = Math.sin(time * line.speed + line.phaseOffset) * 22
        const radius = line.baseRadius + waveOffset

        // Opacity mapping based on depth
        const alpha = (0.07 + Math.abs(Math.sin(time * 0.0008 + line.phaseOffset)) * 0.12) * 
                      (1 - line.baseRadius / (180 + lineCount * 14))

        ctx.strokeStyle = `${line.color}${alpha})`

        const steps = 90
        const startAngle = -Math.PI * 0.65
        const endAngle = Math.PI * 0.65

        for (let s = 0; s <= steps; s++) {
          const angle = startAngle + (endAngle - startAngle) * (s / steps)
          
          // Micro-waviness for natural fluid motion
          const microWaviness = Math.sin(angle * 5 + time * 0.008) * 6
          const currentRadius = radius + microWaviness

          const lx = centerX + Math.cos(angle) * currentRadius
          const ly = centerY + Math.sin(angle) * currentRadius

          if (s === 0) {
            ctx.moveTo(lx, ly)
          } else {
            ctx.lineTo(lx, ly)
          }
        }
        ctx.stroke()
      }

      // Add vignette/shadow gradient to the right
      const rightVignette = ctx.createLinearGradient(0, 0, width, 0)
      rightVignette.addColorStop(0, "rgba(1, 7, 5, 0.2)")
      rightVignette.addColorStop(0.7, "rgba(0, 1, 0, 0.6)")
      rightVignette.addColorStop(1, "rgba(0, 0, 0, 0.95)")
      ctx.fillStyle = rightVignette
      ctx.fillRect(0, 0, width, height)

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none",
        background: "transparent",
      }}
    />
  )
}
