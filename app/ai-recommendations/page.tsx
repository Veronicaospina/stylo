"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getItems } from "@/lib/storage"
import type { ClothingItem } from "@/lib/types"
import { Loader2, Sparkles } from "lucide-react"

interface Recommendation {
  recommendedItems: string[]
  reasoning: string
  stylingTips: string
}

export default function AIRecommendationsPage() {
  const router = useRouter()
  const [items, setItems] = useState<ClothingItem[]>([])
  const [occasion, setOccasion] = useState("")
  const [style, setStyle] = useState("")
  const [loading, setLoading] = useState(false)
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null)
  const [recommendedItemsDetails, setRecommendedItemsDetails] = useState<ClothingItem[]>([])

  useEffect(() => {
    setItems(getItems())
  }, [])

  const handleGetRecommendation = async () => {
    if (items.length === 0) {
      alert("Please add some clothing items to your closet first!")
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
          items,
          occasion,
          style,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get recommendation")
      }

      const data = await response.json()
      setRecommendation(data)

      // Find the actual item objects for the recommended items
      const recommended = items.filter((item) =>
        data.recommendedItems.some((name: string) => item.name.toLowerCase().includes(name.toLowerCase())),
      )
      setRecommendedItemsDetails(recommended)
    } catch (error) {
      console.error("Error:", error)
      alert("Failed to get AI recommendation. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveOutfit = () => {
    if (recommendedItemsDetails.length > 0) {
      sessionStorage.setItem("outfit-items", JSON.stringify(recommendedItemsDetails))
      router.push("/save-outfit")
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
                  Occasion (optional)
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
                  Preferred Style (optional)
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
                disabled={loading || items.length === 0}
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

              {items.length === 0 && (
                <p className="text-center text-muted-foreground text-sm">
                  Add some clothing items to your closet to get started!
                </p>
              )}
            </div>

            {/* Recommendation Display */}
            {recommendation && (
              <div className="space-y-6 pt-6 border-t-2 border-gray-200">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-gray-800 mb-3">Recommended Outfit</h3>
                  {recommendedItemsDetails.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      {recommendedItemsDetails.map((item) => (
                        <div key={item.id} className="space-y-2">
                          <div className="aspect-square rounded-lg overflow-hidden border-2 border-primary">
                            <img
                              src={item.imageUrl || "/placeholder.svg"}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-sm font-medium text-center">{item.name}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground mb-4">
                      Items: {recommendation.recommendedItems.join(", ") || "See reasoning below"}
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Why This Works</h3>
                  <p className="text-gray-700 leading-relaxed">{recommendation.reasoning}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Styling Tips</h3>
                  <p className="text-gray-700 leading-relaxed">{recommendation.stylingTips}</p>
                </div>

                {recommendedItemsDetails.length > 0 && (
                  <Button
                    onClick={handleSaveOutfit}
                    className="w-full bg-accent hover:bg-accent/90 text-gray-800 font-semibold py-4"
                  >
                    Save This Outfit
                  </Button>
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
