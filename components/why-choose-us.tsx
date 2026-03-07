'use client'

import React, { useState, useEffect } from 'react'
import { Leaf, Truck, Award, CheckCircle } from 'lucide-react'
import { cn } from '../lib/utils'

type FeatureKey = 'organic' | 'delivery' | 'quality'
type Feature = {
  title: string
  description: string
  icon: JSX.Element
  accentColor: string
  stats: string
  image: string
}

export function WhyChooseUs() {
  const [selectedFeature, setSelectedFeature] = useState<FeatureKey>('organic')
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const featureKeys: FeatureKey[] = ['organic', 'delivery', 'quality']

  // Auto-rotate through features
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setSelectedFeature(current => {
        const currentIndex = featureKeys.indexOf(current)
        const nextIndex = (currentIndex + 1) % featureKeys.length
        return featureKeys[nextIndex]
      })
    }, 4000) // Change every 4 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const handleFeatureClick = (key: FeatureKey) => {
    setSelectedFeature(key)
    setIsAutoPlaying(false) // Stop auto-play when user interacts
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const features: Record<FeatureKey, Feature> = {
    organic: {
      title: '100% Organic Products',
      description:
        'All our products are certified organic, sourced from trusted farmers who follow sustainable farming practices. We ensure no harmful pesticides or chemicals are used in the growing process, giving you the purest, healthiest food for your family.',
      icon: <Leaf className="w-6 h-6" />,
      accentColor: 'text-emerald-700',
      stats: 'Several Certified Farms',
      image: '/fresh.png',
    },
    delivery: {
      title: 'Fast Delivery',
      description:
        'Get your groceries delivered right to your doorstep with our efficient express delivery service. We guarantee same-day delivery for orders placed before 2 PM, with real-time tracking and temperature-controlled transport.',
      icon: <Truck className="w-6 h-6" />,
      accentColor: 'text-blue-700',
      stats: 'Under 1 Hour',
      image: "/delivery2.png"
    },
    quality: {
      title: 'Premium Quality Guarantee',
      description:
        "Every product undergoes strict quality checks before reaching you. Our team of experts ensures freshness, taste, and nutritional value. If you're not 100% satisfied, we offer a complete money-back guarantee with no questions asked.",
      icon: <Award className="w-6 h-6" />,
      accentColor: 'text-gray-700',
      stats: '99.8% Satisfaction Rate',
      image: "/quality.png",
    },
  }

  return (
    <section className="relative bg-white overflow-hidden">
      {/* Background Pattern — only visible on medium screens and up */}
      <div className="absolute inset-0 bg-white overflow-hidden">
        {/* Subtle gradient only on medium+ */}
        <div className="absolute inset-0 md:bg-gradient-to-br md:from-gray-50 md:to-gray-100" />
        
        {/* Dotted pattern: hidden on mobile */}
        <div className="absolute inset-0 opacity-10 hidden md:block">
          <svg width="100%" height="100%">
            <pattern id="tech-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="2" fill="currentColor" className="text-emerald-400" />
              <circle cx="30" cy="10" r="1" fill="currentColor" className="text-emerald-400" />
              <circle cx="50" cy="10" r="2" fill="currentColor" className="text-emerald-400" />
              <circle cx="10" cy="30" r="1" fill="currentColor" className="text-emerald-400" />
              <circle cx="30" cy="30" r="2" fill="currentColor" className="text-emerald-400" />
              <circle cx="50" cy="30" r="1" fill="currentColor" className="text-emerald-400" />
              <circle cx="10" cy="50" r="2" fill="currentColor" className="text-emerald-400" />
              <circle cx="30" cy="50" r="1" fill="currentColor" className="text-emerald-400" />
              <circle cx="50" cy="50" r="2" fill="currentColor" className="text-emerald-400" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#tech-pattern)" />
          </svg>
        </div>

        {/* Bottom decorative gradient (optional on mobile) */}
        <div className="absolute bottom-0 right-0 w-full h-1/2 md:bg-gradient-to-t md:from-blue-100/20 to-transparent" />
      </div>
      
      <div className="relative container mx-auto px-4 max-w-5xl py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          {/* Experience Button */}
          <div className="mb-2">
            <span className="inline-block bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium">
              Experience
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Why Choose Grocery Now?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We're not just another grocery store. We're your partner in healthy
            living, committed to bringing you the freshest, highest-quality
            products with unmatched service.
          </p>
        </div>

        {/* Auto-rotating Feature Showcase */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border border-gray-200 shadow-lg">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side: Feature Content */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className={cn(
                  'w-16 h-16 rounded-2xl flex items-center justify-center bg-white shadow-md border border-gray-200 transition-all duration-500',
                  isAutoPlaying ? 'animate-pulse' : ''
                )}>
                  <div className={features[selectedFeature].accentColor}>
                    {features[selectedFeature].icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {features[selectedFeature].title}
                  </h3>
                  <p className={cn(
                    'text-lg font-semibold',
                    features[selectedFeature].accentColor
                  )}>
                    {features[selectedFeature].stats}
                  </p>
                </div>
              </div>
              
              <p className="text-gray-600 text-lg leading-relaxed">
                {features[selectedFeature].description}
              </p>

              {/* Feature Navigation Dots */}
              <div className="flex items-center gap-3 pt-4">
                {featureKeys.map((key) => (
                  <button
                    key={key}
                    onClick={() => handleFeatureClick(key)}
                    className={cn(
                      'relative w-12 h-3 rounded-full transition-all duration-300 focus:outline-none',
                      selectedFeature === key
                        ? 'bg-emerald-600'
                        : 'bg-gray-300 hover:bg-gray-400'
                    )}
                  >
                    {selectedFeature === key && isAutoPlaying && (
                      <div className="absolute inset-0 bg-emerald-400 rounded-full animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Side: Feature Image */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
                  <img
                    src={features[selectedFeature].image}
                    alt={features[selectedFeature].title}
                    className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}