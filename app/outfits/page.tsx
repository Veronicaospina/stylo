"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getOutfits, deleteOutfit } from "@/lib/storage"
import type { Outfit } from "@/lib/types"
import { Trash2 } from "lucide-react"

export default function OutfitsPage() {
  const [outfits, setOutfits] = useState<Outfit[]>([])

  useEffect(() => {
    void loadOutfits()
  }, [])

  const loadOutfits = async () => {
    const data = await getOutfits()
    setOutfits(data)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this outfit?")) {
      const ok = await deleteOutfit(id)
      if (!ok) {
        alert("Failed to delete outfit. Please make sure you're logged in.")
      }
      await loadOutfits()
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
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-800 italic">Saved Outfits</h1>
          </div>
        </div>

        {/* Outfits Table */}
        <div className="flex-1 max-w-4xl mx-auto w-full">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-6 mb-6">
            {outfits.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No saved outfits yet. Create your first outfit to get started!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-3 px-4 font-semibold">Outfit ID</th>
                      <th className="text-left py-3 px-4 font-semibold">Outfit Name</th>
                      <th className="text-center py-3 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {outfits.map((outfit, index) => (
                      <tr key={outfit.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4">{index + 1}</td>
                        <td className="py-3 px-4">{outfit.name}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center gap-2">
                            <Link href={`/outfits/${outfit.id}`}>
                              <Button size="sm" variant="outline">
                                View
                              </Button>
                            </Link>
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(outfit.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Link href="/home">
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
