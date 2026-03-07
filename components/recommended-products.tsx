"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from "lucide-react"

export function RecommendedProducts() {
  const products = [
    {
      name: "Organic Avocados",
      price: "UGX 18,000",
      image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500",
      tag: "Best Seller"
    },
    {
      name: "Fresh Strawberries",
      price: "UGX 15,000",
      image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500",
      tag: "Organic"
    },
    {
      name: "Green Spinach",
      price: "UGX 8,000",
      image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500",
      tag: "Fresh Pick"
    },
    {
      name: "Red Bell Peppers",
      price: "UGX 6,000",
      image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500",
      tag: "Local"
    }
  ]

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Recommended For You</h2>
          <Button variant="outline" className="rounded-full hover:bg-green-50 hover:text-green-600 transition-colors">View All Products</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <Card key={index} className="overflow-hidden group rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative rounded-t-2xl overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  crossOrigin="anonymous"
                />
                <Badge className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1">
                  {product.tag}
                </Badge>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">{product.name}</h3>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-green-600">{product.price}</span>
                </div>
                <Button className="w-full rounded-full hover:bg-green-600 transition-colors" size="sm">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
