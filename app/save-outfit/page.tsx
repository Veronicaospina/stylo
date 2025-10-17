"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addOutfit } from "@/lib/storage"
import type { ClothingItem } from "@/lib/types"

export default function SaveOutfitPage() {
  const router = useRouter()
  const [outfitName, setOutfitName] = useState("")
  const [selectedItems, setSelectedItems] = useState<ClothingItem[]>([])

  useEffect(() => {
    const stored = sessionStorage.getItem("outfit-items")
    if (stored) {
      setSelectedItems(JSON.parse(stored))
    }
  }, [])

  const handleSave = async () => {
    if (!outfitName.trim()) {
      alert("Please enter an outfit name")
      return
    }

    if (selectedItems.length === 0) {
      alert("Please select at least one item for the outfit")
      return
    }

    await addOutfit({
      name: outfitName,
      items: selectedItems,
    })

    sessionStorage.removeItem("outfit-items")
    router.push("/outfits")
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
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
      <div className="relative z-10 w-full max-w-2xl mx-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-200/95 to-gray-300/95 backdrop-blur-sm px-12 py-6 rounded-lg shadow-2xl border border-gray-400/30 mb-8">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-800 italic text-center">OutFit</h1>
        </div>

        {/* Form */}
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-8 space-y-6">
          <div>
            <Label htmlFor="outfit-name" className="text-base font-medium">
              Outfit name:
            </Label>
            <Input
              id="outfit-name"
              value={outfitName}
              onChange={(e) => setOutfitName(e.target.value)}
              className="mt-2"
              placeholder="Enter outfit name"
            />
          </div>

          {/* Preview selected items */}
          {selectedItems.length > 0 && (
            <div className="space-y-2">
              <Label className="text-base font-medium">Selected Items:</Label>
              <div className="grid grid-cols-3 gap-2">
                {selectedItems.map((item) => (
                  <div key={item.id} className="group relative aspect-square rounded-lg overflow-hidden border-2 border-gray-300">
                    <img
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end">
                      <div className="w-full p-2 text-white text-[11px] sm:text-xs space-y-1">
                        <div className="font-semibold truncate">{item.name}</div>
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
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button size="lg" onClick={handleSave} className="bg-blue-100 hover:bg-blue-200 text-gray-800 px-12">
              Save Outfit
            </Button>
            <Link href="/create-outfit">
              <Button size="lg" variant="outline" className="px-12 bg-transparent">
                View closet
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
