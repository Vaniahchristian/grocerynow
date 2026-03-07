"use client";

import Link from "next/link";
import { ShoppingBag, Truck, Shield, Clock, Star, MapPin } from "lucide-react";

export function SEOContentSection() {
  return (
    <section className="container mx-auto px-4 py-16">
      {/* Main SEO Content */}
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Grocery Uganda - Your Trusted Online Grocery Store in Kampala
          </h1>
          
          <p className="text-xl text-gray-700 leading-relaxed mb-6">
            Welcome to <strong>Grocery Now</strong>, Uganda's premier online grocery store. We deliver fresh groceries, 
            fruits, vegetables, meat, dairy products, and pantry staples directly to your doorstep in Kampala. 
            When you search for <strong>"grocery Uganda"</strong> or <strong>"grocery"</strong>, you'll find the best 
            online grocery shopping experience right here.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4">
            Why Shop for Groceries Online in Uganda?
          </h2>
          
          <p className="text-lg text-gray-700 mb-4">
            Shopping for groceries online in Uganda has never been easier. At Grocery Now, we understand the needs 
            of Ugandan families and provide a comprehensive selection of fresh, quality products at competitive prices. 
            Whether you're looking for fresh produce, dairy products, meat, or pantry essentials, we have everything 
            you need for your weekly grocery shopping.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4">
            Fresh Groceries Delivered to Kampala
          </h2>
          
          <p className="text-lg text-gray-700 mb-4">
            Based in Nakasero, Kampala, we serve customers throughout the capital city with fast, reliable grocery 
            delivery. Our commitment to freshness means we source products directly from local farmers and trusted 
            suppliers, ensuring you receive the highest quality groceries every time you order.
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="bg-emerald-50 p-6 rounded-xl">
              <ShoppingBag className="w-8 h-8 text-emerald-600 mb-3" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Wide Product Selection</h3>
              <p className="text-gray-700">
                From fresh fruits and vegetables to dairy products, meat, and pantry staples, we offer a complete 
                range of grocery items for your household needs.
              </p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-xl">
              <Truck className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-700">
                Enjoy same-day delivery in Kampala. We understand that fresh groceries need to arrive quickly, 
                and we make it our priority to deliver your order promptly.
              </p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-xl">
              <Shield className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Quality Guaranteed</h3>
              <p className="text-gray-700">
                All our products are carefully selected and quality-checked. We work directly with trusted suppliers 
                to ensure you receive only the freshest groceries.
              </p>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-xl">
              <Clock className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Convenient Shopping</h3>
              <p className="text-gray-700">
                Shop for groceries online anytime, anywhere. Our user-friendly website makes it easy to browse 
                products, compare prices, and place orders in minutes.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4">
            Shop Groceries Online in Uganda - Categories
          </h2>
          
          <p className="text-lg text-gray-700 mb-4">
            Browse our extensive range of grocery categories:
          </p>
          
          <ul className="list-disc list-inside space-y-2 text-lg text-gray-700 mb-6">
            <li><strong>Fruits:</strong> Farm-fresh fruits sourced from local Ugandan farmers</li>
            <li><strong>Greens&Vegetables:</strong> Leafy greens and a wide variety of vegetables</li>
            <li><strong>Spices:</strong> Aromatic spices and seasonings for authentic flavors</li>
            <li><strong>Herbs:</strong> Fresh cooking herbs picked for maximum freshness</li>
            <li><strong>Diary&Poultry:</strong> Dairy products and quality poultry items</li>
            <li><strong>Meat&Seafood:</strong> Premium meats and fresh seafood</li>
          </ul>

          <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-8 rounded-2xl my-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              How to Order Groceries Online in Uganda
            </h2>
            <ol className="list-decimal list-inside space-y-3 text-lg text-gray-700">
              <li>Browse our <Link href="/products" className="text-emerald-600 hover:underline font-semibold">online grocery store</Link> and select your products</li>
              <li>Add items to your cart and review your order</li>
              <li>Choose your preferred payment method (Mobile Money, Cash on Delivery)</li>
              <li>Enter your delivery address in Kampala</li>
              <li>Confirm your order and wait for fast delivery to your doorstep</li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

