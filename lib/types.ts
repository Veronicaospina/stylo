export type ClothingCategory = "shirts" | "pants" | "skirts" | "dresses" | "shoes" | "accessories"

export interface ClothingItem {
  id: string
  category: ClothingCategory
  name: string
  brand: string
  style: string
  color: string
  imageUrl: string
  createdAt: Date
}

export interface Outfit {
  id: string
  name: string
  items: ClothingItem[]
  createdAt: Date
}
