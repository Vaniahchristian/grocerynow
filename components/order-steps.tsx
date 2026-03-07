
"use client"



import React from 'react'
import { ShoppingCart, Search, CreditCard, Truck } from 'lucide-react'
export function OrderSteps() {
  const steps = [
    {
      icon: Search,
      title: 'Browse & Select',
      description:
        'Browse our wide selection of fresh groceries and add items to your cart',
    },
    {
      icon: ShoppingCart,
      title: 'Review Cart',
      description: 'Review your selections and adjust quantities as needed',
    },
    {
      icon: CreditCard,
      title: 'Checkout',
      description: 'Securely pay with your preferred payment method',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Get your groceries delivered right to your doorstep',
    },
  ]
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            How to Order
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Getting your groceries delivered is easy! Follow these simple steps
            to place your order and get fresh products delivered to your door.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center p-8 pt-12 bg-white rounded-lg border border-gray-200 shadow-sm"
            >
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div
                  className="hidden md:block absolute top-1/2 right-0 w-8 h-0.5 bg-gray-200 -z-10"
                  style={{
                    transform: 'translateY(-50%)',
                    width: 'calc(100% - 4rem)',
                  }}
                />
              )}
              {/* Step number */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center font-bold text-gray-700">
                {index + 1}
              </div>
              {/* Icon */}
              <div className="w-14 h-14 mb-6 rounded-full flex items-center justify-center bg-gray-100">
                <step.icon className="w-7 h-7 text-gray-700" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">
                {step.title}
              </h3>
              <p className="text-gray-600 text-center text-base leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-base text-gray-600">
            Need help with your order?{' '}
            <span className="text-gray-900 font-semibold">
              Our customer support team is available 24/7
            </span>{' '}
            to assist you.
          </p>
        </div>
      </div>
    </section>
  )
}
