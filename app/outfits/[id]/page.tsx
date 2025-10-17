"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getOutfitById } from "@/lib/storage"
import type { Outfit } from "@/lib/types"

export default function OutfitDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [outfit, setOutfit] = useState<Outfit | null>(null)
  const { id } = use(params)

  useEffect(() => {
    ;(async () => {
      const foundOutfit = await getOutfitById(id)
      setOutfit(foundOutfit || null)
    })()
  }, [id])

  if (!outfit) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Outfit not found</p>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url(/images/closet-background.jpg)",
        }}
      >
        <div className="absolute inset-0 bg-white/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col p-8">
        {/* Header */}
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-r from-gray-200/95 to-gray-300/95 backdrop-blur-sm px-12 py-6 rounded-lg shadow-2xl border border-gray-400/30">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-800 italic">{outfit.name}</h1>
          </div>
        </div>

        {/* Outfit Items */}
        <div className="flex-1 max-w-4xl mx-auto w-full">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-8 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {outfit.items.map((item) => (
                <div key={item.id} className="space-y-2">
                  <div className="group relative aspect-square rounded-lg overflow-hidden border-2 border-gray-300">
                    <img
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Hover details overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end">
                      <div className="w-full p-3 text-white text-xs sm:text-sm space-y-1">
                        <div className="font-semibold text-sm truncate">{item.name}</div>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                          <span className="text-white/80">Type:</span>
                          <span className="truncate capitalize">{item.category}</span>
                          <span className="text-white/80">Brand:</span>
                          <span className="truncate">{item.brand || "—"}</span>
                          <span className="text-white/80">Style:</span>
                          <span className="truncate">{item.style || "—"}</span>
                          <span className="text-white/80">Color:</span>
                          <span className="truncate">{item.color || "—"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">{item.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Link href="/ar-tryout">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-gray-800 px-12">
                Try On (AR)
              </Button>
            </Link>
            <Link href="/outfits">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-gray-800 px-12">
                Return
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
