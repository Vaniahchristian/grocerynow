import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { OffersSection } from "@/components/offers-section"

export default function OffersPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <OffersSection />
      </main>
      <Footer />
    </div>
  )
}
