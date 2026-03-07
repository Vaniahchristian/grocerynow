import { Header } from "@/components/header"
import { CartPage } from "@/components/cart-page"
import { Footer } from "@/components/footer"

export default function Cart() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <CartPage />
      </main>
      <Footer />
    </div>
  )
}
