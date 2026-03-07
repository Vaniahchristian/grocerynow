"use client"

import { Button } from "@/components/ui/button"
import { Calendar, Leaf } from "lucide-react"

export function SeasonalPicks() {
  return (
    <section className="py-12 bg-gradient-to-br from-green-50 to-green-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full bg-green-100 px-4 py-1 text-green-700">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Seasonal Favorites</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900">Fresh Summer Picks</h2>
            <p className="text-lg text-gray-600">
              Discover our handpicked selection of summer fruits and vegetables. Fresh from local farms
              to your table.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 rounded-full transition-colors"
              >
                Shop Summer Collection
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="rounded-full hover:bg-green-50 hover:text-green-600 transition-colors border-2 border-gray-200 hover:border-green-600"
              >
                View Recipes
              </Button>
            </div>
            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-600" />
                <span className="text-gray-600">100% Organic</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                <span className="text-gray-600">Seasonal Fresh</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500"
              alt="Summer fruits"
              className="rounded-2xl w-full h-64 object-cover shadow-lg"
              crossOrigin="anonymous"
            />
            <img
              src="https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=500"
              alt="Fresh vegetables"
              className="rounded-2xl w-full h-64 object-cover mt-8 shadow-lg"
              crossOrigin="anonymous"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
