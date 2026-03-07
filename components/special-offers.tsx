"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Timer, Percent } from "lucide-react"

export function SpecialOffers() {
  const offers = [
    {
      title: "Summer Sale",
      discount: "30% OFF",
      description: "On all fresh fruits",
      image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500",
      endDate: "Limited time offer"
    },
    {
      title: "Bundle & Save",
      discount: "Buy 2 Get 1",
      description: "On selected vegetables",
      image: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=500",
      endDate: "Ends in 2 days"
    },
    {
      title: "Flash Deal",
      discount: "50% OFF",
      description: "On organic products",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500",
      endDate: "Today only"
    }
  ]

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Special Offers</h2>
          <Badge variant="secondary" className="text-lg px-4 py-1">
            <Timer className="w-4 h-4 mr-2" />
            Limited Time Deals
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map((offer, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-48 object-cover"
                  crossOrigin="anonymous"
                />
                <div className="absolute top-4 right-4">
                  <Badge variant="destructive" className="text-lg">
                    <Percent className="w-4 h-4 mr-1" />
                    {offer.discount}
                  </Badge>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{offer.title}</h3>
                <p className="text-gray-600 mb-4">{offer.description}</p>
                <p className="text-sm text-gray-500 flex items-center">
                  <Timer className="w-4 h-4 mr-1" />
                  {offer.endDate}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
