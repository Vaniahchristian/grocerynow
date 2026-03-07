"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CheckoutForm } from "@/components/checkout-form"
import { ShoppingBag } from "lucide-react"

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Checkout</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Complete your order and get fresh groceries delivered to your door
            </p>
          </div>

          {/* Checkout Form */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
            <CheckoutForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
