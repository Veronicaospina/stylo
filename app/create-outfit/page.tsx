"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { ClothingItem } from "@/lib/types"

const categories = [
  { id: "shirts", label: "Shirts" },
  { id: "pants", label: "Pants" },
  { id: "skirts", label: "Skirts" },
  { id: "dresses", label: "Dresses" },
  { id: "shoes", label: "Shoes" },
  { id: "accessories", label: "Accessories" },
]

export default function CreateOutfitPage() {
  const router = useRouter()
  const [selectedItems, setSelectedItems] = useState<ClothingItem[]>([])

  const handleClearOutfit = () => {
    setSelectedItems([])
  }

  const handleDressMe = () => {
    router.push("/ai-recommendations")
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
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex justify-center pt-8 pb-4">
          <div className="bg-gradient-to-r from-gray-200/95 to-gray-300/95 backdrop-blur-sm px-12 py-6 rounded-lg shadow-2xl border border-gray-400/30">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-800 italic">Item Categories</h1>
          </div>
        </div>

        {/* Category Grid */}
        <div className="flex-1 max-w-4xl mx-auto w-full px-4">
          <div className="grid grid-cols-2 gap-4 mb-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/select-item/${category.id}`}>
                <div className="bg-primary/95 backdrop-blur-sm px-8 py-12 rounded-lg shadow-xl border border-primary/30 hover:scale-105 transition-transform cursor-pointer">
                  <h2 className="font-serif text-3xl font-bold text-gray-800 italic text-center">{category.label}</h2>
                </div>
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Button
              size="lg"
              onClick={handleClearOutfit}
              className="bg-primary hover:bg-primary/90 text-gray-800 font-serif text-xl italic py-8"
            >
              Clear Outfit
            </Button>
            <Button
              size="lg"
              onClick={handleDressMe}
              className="bg-primary hover:bg-primary/90 text-gray-800 font-serif text-2xl italic py-8"
            >
              DRESS ME
            </Button>
            <Link href="/home" className="w-full">
              <Button
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-gray-800 font-serif text-xl italic py-8"
              >
                Return
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
