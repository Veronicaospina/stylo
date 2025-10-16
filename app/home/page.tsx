"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AuthGuard } from "@/components/auth-guard"
import { logout, getCurrentUser } from "@/lib/auth"

function HomePageContent() {
  const router = useRouter()
  const user = getCurrentUser()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url(/images/closet-background.jpg)",
        }}
      >
        <div className="absolute inset-0 bg-white/40" />
      </div>

      <div className="absolute top-4 right-4 z-20">
        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
          <p className="text-sm text-gray-600 mb-2">Welcome, {user?.name}!</p>
          <Button onClick={handleLogout} variant="outline" size="sm" className="w-full bg-transparent">
            Logout
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-8 px-4 max-w-2xl mx-auto">
        {/* Create Outfit Button */}
        <Link href="/create-outfit" className="w-full max-w-md">
          <div className="bg-primary/95 backdrop-blur-sm px-12 py-8 rounded-lg shadow-xl border border-primary/30 hover:scale-105 transition-transform cursor-pointer">
            <h2 className="font-serif text-4xl font-bold text-gray-800 italic text-center">Create Outfit</h2>
          </div>
        </Link>

        {/* Add Item Button */}
        <Link href="/add-item" className="w-full max-w-md">
          <div className="bg-primary/95 backdrop-blur-sm px-12 py-8 rounded-lg shadow-xl border border-primary/30 hover:scale-105 transition-transform cursor-pointer">
            <h2 className="font-serif text-4xl font-bold text-gray-800 italic text-center">Add item</h2>
          </div>
        </Link>

        {/* View Outfits Button */}
        <Link href="/outfits" className="w-full max-w-md">
          <div className="bg-primary/95 backdrop-blur-sm px-12 py-8 rounded-lg shadow-xl border border-primary/30 hover:scale-105 transition-transform cursor-pointer">
            <h2 className="font-serif text-4xl font-bold text-gray-800 italic text-center">View Outfits</h2>
          </div>
        </Link>
      </div>

      {/* Bottom Text */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-sm text-gray-600 font-light tracking-[0.3em] uppercase">Less guessing. More dressing.</p>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <AuthGuard>
      <HomePageContent />
    </AuthGuard>
  )
}
