'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  Phone,
  Truck,
  Bookmark,
  Star,
  User,
  MapPin,
  LogOut,
} from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useCart } from '../lib/cart-context'
import { useAuth } from '@/contexts/AuthContext'
import { useWishlist } from './wishlist-heart'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
export function Header() {
  const router = useRouter()
  const { state } = useCart()
  const { user, isAuthenticated, logout } = useAuth()
  const { wishlistItems } = useWishlist()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Announcement Bar */}
      {/* <div className="bg-green-600 text-white py-2 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center text-sm">
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4" />
              <span className="font-medium">
                Free Shipping On All Orders Over UGX 100,000 - Save up to 50% off on your first order
              </span>
            </div>
          </div>
        </div>
      </div> */}
      {/* Main Header */}
      <div className="container mx-auto py-4 px-4">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-[60px] h-[60px] bg-green-600 rounded-xl relative z-10 flex items-center justify-center">
                <img src="/logo1.png" alt=" Groceries Now " className="w-[40px] h-[40px] object-contain" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold text-emerald-700">
                Grocery Now
              </span>
              <p className="text-xs text-gray-500 -mt-1">
                Delivered  On  Time
              </p>
            </div>
          </a>
          {/* Search Bar */}
         {/* <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <div className="relative flex items-center">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10 " />
                <Input
                  type="text"
                  placeholder="Search for fresh groceries, organic products..."
                  className="pl-12 pr-20 py-6 w-full bg-white rounded-2xl text-lg placeholder-gray-400 border-2 border-gray-200 focus:border-green-600 focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch()
                    }
                  }}
                />
                <Button 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </div>
            </div>
          </div>
          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Wishlist (desktop) */}
            <Link
              href="/wishlist"
              className="hidden md:flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors duration-300 group"
            >
              <div className="relative p-2 rounded-xl bg-gray-50 group-hover:bg-emerald-50 transition-colors duration-300">
                <Bookmark className="w-5 h-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium">Wishlist</span>
            </Link>
            {/* Account (desktop) */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hidden md:flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors duration-300 group p-2">
                    <div className="p-2 rounded-xl bg-gray-50 group-hover:bg-emerald-50 transition-colors duration-300">
                      <User className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium">{user?.first_name || 'Account'}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist" className="flex items-center">
                      <Bookmark className="mr-2 h-4 w-4" />
                      My Wishlist
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="flex items-center text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild className="rounded-xl hover:rounded-xl">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild className="bg-green-600 hover:bg-green-700 rounded-xl">
                  <Link href="/auth/register">Sign Up</Link>
                </Button>
              </div>
            )}
            {/* Cart */}
            <a href="/cart" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="relative bg-white p-3 rounded-xl border-2 border-gray-200 group-hover:border-emerald-300 transition-colors duration-300">
                  <ShoppingCart className="w-6 h-6 text-emerald-600" />
                  {state.items.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
                      {state.items.reduce(
                        (sum, item) => sum + item.quantity,
                        0,
                      )}
                    </span>
                  )}
                </div>
              </div>
              <div className="hidden md:block">
                <span className="text-sm font-medium text-gray-600 group-hover:text-emerald-600 transition-colors duration-300">
                  Cart
                </span>
                <p className="text-xs text-gray-400">
                  {state.items.length > 0
                    ? `${state.items.length} items`
                    : 'Empty'}
                </p>
              </div>
            </a>
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden p-2 hover:bg-emerald-50 rounded-xl transition-colors duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-emerald-600" />
              ) : (
                <Menu className="w-6 h-6 text-emerald-600" />
              )}
            </Button>
          </div>
        </div>
        {/* Mobile Search Bar */}
        {/* <div className="md:hidden mt-4">
          <div className="relative">
            <div className="relative flex items-center">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
              <Input
                type="text"
                placeholder="Search groceries..."
                className="pl-12 pr-4 py-3 w-full bg-white border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 rounded-2xl placeholder-gray-400"
              />
            </div>
          </div>
        </div> */}
      </div>
      {/* Removed dense green navigation bar for a cleaner, minimal header */}
      {/* Modern Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed top-[calc(4rem+1px)] left-0 right-0 bottom-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-50 overflow-y-auto">
          <div className="container mx-auto px-4 py-6">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800">Menu</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-xl"
              >
                <X className="w-5 h-5 text-gray-600" />
              </Button>
            </div>
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <a
                href="/wishlist"
                className="flex items-center space-x-3 p-4 bg-red-50 rounded-2xl border border-red-100 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                  <Bookmark className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Wishlist</p>
                  <p className="text-xs text-gray-500">Saved items</p>
                </div>
              </a>
              <a
                href="/profile"
                className="flex items-center space-x-3 p-4 bg-blue-50 rounded-2xl border border-blue-100 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Account</p>
                  <p className="text-xs text-gray-500">Profile & orders</p>
                </div>
              </a>
            </div>
            {/* Navigation Links */}
            <nav className="space-y-2 mb-6">
              <a
                href="/"
                className="flex items-center justify-between p-4 rounded-2xl hover:bg-emerald-50 transition-colors duration-300 group"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="font-medium text-gray-700 group-hover:text-emerald-600">
                  Home
                </span>
                <div className="w-6 h-6 rounded-full bg-emerald-100 group-hover:bg-emerald-200 flex items-center justify-center transition-colors duration-300">
                  <svg
                    className="w-3 h-3 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </a>
              <a
                href="/products"
                className="flex items-center justify-between p-4 rounded-2xl hover:bg-emerald-50 transition-colors duration-300 group"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="font-medium text-gray-700 group-hover:text-emerald-600">
                  Shop
                </span>
                <div className="w-6 h-6 rounded-full bg-emerald-100 group-hover:bg-emerald-200 flex items-center justify-center transition-colors duration-300">
                  <svg
                    className="w-3 h-3 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </a>
              {/* <a
                href="/offers"
                className="flex items-center justify-between p-4 rounded-2xl hover:bg-emerald-50 transition-colors duration-300 group"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-700 group-hover:text-emerald-600">
                    Offers
                  </span>
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
                    Hot
                  </span>
                </div>
                <div className="w-6 h-6 rounded-full bg-emerald-100 group-hover:bg-emerald-200 flex items-center justify-center transition-colors duration-300">
                  <svg
                    className="w-3 h-3 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </a> */}
              <a
                href="/categories"
                className="flex items-center justify-between p-4 rounded-2xl hover:bg-emerald-50 transition-colors duration-300 group"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="font-medium text-gray-700 group-hover:text-emerald-600">
                  Categories
                </span>
                <div className="w-6 h-6 rounded-full bg-emerald-100 group-hover:bg-emerald-200 flex items-center justify-center transition-colors duration-300">
                  <svg
                    className="w-3 h-3 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </a>
              <a
                href="/about"
                className="flex items-center justify-between p-4 rounded-2xl hover:bg-emerald-50 transition-colors duration-300 group"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="font-medium text-gray-700 group-hover:text-emerald-600">
                  About
                </span>
                <div className="w-6 h-6 rounded-full bg-emerald-100 group-hover:bg-emerald-200 flex items-center justify-center transition-colors duration-300">
                  <svg
                    className="w-3 h-3 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </a>
              <a
                href="/contact"
                className="flex items-center justify-between p-4 rounded-2xl hover:bg-emerald-50 transition-colors duration-300 group"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="font-medium text-gray-700 group-hover:text-emerald-600">
                  Contact
                </span>
                <div className="w-6 h-6 rounded-full bg-emerald-100 group-hover:bg-emerald-200 flex items-center justify-center transition-colors duration-300">
                  <svg
                    className="w-3 h-3 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </a>
            </nav>
            {/* Cart Section */}
            <a
              href="/cart"
              className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl text-white mb-6 shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center relative">
                  <ShoppingCart className="w-5 h-5" />
                  {state.items.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                      {state.items.reduce(
                        (sum, item) => sum + item.quantity,
                        0,
                      )}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-semibold">Shopping Cart</p>
                  <p className="text-white/80 text-sm">
                    {state.items.length > 0
                      ? `${state.items.length} items`
                      : 'Empty cart'}
                  </p>
                </div>
              </div>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
            {/* Support Section */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Need Help?</p>
                  <p className="text-emerald-600 font-medium">
                    (+256) 207808052
                  </p>
                  <p className="text-xs text-gray-500">24/7 Customer Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}