"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import type { ClothingItem } from "@/lib/types"

interface AROverlayProps {
  items: ClothingItem[]
  videoRef: React.RefObject<HTMLVideoElement>
}

export function AROverlay({ items, videoRef }: AROverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const video = videoRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const drawOverlay = () => {
      if (!video.videoWidth || !video.videoHeight) return

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw clothing items as overlays
      // This is a simplified version - in a real AR app, you'd use
      // pose detection libraries like MediaPipe or TensorFlow.js
      items.forEach((item, index) => {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.src = item.imageUrl

        img.onload = () => {
          // Position items based on category
          const x = canvas.width / 2 - 100
          let y = 100 + index * 150
          const width = 200
          const height = 200

          if (item.category === "shirts") {
            y = canvas.height * 0.25
          } else if (item.category === "pants" || item.category === "skirts") {
            y = canvas.height * 0.5
          } else if (item.category === "shoes") {
            y = canvas.height * 0.75
          } else if (item.category === "accessories") {
            y = canvas.height * 0.15
          }

          ctx.globalAlpha = 0.7
          ctx.drawImage(img, x, y, width, height)
          ctx.globalAlpha = 1.0
        }
      })

      requestAnimationFrame(drawOverlay)
    }

    drawOverlay()
  }, [items, videoRef])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: "multiply" }}
    />
  )
}
