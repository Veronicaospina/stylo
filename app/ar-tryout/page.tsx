"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Camera, CameraOff, RotateCcw, Download } from "lucide-react"

export default function ARTryoutPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user")
  const [error, setError] = useState<string>("")

  useEffect(() => {
    return () => {
      // Cleanup: stop camera when component unmounts
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [stream])

  const startCamera = async () => {
    try {
      setError("")
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.play()
      }

      setStream(mediaStream)
      setCameraActive(true)
    } catch (err) {
      console.error("Error accessing camera:", err)
      setError("Unable to access camera. Please ensure you have granted camera permissions.")
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setCameraActive(false)
  }

  const switchCamera = async () => {
    stopCamera()
    const newFacingMode = facingMode === "user" ? "environment" : "user"
    setFacingMode(newFacingMode)
    setTimeout(() => startCamera(), 100)
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        // Download the captured image
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `outfit-tryout-${Date.now()}.png`
            a.click()
            URL.revokeObjectURL(url)
          }
        })
      }
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex justify-center pt-6 pb-4 px-4">
          <div className="bg-gradient-to-r from-gray-200/95 to-gray-300/95 backdrop-blur-sm px-8 py-4 rounded-lg shadow-2xl border border-gray-400/30">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-800 italic">AR Try-On</h1>
          </div>
        </div>

        {/* Camera View */}
        <div className="flex-1 flex items-center justify-center px-4 pb-4">
          <div className="relative w-full max-w-4xl aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
            {cameraActive ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ transform: facingMode === "user" ? "scaleX(-1)" : "none" }}
                />
                {/* Overlay Guide */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-96 border-2 border-primary/50 rounded-lg">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2 bg-primary/90 px-4 py-2 rounded-lg">
                      <p className="text-sm font-medium text-gray-800">Position yourself here</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Camera className="w-24 h-24 mx-auto text-gray-600" />
                  <p className="text-white text-lg">Camera is off</p>
                  {error && <p className="text-red-400 text-sm max-w-md">{error}</p>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="px-4 pb-8">
          <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-6">
            <div className="flex flex-wrap justify-center gap-4">
              {!cameraActive ? (
                <Button onClick={startCamera} size="lg" className="bg-primary hover:bg-primary/90 text-gray-800 px-8">
                  <Camera className="w-5 h-5 mr-2" />
                  Start Camera
                </Button>
              ) : (
                <>
                  <Button onClick={stopCamera} size="lg" variant="destructive" className="px-8">
                    <CameraOff className="w-5 h-5 mr-2" />
                    Stop Camera
                  </Button>
                  <Button onClick={switchCamera} size="lg" variant="outline" className="px-8 bg-transparent">
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Switch Camera
                  </Button>
                  <Button onClick={capturePhoto} size="lg" className="bg-accent hover:bg-accent/90 text-gray-800 px-8">
                    <Download className="w-5 h-5 mr-2" />
                    Capture Photo
                  </Button>
                </>
              )}
              <Link href="/outfits">
                <Button size="lg" variant="outline" className="px-8 bg-transparent">
                  Return
                </Button>
              </Link>
            </div>

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Position yourself within the guide frame to see how the outfit looks on you.
              </p>
              <p className="text-xs text-muted-foreground">
                Note: This is a basic AR preview. For best results, ensure good lighting and stand at arm's length from
                the camera.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
