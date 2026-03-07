"use client";

import { Header } from "@/components/header"
import { ProductCard } from "@/components/product-card"
import { ProductGrid } from "@/components/product-grid"
import { Footer } from "@/components/footer"
import { api } from "@/lib/productapi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import React, { useState, useEffect } from "react";
import { Search, Filter, Grid3X3, List, Star, Zap, ShoppingBag, Heart, Sparkles, TrendingUp, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { categories as importedCategories } from "@/lib/category-data";
import { cn } from "@/lib/utils";
import type { Product, Category } from "@/lib/types";
import { NoInternet } from "@/components/no-internet";
import { isOfflineError } from "@/lib/network";


// Enhanced categories with colors and icons - matching main store categories
const categoryColors = {
  "All": { bg: "bg-slate-600", text: "text-white", hover: "hover:bg-slate-700", icon: Grid3X3 },
  "Fruits": { bg: "bg-orange-600", text: "text-white", hover: "hover:bg-orange-700", icon: Sparkles },
  "Greens&Vegetables": { bg: "bg-green-600", text: "text-white", hover: "hover:bg-green-700", icon: ShoppingBag },
  "Spices": { bg: "bg-yellow-600", text: "text-white", hover: "hover:bg-yellow-700", icon: TrendingUp },
  "Herbs": { bg: "bg-purple-600", text: "text-white", hover: "hover:bg-purple-700", icon: Heart },
  "Diary&Poultry": { bg: "bg-blue-500", text: "text-white", hover: "hover:bg-blue-600", icon: Star },
  "Meat&Seafood": { bg: "bg-red-600", text: "text-white", hover: "hover:bg-red-700", icon: Zap }
};

// This will be populated from API
const allCategory = { id: "all", name: "All", image: "", productCount: 0 };

export default function ProductsPage() {
  // Get category from URL query parameter
  const [urlParams, setUrlParams] = useState<URLSearchParams | null>(null);

  useEffect(() => {
    // Only run on client side
    const searchParams = new URLSearchParams(window.location.search);
    setUrlParams(searchParams);
    
    // Handle category parameter
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(decodeURIComponent(categoryParam));
    }

    // Handle search parameter
    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearchQuery(decodeURIComponent(searchParam));
    }
  }, []);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        setOffline(false);
        
        const productsData = await api.getProducts();
        setProducts(productsData);
        
        // Calculate product counts per category
        const categoryWithCounts = importedCategories.map(cat => ({
          ...cat,
          productCount: productsData.filter(p => p.category === cat.name).length
        }));
        
        // Add "All" category with total count
        const allCategoriesWithAll = [
          { ...allCategory, productCount: productsData.length },
          ...categoryWithCounts
        ];
        
        setCategories(allCategoriesWithAll);
      } catch (err) {
        console.error('Error loading data:', err);
        if (isOfflineError(err)) {
          setOffline(true);
          setError('No internet connection');
        } else {
          setError('Failed to load products. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Products...</h2>
              <p className="text-gray-600">Please wait while we fetch the latest products</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            {offline ? (
              <NoInternet onRetry={() => window.location.reload()} />
            ) : (
              <div className="text-center">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-12 h-12 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <Button 
                  onClick={() => window.location.reload()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-8 py-3"
                >
                  Try Again
                </Button>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">All Products</h1>
          <p className="text-lg text-gray-600">Fresh groceries delivered to your doorstep</p>
        </div>

        {/* Enhanced Search and Filter Section */}
        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-6">
            {/* Enhanced Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="search"
                placeholder="Search for fresh products..."
                className="pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-0 text-base"
                value={searchQuery}
                onChange={(e) => {
                  const newQuery = e.target.value;
                  setSearchQuery(newQuery);
                  // Update URL
                  const params = new URLSearchParams(window.location.search);
                  if (newQuery) {
                    params.set('search', newQuery);
                  } else {
                    params.delete('search');
                  }
                  window.history.pushState({}, '', `${window.location.pathname}?${params}`);
                }}
              />
            </div>

            {/* Sort and View Controls */}
            {/* <div className="flex items-center space-x-4"> */}
              {/* Sort Dropdown */}
              {/* <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-0"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select> */}

{/*             
            </div> */}
          </div>

          {/* Enhanced Category Buttons */}
          <div className="flex items-center space-x-3 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-semibold text-gray-700">Filter by category:</span>
          </div>
          <div className="sm:hidden -mx-4 px-4 mb-4">
            <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
              {categories.map((category) => {
                const colorConfig = categoryColors[category.name as keyof typeof categoryColors] || categoryColors["All"];
                const IconComponent = colorConfig.icon;
                const isSelected = selectedCategory === category.name;

                return (
                  <Button
                    key={category.id}
                    className={cn(
                      "shrink-0 whitespace-nowrap snap-start rounded-2xl px-6 py-3 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg",
                      isSelected 
                        ? `${colorConfig.bg} ${colorConfig.text} shadow-lg` 
                        : `bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300 ${colorConfig.hover} hover:text-white`
                    )}
                    onClick={() => {
                      setSelectedCategory(category.name);
                      const newUrl = category.name === 'All'
                        ? window.location.pathname
                        : `${window.location.pathname}?category=${encodeURIComponent(category.name)}`;
                      window.history.pushState({}, '', newUrl);
                    }}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    <span>{category.name}</span>
                    {category.id !== 'all' && (
                      <span className={cn(
                        "ml-2 px-2 py-1 rounded-full text-xs font-bold",
                        isSelected ? "bg-white/20" : "bg-gray-100 text-gray-600"
                      )}>
                        {category.productCount}
                      </span>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="hidden sm:flex flex-wrap gap-3">
            {categories.map((category) => {
              const colorConfig = categoryColors[category.name as keyof typeof categoryColors] || categoryColors["All"];
              const IconComponent = colorConfig.icon;
              const isSelected = selectedCategory === category.name;
              
              return (
                <Button
                  key={category.id}
                  className={cn(
                    "rounded-2xl px-6 py-3 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg",
                    isSelected 
                      ? `${colorConfig.bg} ${colorConfig.text} shadow-lg` 
                      : `bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300 ${colorConfig.hover} hover:text-white`
                  )}
                  onClick={() => {
                    setSelectedCategory(category.name);
                    const newUrl = category.name === 'All'
                      ? window.location.pathname
                      : `${window.location.pathname}?category=${encodeURIComponent(category.name)}`;
                    window.history.pushState({}, '', newUrl);
                  }}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  <span>{category.name}</span>
                  {category.id !== 'all' && (
                    <span className={cn(
                      "ml-2 px-2 py-1 rounded-full text-xs font-bold",
                      isSelected ? "bg-white/20" : "bg-gray-100 text-gray-600"
                    )}>
                      {category.productCount}
                    </span>
                  )}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <p className="text-gray-600">
              <span className="font-semibold text-slate-800">{sortedProducts.length}</span> products found
              {searchQuery && (
                <span> for "<span className="font-semibold text-emerald-600">{searchQuery}</span>"
                </span>
              )}
              {selectedCategory !== 'All' && (
                <span> in <span className="font-semibold text-emerald-600">{selectedCategory}</span></span>
              )}
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Zap className="w-4 h-4 text-emerald-500" />
              <span>Fast delivery</span>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        {viewMode === 'grid' ? (
          <ProductGrid 
            products={paginatedProducts}
            size="sm"
            className="grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-1 mx-auto max-w-6xl"
          />
        ) : (
          <div className="flex flex-col space-y-4 mx-auto max-w-6xl">
            {paginatedProducts.map((product) => (
              <div 
                key={product.id}
              >
                <ProductCard product={product} size="sm" />
              </div>
            ))}
          </div>
        )}

        {sortedProducts.length > 0 && (
          <div className="mt-12 flex flex-col items-center space-y-6">
            {/* Results Summary */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-emerald-600">{Math.min(sortedProducts.length, startIndex + 1)}</span> - <span className="font-semibold text-emerald-600">{Math.min(sortedProducts.length, startIndex + paginatedProducts.length)}</span> of <span className="font-semibold text-gray-900">{sortedProducts.length}</span> products
              </p>
            </div>

            {/* Enhanced Pagination */}
            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "rounded-xl border-2 transition-all duration-300 font-semibold",
                  currentPage === 1
                    ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
                    : "border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 hover:scale-105 hover:shadow-md active:scale-95"
                )}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {(() => {
                  const pages: (number | string)[] = [];
                  const maxVisible = 5;
                  
                  if (totalPages <= maxVisible) {
                    // Show all pages if total is small
                    for (let i = 1; i <= totalPages; i++) {
                      pages.push(i);
                    }
                  } else {
                    // Always show first page
                    pages.push(1);
                    
                    if (currentPage <= 3) {
                      // Near the start
                      for (let i = 2; i <= 4; i++) {
                        pages.push(i);
                      }
                      pages.push('ellipsis-end');
                      pages.push(totalPages);
                    } else if (currentPage >= totalPages - 2) {
                      // Near the end
                      pages.push('ellipsis-start');
                      for (let i = totalPages - 3; i <= totalPages; i++) {
                        pages.push(i);
                      }
                    } else {
                      // In the middle
                      pages.push('ellipsis-start');
                      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                        pages.push(i);
                      }
                      pages.push('ellipsis-end');
                      pages.push(totalPages);
                    }
                  }

                  return pages.map((page, index) => {
                    if (page === 'ellipsis-start' || page === 'ellipsis-end') {
                      return (
                        <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                          ...
                        </span>
                      );
                    }
                    
                    const pageNum = page as number;
                    const isActive = pageNum === currentPage;
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={cn(
                          "min-w-[40px] h-10 px-3 rounded-xl font-semibold text-sm transition-all duration-300",
                          isActive
                            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200/50 scale-110 hover:bg-emerald-700 hover:scale-115"
                            : "bg-white border-2 border-emerald-100 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 hover:scale-105 hover:shadow-md active:scale-95"
                        )}
                      >
                        {pageNum}
                      </button>
                    );
                  });
                })()}
              </div>

              {/* Next Button */}
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "rounded-xl border-2 transition-all duration-300 font-semibold",
                  currentPage === totalPages
                    ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
                    : "border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 hover:scale-105 hover:shadow-md active:scale-95"
                )}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            {/* Page Info */}
            <p className="text-xs text-gray-500">
              Page <span className="font-semibold text-emerald-600">{currentPage}</span> of <span className="font-semibold text-gray-700">{totalPages}</span>
            </p>
          </div>
        )}
        
        {/* No Results State */}
        {sortedProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">No products found</h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any products matching your search criteria.
            </p>
            <Button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-8 py-3"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
