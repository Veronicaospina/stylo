"use client"

import type { ClothingItem, ClothingCategory, Outfit } from "./types"
import { getCurrentUser } from "./auth"

function headersWithUser() {
  const user = getCurrentUser()
  return {
    "Content-Type": "application/json",
    ...(user ? { "x-user-id": user.id } : {}),
  }
}

export async function getItems(): Promise<ClothingItem[]> {
  const res = await fetch("/api/items", { headers: headersWithUser() })
  if (!res.ok) return []
  const items = (await res.json()) as any[]
  return items.map((i) => ({ ...i, createdAt: new Date(i.createdAt) })) as ClothingItem[]
}

export async function getItemsByCategory(category: ClothingCategory): Promise<ClothingItem[]> {
  const items = await getItems()
  return items.filter((item) => item.category === category)
}

export async function addItem(item: Omit<ClothingItem, "id" | "createdAt">): Promise<ClothingItem | null> {
  const res = await fetch("/api/items", {
    method: "POST",
    headers: headersWithUser(),
    body: JSON.stringify(item),
  })
  if (!res.ok) return null
  const created = await res.json()
  return { ...created, createdAt: new Date(created.createdAt) } as ClothingItem
}

export async function deleteItem(id: string): Promise<boolean> {
  const res = await fetch("/api/items", {
    method: "DELETE",
    headers: headersWithUser(),
    body: JSON.stringify({ id }),
  })
  return res.ok
}

export async function getOutfits(): Promise<Outfit[]> {
  const res = await fetch("/api/outfits", { headers: headersWithUser() })
  if (!res.ok) return []
  const outfits = (await res.json()) as any[]
  return outfits.map((o) => ({ id: o.id, name: o.name, items: [], createdAt: new Date(o.createdAt) }))
}

export async function getOutfitById(id: string): Promise<Outfit | undefined> {
  const res = await fetch(`/api/outfits/${id}`, { headers: headersWithUser() })
  if (!res.ok) return undefined
  const o = await res.json()
  // Map joined payload to Outfit shape with nested ClothingItem[]
  const items: ClothingItem[] = (o.items || []).map((oi: any) => ({
    ...(oi.item as any),
    createdAt: new Date(oi.item.createdAt),
  }))
  return { id: o.id, name: o.name, items, createdAt: new Date(o.createdAt) }
}

export async function addOutfit(outfit: Omit<Outfit, "id" | "createdAt">): Promise<Outfit | null> {
  const res = await fetch("/api/outfits", {
    method: "POST",
    headers: headersWithUser(),
    body: JSON.stringify({ name: outfit.name, itemIds: outfit.items.map((i) => i.id) }),
  })
  if (!res.ok) return null
  const o = await res.json()
  const items: ClothingItem[] = (o.items || []).map((oi: any) => ({ ...oi.item, createdAt: new Date(oi.item.createdAt) }))
  return { id: o.id, name: o.name, items, createdAt: new Date(o.createdAt) }
}

export async function deleteOutfit(id: string): Promise<boolean> {
  const res = await fetch(`/api/outfits/${id}`, {
    method: "DELETE",
    headers: headersWithUser(),
  })
  return res.ok
}
