import { tokenUtils } from './auth'
import type { Product } from './types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api'

export interface WishlistItem extends Product {
  wishlist_id: number
  added_at: string
}

// Wishlist API functions
export const wishlistAPI = {
  // Get user's wishlist
  getWishlist: async (): Promise<WishlistItem[]> => {
    const token = tokenUtils.getToken()
    if (!token) {
      throw new Error('Authentication required')
    }

    const response = await fetch(`${API_BASE}/wishlist`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch wishlist')
    }

    return response.json()
  },

  // Add product to wishlist
  addToWishlist: async (productId: number): Promise<{ message: string }> => {
    const token = tokenUtils.getToken()
    if (!token) {
      throw new Error('Authentication required')
    }

    const response = await fetch(`${API_BASE}/wishlist/${productId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to add to wishlist')
    }

    return response.json()
  },

  // Remove product from wishlist
  removeFromWishlist: async (productId: number): Promise<{ message: string }> => {
    const token = tokenUtils.getToken()
    if (!token) {
      throw new Error('Authentication required')
    }

    const response = await fetch(`${API_BASE}/wishlist/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to remove from wishlist')
    }

    return response.json()
  },

  // Check if product is in wishlist
  checkWishlistStatus: async (productId: number): Promise<{ inWishlist: boolean }> => {
    const token = tokenUtils.getToken()
    if (!token) {
      return { inWishlist: false }
    }

    try {
      const response = await fetch(`${API_BASE}/wishlist/check/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        return { inWishlist: false }
      }

      return response.json()
    } catch {
      return { inWishlist: false }
    }
  },

  // Clear entire wishlist
  clearWishlist: async (): Promise<{ message: string }> => {
    const token = tokenUtils.getToken()
    if (!token) {
      throw new Error('Authentication required')
    }

    const response = await fetch(`${API_BASE}/wishlist`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to clear wishlist')
    }

    return response.json()
  }
}

// Wishlist utilities
export const wishlistUtils = {
  // Toggle wishlist status for a product
  toggleWishlist: async (productId: number, currentStatus: boolean): Promise<boolean> => {
    try {
      if (currentStatus) {
        await wishlistAPI.removeFromWishlist(productId)
        return false
      } else {
        await wishlistAPI.addToWishlist(productId)
        return true
      }
    } catch (error) {
      console.error('Wishlist toggle error:', error)
      throw error
    }
  }
}
