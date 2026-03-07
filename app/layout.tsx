import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/lib/cart-context"
import { AuthProvider } from "@/contexts/AuthContext"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://grocerynowstore.com'),
  title: {
    default: "Grocery Now - Fresh Groceries Delivered in Uganda | Online Grocery Store Kampala",
    template: "%s | Grocery Now Uganda"
  },
  description:
    "Uganda's #1 online grocery store. Order fresh groceries, fruits, vegetables, meat, dairy & more in Kampala. Fast delivery, affordable prices. Shop groceries online in Uganda with Grocery Now.",
  keywords: [
    "grocery store Uganda",
    "online grocery shopping Uganda",
    "grocery delivery Kampala",
    "fresh groceries Uganda",
    "online supermarket Uganda",
    "grocery store Kampala",
    "buy groceries online Uganda",
    "fresh produce Uganda",
    "grocery delivery service Uganda",
    "Uganda grocery store",
    "Kampala grocery delivery",
    "online grocery Uganda",
    "fresh vegetables Uganda",
    "grocery shopping Uganda",
    "Uganda online grocery"
  ],
  authors: [{ name: "Grocery Now" }],
  creator: "Grocery Now",
  publisher: "Grocery Now",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: { 
    icon: "/logo1.png",
    apple: "/logo1.png"
  },
  openGraph: {
    type: "website",
    locale: "en_UG",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://grocerynowstore.com",
    siteName: "Grocery Now",
    title: "Grocery Now - Fresh Groceries Delivered in Uganda | Online Grocery Store Kampala",
    description: "Uganda's #1 online grocery store. Order fresh groceries, fruits, vegetables, meat, dairy & more in Kampala. Fast delivery, affordable prices.",
    images: [
      {
        url: "/logo1.png",
        width: 1200,
        height: 630,
        alt: "Grocery Now - Fresh Groceries Delivered in Uganda",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Grocery Now - Fresh Groceries Delivered in Uganda",
    description: "Uganda's #1 online grocery store. Fast delivery, affordable prices. Shop groceries online in Kampala.",
    images: ["/logo1.png"],
    creator: "@grocerynow256",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://grocerynowstore.com",
  },
  other: {
    'geo.region': 'UG',
    'geo.placename': 'Kampala, Uganda',
    'geo.position': '0.3476;32.5825',
    'ICBM': '0.3476, 32.5825',
    'language': 'English',
    'country': 'Uganda',
    'distribution': 'Uganda',
    'rating': 'General',
  },
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  category: "Grocery Store",
  classification: "Online Grocery Store in Uganda",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://grocerynowstore.com"
  
  return (
    <html lang="en-UG" itemScope itemType="https://schema.org/WebSite">
      <body className={`${inter.className} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "@id": `${siteUrl}#organization`,
              "name": "Grocery Now",
              "alternateName": "Grocery Now Uganda",
              "url": siteUrl,
              "logo": `${siteUrl}/logo1.png`,
              "image": `${siteUrl}/logo1.png`,
              "description": "Uganda's #1 online grocery store. Order fresh groceries, fruits, vegetables, meat, dairy & more in Kampala. Fast delivery, affordable prices.",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Nakasero",
                "addressLocality": "Kampala",
                "addressRegion": "Central Region",
                "addressCountry": "UG"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "0.3476",
                "longitude": "32.5825"
              },
              "telephone": "+256207808052",
              "email": "grocerynow@gmail.com",
              "priceRange": "$$",
              "currenciesAccepted": "UGX",
              "paymentAccepted": "Cash, Mobile Money, Credit Card",
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday"
                ],
                "opens": "08:00",
                "closes": "20:00"
              },
              "areaServed": {
                "@type": "City",
                "name": "Kampala",
                "sameAs": "https://en.wikipedia.org/wiki/Kampala"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Grocery Products",
                "itemListElement": [
                  {
                    "@type": "OfferCatalog",
                    "name": "Fruits",
                    "url": `${siteUrl}/products?category=Fruits`
                  },
                  {
                    "@type": "OfferCatalog",
                    "name": "Diary&Poultry",
                    "url": `${siteUrl}/products?category=Diary&Poultry`
                  },
                  {
                    "@type": "OfferCatalog",
                    "name": "Meat&Seafood",
                    "url": `${siteUrl}/products?category=Meat&Seafood`
                  }
                ]
              },
              "sameAs": [
                "https://www.facebook.com/share/17EAeaQjA6/",
                "https://x.com/BrwxrTy?t=FaAB0M7cYPp6O1mzzFMRTw&s=08",
                "https://www.instagram.com/grocerynow25",
                "https://youtube.com/@grocerynow256"
              ],
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "150"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Grocery Now",
              "url": siteUrl,
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": `${siteUrl}/products?search={search_term_string}`
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

