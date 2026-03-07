import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Truck, Shield, Clock, Star, ArrowRight, Leaf, Heart, Award } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative overflow-hidden">

      {/* Main Footer */}
      <div className="bg-slate-900 text-white pt-16 pb-8">
        
        
        <div className="container mx-auto px-4">

         
          

          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-[60px] h-[60px] bg-green-600 rounded-xl relative z-10 flex items-center justify-center">
                  <Image src="/logo1.png" alt="GN" width={60} height={60} className="rounded-xl" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-green-400">
                    Grocery Now
                  </span>
                  <p className="text-sm text-gray-400">Delivered On Time</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Your trusted partner for fresh, quality groceries delivered right to your doorstep.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-300 hover:text-emerald-400 transition-colors duration-300">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span>grocerynow@gmail.com</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300 hover:text-emerald-400 transition-colors duration-300">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span>+256 207808052</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300 hover:text-emerald-400 transition-colors duration-300">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span>Nakasero, Kampala</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-bold mb-6 text-lg flex items-center">
                <span className="w-2 h-6 bg-emerald-500 rounded-full mr-3" />
                Shop
              </h3>
              <ul className="space-y-3">
                <li><Link href="/products" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300 flex items-center group"><ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />All Products</Link></li>
                <li><Link href="/products?sort=discount" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300 flex items-center group"><ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />Special Offers</Link></li>
                <li><Link href="/products/new" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300 flex items-center group"><ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />New Arrivals</Link></li>
                {/* <li><Link href="/products/best-sales" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300 flex items-center group"><ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />Best Sellers</Link></li> */}
                <li><Link href="/contact" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300 flex items-center group"><ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />Contact Us</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-white font-bold mb-6 text-lg flex items-center">
                <span className="w-2 h-6 bg-blue-600 rounded-full mr-3" />
                Company
              </h3>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center group"><ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />About Us</Link></li>
                <li><Link href="/delivery" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center group"><ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />Delivery Info</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center group"><ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />Return & Refund Policy</Link></li>
                <li><Link href="/referral" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center group"><ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />Refer a Friend</Link></li>
                
                <li><Link href="/secure-payment" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center group"><ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />Payment Methods</Link></li>
              </ul>
            </div>

            {/* Mobile App */}
            {/* <div>
              <h3 className="text-white font-bold mb-6 text-lg flex items-center">
                <span className="w-2 h-6 bg-orange-500 rounded-full mr-3" />
                Get Our App
                <span className="ml-3 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                  Coming Soon
                </span>
              </h3>
              
              
                <div className="space-y-3">
                  <div className="bg-gray-800 p-4 rounded-xl border-2 border-dashed border-gray-700">
                    <div className="text-center">
                      <div className="text-2xl mb-2">📱</div>
                      <p className="text-gray-300 font-medium mb-1">Mobile App</p>
                      <p className="text-sm text-gray-400">We're working hard to bring you the best mobile experience!</p>
                      <div className="mt-3 flex justify-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <div className="w-2 h-2 bg-purple-500 rounded-full" />
                        <div className="w-2 h-2 bg-pink-500 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              
            </div> */}
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-700/50 pt-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              {/* Copyright */}
              <div className="text-center lg:text-left">
                <p className="text-gray-400">
                  &copy; 2025 <span className="text-emerald-400 font-semibold">Grocery Now</span>. All rights reserved.
                </p>
                {/* <p className="text-gray-500 text-sm mt-1">Made with <Heart className="w-4 h-4 text-red-500 inline mx-1" /> in Kampala, Uganda</p> */}
              </div>

              {/* Social Media */}
              <div className="flex items-center space-x-4">
                <span className="text-gray-400 text-sm mr-2">Follow us:</span>
                <a href="https://www.facebook.com/share/17EAeaQjA6/" className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors duration-300" aria-label="Facebook">
                  <Facebook className="w-5 h-5 text-white" />
                </a>
                <a href="https://x.com/BrwxrTy?t=FaAB0M7cYPp6O1mzzFMRTw&s=08" className="w-12 h-12 bg-sky-500 hover:bg-sky-600 rounded-full flex items-center justify-center transition-colors duration-300" aria-label="Twitter">
                  <Twitter className="w-5 h-5 text-white" />
                </a>
                <a href="https://www.instagram.com/grocerynow25?utm_source=qr&igsh=MTI0OWM3MHZzcnRzZg==" className="w-12 h-12 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center transition-colors duration-300" aria-label="Instagram">
                  <Instagram className="w-5 h-5 text-white" />
                </a>
                <a href="https://youtube.com/@grocerynow256?si=LGHWi_J6zeQ1ileD" className="w-12 h-12 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors duration-300" aria-label="YouTube">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a2.956 2.956 0 0 0-2.08-2.08C19.39 3.5 12 3.5 12 3.5s-7.39 0-9.418.606a2.956 2.956 0 0 0-2.08 2.08C0 8.214 0 12 0 12s0 3.786.502 5.814a2.956 2.956 0 0 0 2.08 2.08C4.61 20.5 12 20.5 12 20.5s7.39 0 9.418-.606a2.956 2.956 0 0 0 2.08-2.08C24 15.786 24 12 24 12s0-3.786-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>

              {/* Payment icons */}
              {/* <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-sm mr-2">We accept:</span>
                <img src="/visa.svg" alt="Visa" className="h-8 opacity-70 hover:opacity-100 transition-opacity" />
                <img src="/mastercard.svg" alt="Mastercard" className="h-8 opacity-70 hover:opacity-100 transition-opacity" />
                <img src="/paypal.svg" alt="Paypal" className="h-8 opacity-70 hover:opacity-100 transition-opacity" />
                <img src="/amex.svg" alt="Amex" className="h-8 opacity-70 hover:opacity-100 transition-opacity" />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}