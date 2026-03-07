export interface Offer {
  id: string
  title: string
  description: string
  image: string
  discount: string
  category: string
  link: string
  isActive?: boolean
  // UI-specific properties (not stored in backend)
  icon?: React.ReactNode
  badgeColor?: string
  categoryColor?: string
  buttonColor?: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

// Default styling configurations for different categories
const categoryStyles = {
  'Fruits': {
    badgeColor: 'bg-orange-500',
    categoryColor: 'text-orange-600',
    buttonColor: 'bg-orange-600 hover:bg-orange-700'
  },
  'Diary&Poultry': {
    badgeColor: 'bg-blue-500',
    categoryColor: 'text-blue-600',
    buttonColor: 'bg-blue-600 hover:bg-blue-700'
  },
  'Spices': {
    badgeColor: 'bg-purple-500',
    categoryColor: 'text-purple-600',
    buttonColor: 'bg-purple-600 hover:bg-purple-700'
  },
  'Meat&Seafood': {
    badgeColor: 'bg-red-500',
    categoryColor: 'text-red-600',
    buttonColor: 'bg-red-600 hover:bg-red-700'
  },
  'Herbs': {
    badgeColor: 'bg-green-500',
    categoryColor: 'text-green-600',
    buttonColor: 'bg-green-600 hover:bg-green-700'
  },
  'Greens&Vegetables': {
    badgeColor: 'bg-yellow-500',
    categoryColor: 'text-yellow-600',
    buttonColor: 'bg-yellow-600 hover:bg-yellow-700'
  }
}

// API utility functions
export const offersApi = {
  // Get active offers only
  async getOffers(): Promise<Offer[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/offers`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      
      // Transform backend data to match frontend Offer type
      return data.map((offer: any) => {
          const styles = categoryStyles[offer.category as keyof typeof categoryStyles] || categoryStyles['Fruits']
          
          return {
            id: offer.id.toString(),
            title: offer.title || 'Special Offer',
            description: offer.description || 'Limited time offer',
            image: offer.image || '/placeholder-offer.jpg',
            discount: offer.discount || '10% OFF',
            category: offer.category || 'General',
            link: offer.link || '#',
            isActive: offer.isActive !== false,
            ...styles
          }
        })
    } catch (error) {
      console.error('Error fetching offers:', error)
      throw error
    }
  },

  // Get all offers (including inactive ones) - for admin use
  async getAllOffers(): Promise<Offer[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/offers?all=true`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      
      return data.map((offer: any) => {
        const styles = categoryStyles[offer.category as keyof typeof categoryStyles] || categoryStyles['Fruits']
        
        return {
          id: offer.id.toString(),
          title: offer.title || 'Special Offer',
          description: offer.description || 'Limited time offer',
          image: offer.image || '/placeholder-offer.jpg',
          discount: offer.discount || '10% OFF',
          category: offer.category || 'General',
          link: offer.link || '#',
          isActive: Boolean(offer.isActive),
          ...styles
        }
      })
    } catch (error) {
      console.error('Error fetching all offers:', error)
      throw error
    }
  },

  // Add new offer
  async addOffer(offerData: Omit<Offer, 'id'>): Promise<Offer> {
    try {
      const response = await fetch(`${API_BASE_URL}/offers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: offerData.title,
          description: offerData.description,
          image: offerData.image,
          discount: offerData.discount,
          category: offerData.category,
          link: offerData.link,
          isActive: offerData.isActive !== false
        })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      const styles = categoryStyles[data.category as keyof typeof categoryStyles] || categoryStyles['Fruits']
      
      return {
        id: data.id.toString(),
        title: data.title,
        description: data.description,
        image: data.image,
        discount: data.discount,
        category: data.category,
        link: data.link,
        isActive: data.isActive,
        ...styles
      }
    } catch (error) {
      console.error('Error adding offer:', error)
      throw error
    }
  },

  // Update offer
  async updateOffer(id: string, updates: Partial<Omit<Offer, 'id'>>): Promise<Offer> {
    try {
      const response = await fetch(`${API_BASE_URL}/offers/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...(updates.title && { title: updates.title }),
          ...(updates.description && { description: updates.description }),
          ...(updates.image && { image: updates.image }),
          ...(updates.discount && { discount: updates.discount }),
          ...(updates.category && { category: updates.category }),
          ...(updates.link && { link: updates.link }),
          ...(updates.isActive !== undefined && { isActive: updates.isActive })
        })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      const styles = categoryStyles[data.category as keyof typeof categoryStyles] || categoryStyles['Fruits']
      
      return {
        id: data.id.toString(),
        title: data.title,
        description: data.description,
        image: data.image,
        discount: data.discount,
        category: data.category,
        link: data.link,
        isActive: data.isActive,
        ...styles
      }
    } catch (error) {
      console.error('Error updating offer:', error)
      throw error
    }
  },

  // Delete offer
  async deleteOffer(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/offers/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error('Error deleting offer:', error)
      throw error
    }
  },

  // Toggle offer active status
  async toggleOfferStatus(id: string, isActive: boolean): Promise<Offer> {
    try {
      const response = await fetch(`${API_BASE_URL}/offers/${id}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const styles = categoryStyles[data.category as keyof typeof categoryStyles] || categoryStyles['Fruits']

      return {
        ...data,
        id: data.id.toString(),
        ...styles
      }
    } catch (error) {
      console.error('Error toggling offer status:', error)
      throw error
    }
  }
}
