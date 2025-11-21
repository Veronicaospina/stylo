"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ClothingItem } from "@/lib/types"
import { getItems } from "@/lib/storage"
import { Loader2, Sparkles } from "lucide-react"
export default function AIRecommendationsPage() {
  const router = useRouter()
  const [occasion, setOccasion] = useState("")
  const [style, setStyle] = useState("")
  const [loading, setLoading] = useState(false)
  const [recommendation, setRecommendation] = useState<string | null>(null)
  const [items, setItems] = useState<ClothingItem[]>([])
  const [matchingItems, setMatchingItems] = useState<ClothingItem[]>([])

  useEffect(() => {
    ;(async () => {
      const data = await getItems()
      setItems(data)
    })()
  }, [])

  const handleGetRecommendation = async () => {
    if (!occasion || !style) {
      alert("Please provide both Occasion and Preferred Style.")
      return
    }

    setLoading(true)
    setRecommendation(null)

    try {
      const response = await fetch("/api/recommend-outfit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          occasion,
          style,
        }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => null)
        console.error("Recommendation API error", err)
        throw new Error("Failed to get recommendation")
      }

      const data = await response.json()
      const recText = data.recommendation || data.text || "No recommendation returned"
      setRecommendation(recText)

      // filter items by the selected preferred style
      try {
        const matches = items.filter((it) => (it.style || "").toLowerCase() === String(style).toLowerCase())
        setMatchingItems(matches)
      } catch (e) {
        setMatchingItems([])
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Failed to get AI recommendation. Please try again.")
    } finally {
      setLoading(false)
    }
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
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-800 italic flex items-center gap-3">
              <Sparkles className="w-10 h-10" />
              AI Stylist
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 max-w-4xl mx-auto w-full">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-8 mb-6 space-y-6">
            {/* Input Section */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="occasion" className="text-base font-medium">
                  Occasion (required)
                </Label>
                <Input
                  id="occasion"
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  placeholder="e.g., casual day out, formal dinner, work meeting"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="style" className="text-base font-medium">
                  Preferred Style (required)
                </Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger id="style" className="mt-2">
                    <SelectValue placeholder="Select a style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="sporty">Sporty</SelectItem>
                    <SelectItem value="elegant">Elegant</SelectItem>
                    <SelectItem value="bohemian">Bohemian</SelectItem>
                    <SelectItem value="minimalist">Minimalist</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleGetRecommendation}
                disabled={loading || !occasion || !style}
                className="w-full bg-primary hover:bg-primary/90 text-gray-800 font-semibold py-6 text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Getting Recommendation...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Get AI Recommendation
                  </>
                )}
              </Button>

              <p className="text-center text-muted-foreground text-sm">Provide an occasion and preferred style to receive an AI recommendation.</p>
            </div>
            {/* Recommendation Display */}
            {recommendation && (
              <div className="space-y-6 pt-6 border-t-2 border-gray-200">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-gray-800 mb-3">AI Recommendation</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{recommendation}</p>
                </div>
              </div>
            )}

            {/* Matching items display */}
            {recommendation && (
              <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-6 mt-6">
                <h3 className="font-semibold text-lg mb-4">Items matching "{style}"</h3>

                {matchingItems.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
                    {matchingItems.map((item) => (
                      <div
                        key={item.id}
                        className="group relative aspect-square bg-gradient-to-b from-white to-blue-50 rounded-lg border-2 overflow-hidden cursor-pointer transition-all hover:scale-105 border-gray-300"
                      >
                        <img src={item.imageUrl || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />

                        {/* Name strip */}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-sm pointer-events-none">
                          <p className="font-medium truncate">{item.name}</p>
                        </div>

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
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">No items found with the selected style.</div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end">
            <Link href="/create-outfit">
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
