import Link from "next/link"
import { categories } from "@/lib/category-data"
import { Card, CardContent } from "@/components/ui/card"

export function Categories() {
  return (
    <section className="py-4 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          {/* Browse Button */}
          <div className="mb-2">
            <span className="inline-block bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium">
              Browse
            </span>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold  text-gray-900 mb-4">Featured Categories</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our wide range of fresh products organized by category
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.slice(0, 12).map((category) => (
            <Link key={category.id} href={`/products?category=${category.name}`}>
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer rounded-2xl border border-gray-100 bg-white hover:border-emerald-200">
                <CardContent className="p-4 text-center">
                  <div className="aspect-square bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl mb-3 overflow-hidden group-hover:from-emerald-100 group-hover:to-green-100 transition-colors duration-300">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm group-hover:text-emerald-600 transition-colors duration-300">{category.name}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
