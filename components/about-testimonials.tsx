'use client'

import React from 'react'
import { Star, Users, Award, Clock, Heart, Quote } from 'lucide-react'
export function AboutTestimonials() {
  const testimonials = [
    {
      name: 'Mukasa Mbidde',
      role: 'Regular Customer',
      image:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      quote:
        'Grocery Now has transformed how I shop for fresh produce. Their delivery is always on time and the quality is exceptional!',
      rating: 5,
    },
    {
      name: 'Kity Eric',
      role: 'Food Enthusiast',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      quote:
        'The organic selection is amazing, and their seasonal picks are always top-notch. Best grocery service in the area!',
      rating: 5,
    },
    {
      name: 'Ahikiriza Hannah',
      role: 'Home Chef',
      image:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      quote:
        'As a chef, quality is everything. Grocery Now consistently delivers the freshest ingredients right to my door.',
      rating: 5,
    },
  ]
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* About Us Section */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#097969] rounded-full mb-6">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gray-800">About</span>{' '}
            <span className="text-[#097969]">Grocery Now</span>
          </h2>
          <p className="text-lg text-gray-600 mb-12 leading-relaxed">
            Since 2020, Grocery Now has been your trusted partner in bringing
            fresh, high-quality groceries directly to your doorstep. We work
            closely with local farmers and suppliers to ensure you get the best
            products at the best prices.
          </p>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 border border-gray-200 shadow-sm">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-[#097969]/10 rounded-full mb-4">
                <Users className="w-5 h-5 text-[#097969]" />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2">5000+</div>
              <div className="text-gray-700 font-medium">Happy Customers</div>
              <p className="text-sm text-gray-500 mt-2">Growing every day</p>
            </div>
            <div className="bg-white rounded-lg p-8 border border-gray-200 shadow-sm">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-[#097969]/10 rounded-full mb-4">
                <Award className="w-5 h-5 text-[#097969]" />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2">98%</div>
              <div className="text-gray-700 font-medium">Satisfaction Rate</div>
              <p className="text-sm text-gray-500 mt-2">Quality guaranteed</p>
            </div>
            <div className="bg-white rounded-lg p-8 border border-gray-200 shadow-sm">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-[#097969]/10 rounded-full mb-4">
                <Clock className="w-5 h-5 text-[#097969]" />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2">24/7</div>
              <div className="text-gray-700 font-medium">Customer Support</div>
              <p className="text-sm text-gray-500 mt-2">Always here to help</p>
            </div>
          </div>
        </div>
        {/* Testimonials Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-[#097969]/10 rounded-full mb-4">
            <Star className="w-5 h-5 text-[#097969]" />
          </div>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            What Our <span className="text-[#097969]">Customers</span> Say
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers
            who love our service
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#097969]/30"
            >
              {/* Customer Info */}
              <div className="flex items-center mb-6">
                <div className="relative">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-[#097969]/20"
                    crossOrigin="anonymous"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#097969] flex items-center justify-center">
                    <Star className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-800 text-lg">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              
              {/* Quote */}
              <div className="relative">
                <Quote className="w-6 h-6 absolute -top-1 -left-1 text-[#097969]/20" />
                <p className="text-gray-700 leading-relaxed pl-4 relative z-10">
                  "{testimonial.quote}"
                </p>
              </div>
              {/* Verified Badge */}
              <div className="mt-6 flex items-center">
                <div className="px-3 py-1 rounded-full bg-[#097969]/10 text-[#097969] text-xs font-medium">
                  ✓ Verified Customer
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Call to Action */}
        <div className="mt-16 text-center bg-white rounded-lg p-8 border border-gray-200 shadow-sm">
          <h4 className="text-2xl font-bold text-gray-800 mb-4">
            Join Our <span className="text-[#097969]">Happy Customers!</span>
          </h4>
          <p className="text-gray-600 mb-6">
            Experience the freshest groceries delivered right to your door
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-[#097969] hover:bg-[#097969]/90 text-white px-8 py-3 rounded-md font-medium transition-colors duration-300">
              Start Shopping Now
            </button>
            <button className="border border-gray-300 hover:border-[#097969] text-gray-700 hover:text-[#097969] px-8 py-3 rounded-md font-medium transition-colors duration-300">
              Learn More About Us
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
