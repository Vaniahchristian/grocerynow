"use client";

import Link from "next/link"
import { api } from "@/lib/productapi"
import { ProductGrid } from "@/components/product-grid"
import { Button } from "@/components/ui/button"
import { Grid3X3, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import type { Product } from "@/lib/types";
import { NoInternet } from "@/components/no-internet"
import { isOfflineError } from "@/lib/network"

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        setOffline(false);
        const productsData = await api.getProducts();
        setProducts(productsData);
      } catch (err) {
        console.error('Error loading featured products:', err);
        if (isOfflineError(err)) {
          setOffline(true);
          setError('No internet connection');
        } else {
          setError('Failed to load products');
        }
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              <span className="text-slate-800">Featured Products</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of fresh, quality products from trusted local suppliers
            </p>
          </div>
          
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading featured products...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    if (offline) {
      return (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                <span className="text-slate-800">Featured Products</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover our handpicked selection of fresh, quality products from trusted local suppliers
              </p>
            </div>
            <NoInternet onRetry={() => window.location.reload()} />
          </div>
        </section>
      );
    }
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              <span className="text-slate-800">Featured Products</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of fresh, quality products from trusted local suppliers
            </p>
          </div>
          
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">{error}</p>
              <Button 
                onClick={() => window.location.reload()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-6 py-2"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className=" bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          {/* Discover Button */}
          <div className="mb-2">
            <span className="inline-block bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium">
              Discover
            </span>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            <span className="text-slate-800">Featured Products</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of fresh, quality products from trusted local suppliers
          </p>
        </div>
        


        {/* Products Grid */}
        <ProductGrid 
          products={products}
          limit={4}
          size="sm"
          className="grid-cols-2 sm:grid-cols-2 lg:grid-cols-4  gap-1 max-w-6xl mx-auto"
        />
        

        
        {/* View All Products Button */}
        {products.length > 0 && (
          <div className="text-center mt-12">
            <Link href="/products" passHref legacyBehavior>
              <Button
                variant="outline"
                className={cn(
                  "rounded-full px-8 py-3 font-medium text-base transition-all duration-300 hover:scale-105",
                  "border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white bg-transparent"
                )}
              >
                View All Products
              </Button>
            </Link>
          </div>
        )}

        
      </div>
    </section>
  );
}

