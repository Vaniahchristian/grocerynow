"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/lib/cart-context"
import { WishlistHeart } from "@/components/wishlist-heart"
import type { Product } from "@/lib/types"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { getImageUrl } from "@/lib/image-utils"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

interface ProductCardProps {
  product: Product
  size?: "sm" | "md"
}

export function ProductCard({ product, size = "md" }: ProductCardProps) {
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const isSmall = size === "sm"

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }
    await addToCart(product,1)
    // Enhanced notification with modern styling
    const notification = document.createElement("div")
    notification.className = "fixed top-4 right-4 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-semibold z-50 animate-slide-in-right"
    notification.innerHTML = `
      <div class="flex items-center space-x-2">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"/>
        </svg>
        <span>${product.name} added to cart!</span>
      </div>
    `
    document.body.appendChild(notification)

    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 3000)
  }

  return (
    <div 
      className="group cursor-pointer"
      onClick={() => router.push(`/products/${product.id}`)}
    >
      <Card className="bg-white rounded-lg border border-gray-100 transition-all duration-300 hover:shadow-lg w-full max-w-[250px] overflow-hidden">
        <CardContent className="p-0">
          {/* Enhanced Image Container */}
          <div className={cn("relative w-full overflow-hidden h-40 rounded-t-lg")}>
            <Image
              src={getImageUrl(product.image)}
              alt={product.name}
              fill
              className="object-contain group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              quality={80}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQABAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
            
            {/* Wishlist Button */}
            <div className="absolute top-3 right-3">
              <WishlistHeart productId={Number(product.id)} size="sm" className="bg-white/90 backdrop-blur-sm shadow-sm" />
            </div>
            
            {/* Quick Add Button (appears permanently) */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              disabled={!product.inStock}
              className={cn(
                "absolute bottom-3 right-3 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg",
                isSmall ? "w-9 h-9" : "w-10 h-10",
                product.inStock 
                  ? "bg-green-600 hover:bg-green-700 text-white" 
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              )}
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Product Content */}
         
        </CardContent>
      
        
      </Card>

      <div className={cn("w-full max-w-[250px]", isSmall ? "p-2" : "p-3")}> 
          <div className="space-y-1">
            {/* No sale badge */}

            {/* Product Name */}
            <h3 className={cn("font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-green-600 transition-colors duration-300", isSmall ? "text-sm" : "text-base")}>
              {product.name}
            </h3>
            
            {/* Price Section */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span className={cn(isSmall ? "text-sm" : "text-base", "font-bold text-gray-900")}>
                    UGX {(product.price || 0).toLocaleString()}
                  </span>
                 
                  
                </div>
                <span className="text-xs text-gray-500">
                  per {product.unit}
                </span>
              </div>
              
              {/* Stock Indicator */}
              <div className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                product.inStock 
                  ? "bg-green-100 text-green-700" 
                  : "bg-red-100 text-red-700"
              )}>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </div>
            </div>
            
            
            
          </div>
        </div>
    </div>
  )
}