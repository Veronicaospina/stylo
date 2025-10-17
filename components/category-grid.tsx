"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { getItemsByCategory, deleteItem } from "@/lib/storage"
import type { ClothingCategory, ClothingItem } from "@/lib/types"
import { X } from "lucide-react"

interface CategoryGridProps {
  category: ClothingCategory
  onItemClick?: (item: ClothingItem) => void
  selectedItems?: string[]
}

export function CategoryGrid({ category, onItemClick, selectedItems = [] }: CategoryGridProps) {
  const [items, setItems] = useState<ClothingItem[]>([])

  useEffect(() => {
    void loadItems()
  }, [category])

  const loadItems = async () => {
    const categoryItems = await getItemsByCategory(category)
    setItems(categoryItems)
  }

  const handleDelete = async (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation()
    if (confirm("Are you sure you want to delete this item?")) {
      await deleteItem(itemId)
      await loadItems()
    }
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => onItemClick?.(item)}
          className={`group relative aspect-square bg-gradient-to-b from-white to-blue-50 rounded-lg border-2 overflow-hidden cursor-pointer transition-all hover:scale-105 ${
            selectedItems.includes(item.id) ? "border-primary ring-4 ring-primary/30" : "border-gray-300"
          }`}
        >
          <img src={item.imageUrl || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
          <button
            onClick={(e) => handleDelete(e, item.id)}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
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
      {items.length === 0 && (
        <div className="col-span-full text-center py-12 text-muted-foreground">
          No items in this category yet. Add some items to get started!
        </div>
      )}
    </div>
  )
}
