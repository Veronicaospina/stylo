"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addItem } from "@/lib/storage"
import { getCurrentUser } from "@/lib/auth"
import { AuthGuard } from "@/components/auth-guard"
import type { ClothingCategory } from "@/lib/types"

export default function AddItemPage() {
  const router = useRouter()
  const [category, setCategory] = useState<ClothingCategory | "">("")
  const [name, setName] = useState("")
  const [brand, setBrand] = useState("")
  const [style, setStyle] = useState("")
  const [color, setColor] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

  async function compressImageToDataUrl(file: File, maxSize = 1024, quality = 0.8): Promise<string> {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height))
    const targetW = Math.max(1, Math.round(bitmap.width * scale))
    const targetH = Math.max(1, Math.round(bitmap.height * scale))
    const canvas = document.createElement("canvas")
    canvas.width = targetW
    canvas.height = targetH
    const ctx = canvas.getContext("2d")!
    ctx.drawImage(bitmap, 0, 0, targetW, targetH)
    // Use JPEG to significantly reduce size
    return canvas.toDataURL("image/jpeg", quality)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      // Compress to reduce payload size for API route
      compressImageToDataUrl(file).then(setImagePreview).catch(() => {
        const reader = new FileReader()
        reader.onloadend = () => setImagePreview(reader.result as string)
        reader.readAsDataURL(file)
      })
    }
  }

  const handleSave = async () => {
    if (!category || !name || !imagePreview) {
      alert("Please fill in category, name, and attach an image")
      return
    }

    const user = getCurrentUser()
    if (!user) {
      alert("Please log in to save items")
      return
    }

    const created = await addItem({
      category: category as ClothingCategory,
      name,
      brand,
      style,
      color,
      imageUrl: imagePreview,
    })
    if (!created) {
      alert("Failed to save item. Please ensure you are logged in.")
      return
    }
    router.push("/home")
  }

  return (
    <AuthGuard>
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
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-800 italic text-center">Adding Item</h1>
        </div>

        {/* Form */}
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="category" className="text-base font-medium">
                Type of clothing
              </Label>
              <Select value={category} onValueChange={(value) => setCategory(value as ClothingCategory)}>
                <SelectTrigger id="category" className="mt-2">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shirts">Shirts</SelectItem>
                  <SelectItem value="pants">Pants</SelectItem>
                  <SelectItem value="skirts">Skirts</SelectItem>
                  <SelectItem value="dresses">Dresses</SelectItem>
                  <SelectItem value="shoes">Shoes</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-center">
            <Label htmlFor="image-upload" className="cursor-pointer">
              <div className="inline-block bg-gray-100 hover:bg-gray-200 px-8 py-3 rounded-lg border border-gray-300 transition-colors">
                <span className="text-base font-medium">Attach Image</span>
              </div>
            </Label>
            <Input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  className="max-w-xs mx-auto rounded-lg shadow-md"
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-base font-medium">
                Item name:
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2"
                placeholder="Enter item name"
              />
            </div>

            <div>
              <Label htmlFor="brand" className="text-base font-medium">
                Item brand:
              </Label>
              <Input
                id="brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="mt-2"
                placeholder="Enter brand"
              />
            </div>

            <div>
              <Label htmlFor="style" className="text-base font-medium">
                Item style:
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

            <div>
              <Label htmlFor="color" className="text-base font-medium">
                Item colour:
              </Label>
              <Input
                id="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="mt-2"
                placeholder="Enter color"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button size="lg" onClick={handleSave} className="bg-blue-100 hover:bg-blue-200 text-gray-800 px-12">
              Save Item
            </Button>
            <Link href="/home">
              <Button size="lg" variant="outline" className="px-12 bg-transparent">
                Return
              </Button>
            </Link>
          </div>
        </div>
      </div>
      </div>
    </AuthGuard>
  )
}
