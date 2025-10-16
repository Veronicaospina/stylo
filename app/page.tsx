import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
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

      {/* Content */}
      <div className="relative z-10 text-center space-y-8 px-4">
        <div className="bg-gradient-to-r from-gray-200/90 to-gray-300/90 backdrop-blur-sm px-12 py-8 rounded-lg shadow-2xl border border-gray-400/30">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-gray-800 italic tracking-wide">
            Stylo
          </h1>
        </div>

        <div className="bg-primary/95 backdrop-blur-sm px-8 py-4 rounded-lg shadow-xl inline-block">
          <Link href="/login">
            <Button
              size="lg"
              variant="ghost"
              className="text-2xl font-serif italic text-gray-800 hover:bg-transparent hover:scale-105 transition-transform"
            >
              Start
            </Button>
          </Link>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-sm text-gray-600 font-light tracking-[0.3em] uppercase">Less guessing. More dressing.</p>
      </div>
    </div>
  )
}
