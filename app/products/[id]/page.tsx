"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { api } from "@/lib/productapi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, ShoppingCart, Truck, ShieldCheck, Clock } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { ShareProductButton } from "@/components/share-product-button";

import { WishlistHeart } from "@/components/wishlist-heart";
import { getImageUrl } from "@/lib/image-utils";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { NoInternet } from "@/components/no-internet";
import { isOfflineError } from "@/lib/network";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

  const productId = params.id as string;

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        setOffline(false);

        const productData = await api.getProduct(productId);
        setProduct(productData);

        // Load related products from the same category
        try {
          const related = await api.getRelatedProducts(productData.category, productId, 4);
          setRelatedProducts(related);
        } catch (relatedErr) {
          console.warn('Could not load related products:', relatedErr);
          // Don't fail the whole page if related products fail
        }
      } catch (err) {
        console.error('Error loading product:', err);
        if (isOfflineError(err)) {
          setOffline(true);
          setError('No internet connection');
        } else {
          setError('Failed to load product. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId]);

  useEffect(() => {
    if (product?.variants?.length && !selectedVariantId) {
      setSelectedVariantId(product.variants[0].id);
    }
  }, [product, selectedVariantId]);

  const handleAddToCart = async () => {
    if (!product) return;

    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    const v = product.variants?.find((x) => x.id === selectedVariantId);
    const prodForCart: Product = v
      ? { ...product, price: v.price, unit: v.unit, name: `${product.name} (${v.label})` }
      : product;

    await addToCart(prodForCart, quantity);
    const notification = document.createElement("div");
    notification.className = "fixed top-4 right-4 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-semibold z-50 animate-slide-in-right";
    notification.innerHTML = `
      <div class="flex items-center space-x-2">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"/>
        </svg>
        <span>${product.name} added to cart!</span>
      </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
  };

  const copyReferralLink = async () => {
    if (!product) return;
    const url = `${window.location.origin}/products/${product.id}${user ? `?ref=${user.id}` : ""}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied!", description: "Referral link copied to clipboard." });
    } catch {}
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Product...</h2>
              <p className="text-gray-600">Please wait while we fetch the product details</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
            <Button
              onClick={() => router.push('/products')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-8 py-3"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const selectedVariant = product.variants?.find((v) => v.id === selectedVariantId);
  const displayPrice = selectedVariant ? selectedVariant.price : product.price;
  const displayUnit = selectedVariant?.unit ?? product.unit;
  const images = Array.from(new Set([
    product.image,
    ...((Array.isArray(product.images) ? product.images : []) as string[]),
  ].filter(Boolean)));
  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
  const priceMin = hasVariants ? Math.min(...product.variants.map((v) => v.price)) : undefined;
  const priceMax = hasVariants ? Math.max(...product.variants.map((v) => v.price)) : undefined;

  const siteUrl = typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL || "https://grocerynowstore.com";
  const productUrl = `${siteUrl}/products/${productId}`;
  const productImage = product ? getImageUrl(product.image) : "";
  const fullImageUrl = productImage.startsWith("http") ? productImage : `${siteUrl}${productImage.startsWith("/") ? "" : "/"}${productImage}`;

  return (
    <div className="min-h-screen bg-background">
      {product && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Product",
                "name": product.name,
                "image": images.map(img => {
                  const imgUrl = getImageUrl(img);
                  return imgUrl.startsWith("http") ? imgUrl : `${siteUrl}${imgUrl.startsWith("/") ? "" : "/"}${imgUrl}`;
                }),
                "description": product.description || `${product.name} - Buy online in Uganda from Grocery Now`,
                "sku": product.id,
                "mpn": product.id,
                "brand": {
                  "@type": "Brand",
                  "name": "Grocery Now"
                },
                "offers": {
                  "@type": "Offer",
                  "url": productUrl,
                  "priceCurrency": "UGX",
                  "price": displayPrice,
                  "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  "itemCondition": "https://schema.org/NewCondition",
                  "availability": product.inStock 
                    ? "https://schema.org/InStock" 
                    : "https://schema.org/OutOfStock",
                  "seller": {
                    "@type": "Organization",
                    "name": "Grocery Now",
                    "url": siteUrl
                  },
                  "shippingDetails": {
                    "@type": "OfferShippingDetails",
                    "shippingRate": {
                      "@type": "MonetaryAmount",
                      "value": "0",
                      "currency": "UGX"
                    },
                    "shippingDestination": {
                      "@type": "DefinedRegion",
                      "addressCountry": "UG"
                    },
                    "deliveryTime": {
                      "@type": "ShippingDeliveryTime",
                      "businessDays": {
                        "@type": "OpeningHoursSpecification",
                        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
                      },
                      "cutoffTime": "15:00",
                      "handlingTime": {
                        "@type": "QuantitativeValue",
                        "minValue": 1,
                        "maxValue": 1,
                        "unitCode": "DAY"
                      },
                      "transitTime": {
                        "@type": "QuantitativeValue",
                        "minValue": 1,
                        "maxValue": 1,
                        "unitCode": "DAY"
                      }
                    }
                  }
                },
                "category": product.category,
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.8",
                  "reviewCount": "25"
                }
              })
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": siteUrl
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Products",
                    "item": `${siteUrl}/products`
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": product.category || "Category",
                    "item": `${siteUrl}/products?category=${encodeURIComponent(product.category || "")}`
                  },
                  {
                    "@type": "ListItem",
                    "position": 4,
                    "name": product.name,
                    "item": productUrl
                  }
                ]
              })
            }}
          />
        </>
      )}
      <Header />
      <main className="container mx-auto px-4 pt-8 pb-28 md:pb-8" itemScope itemType="https://schema.org/Product">
        <div className="mb-6">
          <Button
            onClick={() => router.push('/products')}
            variant="ghost"
            className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="relative max-h-80 md:max-h-none">
              <Carousel setApi={setCarouselApi} className="w-full">
                <CarouselContent>
                  {images.map((src, idx) => (
                    <CarouselItem key={idx}>
                      <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-xl ring-1 ring-black/5">
                        <Image
                          src={getImageUrl(src)}
                          alt={product.name}
                          fill
                          className="object-contain p-8"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          quality={90}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-2" />
                <CarouselNext className="-right-2" />
              </Carousel>
              <div className="absolute top-4 right-4">
                <WishlistHeart productId={Number(product.id)} size="md" className="bg-white/90 backdrop-blur-sm shadow-sm" />
              </div>
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((src, idx) => (
                  <button
                    key={idx}
                    onClick={() => carouselApi?.scrollTo(idx)}
                    className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 hover:ring-2 hover:ring-emerald-500/50 transition"
                  >
                    <Image
                      src={getImageUrl(src)}
                      alt={product.name}
                      fill
                      className="object-contain p-2 bg-white"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold tracking-wide text-emerald-600 mb-1">{product.category}</p>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">{product.name}</h1>
              </div>
              <div className="hidden md:block">
                <Badge className={`${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} rounded-full px-4 py-1.5`}>{product.inStock ? 'In Stock' : 'Out of Stock'}</Badge>
              </div>
            </div>

            {hasVariants && priceMin !== undefined && priceMax !== undefined && (
              <div className="text-sm text-gray-600">Price range: UGX {priceMin.toLocaleString()} - {priceMax.toLocaleString()}</div>
            )}

            <Card className="rounded-2xl border-emerald-100/70">
              <CardContent className="pt-6 space-y-6">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Price</div>
                    <div className="text-2xl font-extrabold text-gray-900">UGX {displayPrice.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">per {displayUnit}</div>
                  </div>
                  <div className="md:hidden">
                    <Badge className={`${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} rounded-full px-4 py-1.5`}>{product.inStock ? 'In Stock' : 'Out of Stock'}</Badge>
                  </div>
                </div>

                {hasVariants && (
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-gray-900">Choose option</div>
                    <ToggleGroup type="single" value={selectedVariantId ?? product.variants![0].id} onValueChange={(v) => v && setSelectedVariantId(v)} className="flex flex-wrap gap-2">
                      {product.variants!.map((v) => (
                        <ToggleGroupItem key={v.id} value={v.id} className="rounded-xl border px-3 py-2 data-[state=on]:bg-emerald-600 data-[state=on]:text-white">
                          {v.label}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="rounded-full">-</Button>
                  <Input type="number" min={1} value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value || '1')))} className="w-20 text-center" />
                  <Button variant="outline" size="sm" onClick={() => setQuantity((q) => q + 1)} className="rounded-full">+</Button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    size="xl"
                    className="hidden md:inline-flex flex-1 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                  <ShareProductButton 
                    product={{ ...product, price: displayPrice }} 
                    referralCode={user ? String(user.id) : undefined} 
                  />
                  <Button
                    variant="outline"
                    size="xl"
                    onClick={copyReferralLink}
                    className="rounded-2xl border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 shadow-sm transition-colors"
                  >
                    Refer & Copy Link
                  </Button>
                </div>
                <Separator />

                <Tabs defaultValue="description">
                  <TabsList>
                    <TabsTrigger value="description">Description</TabsTrigger>
                    {hasVariants && <TabsTrigger value="options">Options</TabsTrigger>}
                    <TabsTrigger value="info">Info</TabsTrigger>
                  </TabsList>
                  <TabsContent value="description" className="mt-4">
                    {product.description ? (
                      <p className="text-gray-600 leading-relaxed">{product.description}</p>
                    ) : (
                      <p className="text-gray-500">No description available.</p>
                    )}
                  </TabsContent>
                  {hasVariants && (
                    <TabsContent value="options" className="mt-4">
                      <div className="space-y-2">
                        {product.variants!.map((v) => (
                          <div key={v.id} className="flex items-center justify-between rounded-xl border p-3">
                            <div className="font-medium text-gray-900">{v.label}</div>
                            <div className="text-gray-700">UGX {v.price.toLocaleString()}</div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  )}
                  <TabsContent value="info" className="mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="rounded-xl border p-3 text-sm text-gray-600">Quality guaranteed</div>
                      <div className="rounded-xl border p-3 text-sm text-gray-600">Easy returns within 48 hours</div>
                      <div className="rounded-xl border p-3 text-sm text-gray-600">Cash on delivery available</div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="fixed bottom-0 inset-x-0 z-40 border-t bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 p-3 md:hidden">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="text-xs text-gray-500">Total</div>
              <div className="text-xl font-bold text-gray-900">UGX {displayPrice.toLocaleString()}</div>
            </div>
            <Button onClick={handleAddToCart} disabled={!product.inStock} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-6 py-6 font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
              <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
            </Button>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="group">
                  <div 
                    className="bg-white rounded-lg border border-gray-100 transition-all duration-300 hover:shadow-lg w-full max-w-[250px] overflow-hidden cursor-pointer"
                    onClick={() => router.push(`/products/${relatedProduct.id}`)}
                  >
                    <div className="relative w-full overflow-hidden h-40 rounded-t-lg">
                      <Image
                        src={getImageUrl(relatedProduct.image)}
                        alt={relatedProduct.name}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        quality={80}
                      />
                      {/* No sale badge */}

                    </div>
                  </div>

                  <div className="w-full max-w-[250px] p-3">
                    <div className="space-y-1">
                      <h3 className="font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-green-600 transition-colors duration-300 text-sm">
                        {relatedProduct.name}
                      </h3>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900">
                            UGX {relatedProduct.price.toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-500">
                            per {relatedProduct.unit}
                          </span>
                        </div>

                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          relatedProduct.inStock
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {relatedProduct.inStock ? "In Stock" : "Out of Stock"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}