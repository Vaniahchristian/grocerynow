"use client"

import { useState, useEffect } from 'react'
import { Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { wishlistAPI, wishlistUtils } from '@/lib/wishlist'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { isOfflineError } from '@/lib/network'

interface WishlistHeartProps {
  productId: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showLoginPrompt?: boolean
}

export function WishlistHeart({ 
  productId, 
  className, 
  size = 'md',
  showLoginPrompt = true 
}: WishlistHeartProps) {
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  // Size variants
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }

  const buttonSizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  }

  // Check wishlist status on mount and when authentication changes
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!isAuthenticated) {
        setIsInWishlist(false)
        setIsChecking(false)
        return
      }

      try {
        setIsChecking(true)
        const { inWishlist } = await wishlistAPI.checkWishlistStatus(productId)
        setIsInWishlist(inWishlist)
      } catch (error) {
        console.error('Failed to check wishlist status:', error)
      } finally {
        setIsChecking(false)
      }
    }

    checkWishlistStatus()
  }, [productId, isAuthenticated])

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      if (showLoginPrompt) {
        toast({
          title: "Login Required",
          description: "Please log in to add items to your wishlist.",
          action: (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.href = '/auth/login'}
            >
              Login
            </Button>
          ),
        })
      }
      return
    }

    if (isLoading) return

    try {
      setIsLoading(true)
      const newStatus = await wishlistUtils.toggleWishlist(productId, isInWishlist)
      setIsInWishlist(newStatus)

      toast({
        title: newStatus ? "Added to Wishlist" : "Removed from Wishlist",
        description: newStatus 
          ? "Product has been added to your wishlist." 
          : "Product has been removed from your wishlist.",
      })
    } catch (error: any) {
      console.error('Wishlist toggle error:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to update wishlist. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "rounded-full p-0 hover:bg-red-50 transition-colors",
        buttonSizeClasses[size],
        className
      )}
      onClick={handleToggleWishlist}
      disabled={isLoading || isChecking}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Bookmark
        className={cn(
          "transition-all duration-200",
          sizeClasses[size],
          isInWishlist 
            ? "fill-red-500 text-red-500" 
            : "text-gray-400 hover:text-red-500",
          isLoading && "animate-pulse"
        )}
      />
    </Button>
  )
}

// Hook for wishlist functionality
export function useWishlist() {
  const { isAuthenticated } = useAuth()
  const [wishlistItems, setWishlistItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [offline, setOffline] = useState(false)

  const fetchWishlist = async () => {
    if (!isAuthenticated) {
      setWishlistItems([])
      setError(null)
      setOffline(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      setOffline(false)
      const items = await wishlistAPI.getWishlist()
      setWishlistItems(items)
    } catch (error) {
      console.error('Failed to fetch wishlist:', error)
      if (isOfflineError(error)) {
        setOffline(true)
        setError('No internet connection')
      } else {
        setError('Failed to fetch wishlist')
      }
      setWishlistItems([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchWishlist()
  }, [isAuthenticated])

  return {
    wishlistItems,
    isLoading,
    refetch: fetchWishlist,
    clearWishlist: async () => {
      try {
        await wishlistAPI.clearWishlist()
        setWishlistItems([])
      } catch (error) {
        throw error
      }
    },
    error,
    offline
  }
}
