"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter } from './ui/card'
import {
  Tag,
  Percent,
  Gift,
  ShoppingCart,
  Sparkles,
  Clock,
  ArrowRight,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { cn } from '../lib/utils'
import { offersApi, type Offer } from '../lib/offersapi'
import { NoInternet } from '@/components/no-internet'
import { isOfflineError } from '@/lib/network'
export function OffersSection() {
  const themeColor = '#097969'
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [offline, setOffline] = useState(false)

  // Icon mapping for different discount types
  const getOfferIcon = (discount: string) => {
    if (discount.includes('FREE') || discount.includes('BUNDLE')) {
      return <Gift className="w-5 h-5" />
    }
    if (discount.includes('%')) {
      return <Percent className="w-5 h-5" />
    }
    return <Tag className="w-5 h-5" />
  }

  useEffect(() => {
    const loadOffers = async () => {
      try {
        setLoading(true)
        setError(null)
        setOffline(false)
        const offersData = await offersApi.getOffers()
        setOffers(offersData)
      } catch (err) {
        console.error('Error loading offers:', err)
        if (isOfflineError(err)) {
          setOffline(true)
          setError('No internet connection')
        } else {
          setError('Failed to load offers')
        }
      } finally {
        setLoading(false)
      }
    }

    loadOffers()
  }, [])
  return (
    <section className=" bg-white">
      <div className="container mx-auto px-4">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
        
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            
            <span className="text-slate-800">Special Offers & Discounts</span>
            
            
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Don't miss out on our amazing deals and discounts! Limited time
            offers on fresh, quality products.
          </p>
          {/* Urgency Indicator */}
          <div className="inline-flex items-center space-x-2 bg-red-50 text-red-600 px-4 py-2 rounded-2xl border border-red-200">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-semibold">
              Limited Time Offers - Don't Miss Out!
            </span>
          </div>
        </div>
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Offers...</h3>
              <p className="text-gray-600">Please wait while we fetch the latest deals</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center py-16">
            {offline ? (
              <NoInternet onRetry={() => window.location.reload()} />
            ) : (
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Oops! Something went wrong</h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-8 py-3 font-semibold"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}

        {/* Enhanced Offers Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {offers.map((offer, index) => (
            <Card
              key={offer.id}
              className="overflow-hidden bg-white rounded-3xl border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:scale-105"
            >
              {/* Image Container */}
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={offer.image || '/placeholder.svg'}
                  alt={offer.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                {/* Discount Badge */}
                <div
                  className={cn(
                    'absolute top-4 left-4 text-white px-4 py-2 rounded-2xl text-sm font-bold flex items-center space-x-2',
                    offer.badgeColor,
                  )}
                >
                  {getOfferIcon(offer.discount)}
                  <span>{offer.discount}</span>
                </div>
                {/* Trending Badge for first offer */}
                {index === 0 && (
                  <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-2xl text-xs font-bold">
                    🔥 TRENDING
                  </div>
                )}
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-800">
                    {offer.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {offer.description}
                  </p>
                </div>
                {/* Category Tag */}
                <div className="flex items-center space-x-2">
                  <div
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-semibold bg-gray-100',
                      offer.categoryColor,
                    )}
                  >
                    {offer.category}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <a
                  href={offer.link}
                  className={cn(
                    'flex items-center justify-center space-x-2 w-full text-white rounded-2xl font-semibold py-3 transition-all duration-300 hover:scale-105',
                    offer.buttonColor,
                  )}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </CardFooter>
            </Card>
            ))}
          </div>
        )}

        {/* No Offers State */}
        {!loading && !error && offers.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">No Active Offers</h3>
            <p className="text-gray-600 mb-6">
              We don't have any active offers at the moment. Check back soon for amazing deals!
            </p>
          </div>
        )}
        {/* Enhanced Bottom Section */}
        <div className="mt-16 bg-slate-50 rounded-3xl p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              Never Miss a Deal!
            </h3>
            <p className="text-gray-600 mb-6">
              Stay tuned for more exciting offers! Follow us on social media for
              instant updates and exclusive deals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-[#097969] hover:bg-opacity-90 text-white rounded-2xl px-8 py-3 flex items-center justify-center">
                <Sparkles className="w-4 h-4 mr-2" />
                Subscribe for Deals
              </button>
              <button className="border-2 border-gray-200 rounded-2xl px-8 py-3 hover:border-gray-300">
                View All Products
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
