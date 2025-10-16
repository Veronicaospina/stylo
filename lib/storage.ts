"use client"

import type { ClothingItem, ClothingCategory, Outfit } from "./types"

const STORAGE_KEY = "virtual-closet-items"
const OUTFITS_STORAGE_KEY = "virtual-closet-outfits"

export function getItems(): ClothingItem[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []
  return JSON.parse(stored)
}

export function getItemsByCategory(category: ClothingCategory): ClothingItem[] {
  return getItems().filter((item) => item.category === category)
}

export function addItem(item: Omit<ClothingItem, "id" | "createdAt">): ClothingItem {
  const newItem: ClothingItem = {
    ...item,
    id: crypto.randomUUID(),
    createdAt: new Date(),
  }
  const items = getItems()
  items.push(newItem)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  return newItem
}

export function deleteItem(id: string): void {
  const items = getItems().filter((item) => item.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function getOutfits(): Outfit[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(OUTFITS_STORAGE_KEY)
  if (!stored) return []
  return JSON.parse(stored)
}

export function getOutfitById(id: string): Outfit | undefined {
  return getOutfits().find((outfit) => outfit.id === id)
}

export function addOutfit(outfit: Omit<Outfit, "id" | "createdAt">): Outfit {
  const newOutfit: Outfit = {
    ...outfit,
    id: crypto.randomUUID(),
    createdAt: new Date(),
  }
  const outfits = getOutfits()
  outfits.push(newOutfit)
  localStorage.setItem(OUTFITS_STORAGE_KEY, JSON.stringify(outfits))
  return newOutfit
}

export function deleteOutfit(id: string): void {
  const outfits = getOutfits().filter((outfit) => outfit.id !== id)
  localStorage.setItem(OUTFITS_STORAGE_KEY, JSON.stringify(outfits))
}
