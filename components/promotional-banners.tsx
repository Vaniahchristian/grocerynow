"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const promotions = [
  {
    id: 1,
    title: "Purely Fresh Vegetables",
    
    description: "Handpicked fresh ,organic and healthy vegetables delivered to your doorstep.",
    image: "/banner1.png",
    bgColor: "bg-gray-100",
    textColor: "text-gray-900"
  },
  {
    id: 2,
    title: "Fresh Fruits, Pure Organic",
    
    description: "Sweet, juicy fruits sourced directly from local farms. Perfect for healthy snacking and family meals.",
    image: "/banner2.png",
    bgColor: "bg-yellow-300",
    textColor: "text-gray-900"
  }
]

export function PromotionalBanners() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className={`relative rounded-2xl overflow-hidden ${promo.bgColor} p-6 min-h-[320px] flex items-center`}
            >
              <div className="flex-1 z-10">
              
                <h3 className={`text-2xl md:text-3xl font-bold mb-3 ${promo.textColor}`}>
                  {promo.title}
                </h3>
                <p className={`${promo.textColor} mb-6 opacity-90 text-sm`}>
                  {promo.description}
                </p>
                <Button
                  asChild
                  className="bg-green-600 text-white hover:bg-green-700 rounded-xl px-6 py-3 font-semibold transition-all duration-300 hover:scale-105"
                >
                  <Link href="/products" className="flex items-center gap-2">
                    Shop Now
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="w-1/2 ml-6 flex justify-center items-center">
                <Image
                  src={promo.image}
                  alt={promo.title}
                  width={300}
                  height={300}
                  className="object-cover rounded-lg w-full h-auto max-w-[300px]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}