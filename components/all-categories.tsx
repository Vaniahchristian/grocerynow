import Link from "next/link"
import { categories } from "@/lib/category-data"
import { Card, CardContent } from "@/components/ui/card"

export function AllCategories() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {categories.map((category) => (
        <Link key={category.id} href={`/products?category=${encodeURIComponent(category.name)}`}>
          <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer rounded-xl">
            <CardContent className="p-6 text-center">
              <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
              {/* <p className="text-sm text-gray-600">{category.productCount} items</p> */}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
