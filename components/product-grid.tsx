import type { Product } from "@/lib/types"
import { ProductCard } from "@/components/product-card"
import { cn } from "@/lib/utils"

interface ProductGridProps {
  products: Product[]
  limit?: number
  size?: "sm" | "md"
  className?: string
}

export function ProductGrid({ products, limit, size, className }: ProductGridProps) {
  const items = typeof limit === "number" ? products.slice(0, limit) : products
  return (
    <div className={cn(
      "grid",
      className ?? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    )}>
      {items.map((product) => (
        <ProductCard key={product.id} product={product} size={size} />
      ))}
    </div>
  )
}
