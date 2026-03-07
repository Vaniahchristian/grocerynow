"use client"
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useWishlist } from '@/components/wishlist-heart'
import { Button } from '@/components/ui/button'
import { Bookmark, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import { FadeIn } from '@/components/fade-in'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { NoInternet } from '@/components/no-internet'
import { ProductCard } from '@/components/product-card'
import type { Product } from '@/lib/types'

export default function WishlistPage() {
  const { isAuthenticated, user } = useAuth()
  const { wishlistItems, isLoading, refetch, clearWishlist, error, offline } = useWishlist()
  const { toast } = useToast()

  const handleClearWishlist = async () => {
    if (wishlistItems.length === 0) return

    try {
      await clearWishlist()
      toast({
        title: "Wishlist Cleared",
        description: "All items have been removed from your wishlist.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to clear wishlist.",
        variant: "destructive",
      })
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center bg-white border border-gray-200 rounded-2xl p-8">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <Bookmark className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Wishlist</h1>
            <p className="text-gray-600 mb-6">
              Sign in to view and manage your favorite products.
            </p>
            <div className="space-y-3">
              <Button asChild className="w-full rounded-2xl">
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button variant="outline" asChild className="w-full rounded-2xl">
                <Link href="/auth/register">Create Account</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded-2xl w-48 mx-auto mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-2xl h-64 border border-gray-200"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[300px]">
            {offline ? (
              <NoInternet onRetry={refetch} />
            ) : (
              <div className="text-center text-red-600">{error}</div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600 mt-1">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
          
          {wishlistItems.length > 0 && (
            <Button
              variant="outline"
              onClick={handleClearWishlist}
              className="rounded-2xl text-red-600 hover:text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl max-w-3xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-4">
              <Bookmark className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">
              Browse our products and click the bookmark icon to save your favorites.
            </p>
            <Button asChild className="rounded-2xl">
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <FadeIn>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {wishlistItems.map((item) => {
                // Transform wishlist item to Product type
                const product: Product = {
                  id: item.id.toString(),
                  name: item.name,
                  price: Number(item.price),
                  oldPrice: item.old_price ? Number(item.old_price) : undefined,
                  image: item.image,
                  category: item.category || 'Uncategorized',
                  description: item.description || '',
                  unit: item.unit || 'piece',
                  inStock: item.inStock,
                  rating: item.rating || 4.5
                }
                
                return (
                  <ProductCard key={item.id} product={product} size="md" />
                )
              })}
            </div>
          </FadeIn>
        )}
      </main>
      <Footer />
    </div>
  )
}
