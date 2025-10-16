import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CategoryGrid } from "@/components/category-grid"
import type { ClothingCategory } from "@/lib/types"

const categoryNames: Record<ClothingCategory, string> = {
  shirts: "Shirts",
  pants: "Pants",
  skirts: "Skirts",
  dresses: "Dresses",
  shoes: "Shoes",
  accessories: "Accessories",
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = slug as ClothingCategory

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
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-800 italic">
              {categoryNames[category]}
            </h1>
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 max-w-6xl mx-auto w-full">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl mx-4 mb-4">
            <CategoryGrid category={category} />
          </div>
        </div>

        {/* Return Button */}
        <div className="flex justify-end p-8">
          <Link href="/create-outfit">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-gray-800 px-12">
              Return
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
