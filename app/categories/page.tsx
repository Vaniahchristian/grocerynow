import { Header } from "@/components/header"
import { AllCategories } from "@/components/all-categories"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Grocery Categories - Shop by Category | Grocery Now Uganda",
  description: "Browse all grocery categories at Grocery Now Uganda. Fruits, Greens&Vegetables, Spices, Herbs, Diary&Poultry, Meat&Seafood, and more. Shop by category for easy grocery shopping in Kampala.",
  keywords: [
    "grocery categories Uganda",
    "fresh produce categories",
    "dairy products Uganda",
    "meat seafood Kampala",
    "pantry staples Uganda",
    "grocery store categories"
  ],
  openGraph: {
    title: "Grocery Categories - Shop by Category | Grocery Now Uganda",
    description: "Browse all grocery categories. Fresh Produce, Dairy, Meat, Pantry Staples & more. Shop groceries online in Uganda.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://grocerynowstore.com"}/categories`,
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://grocerynowstore.com"}/categories`,
  },
}

export default function CategoriesPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://grocerynowstore.com"
  return (
    <div className="min-h-screen bg-background">
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
                "name": "Categories",
                "item": `${siteUrl}/categories`
              }
            ]
          })
        }}
      />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Categories</h1>
          <p className="text-gray-600">Explore our diverse range of fresh products by category</p>
        </div>
        <AllCategories />
      </main>
      <Footer />
    </div>
  )
}
