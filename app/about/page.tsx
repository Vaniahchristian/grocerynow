import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AboutSection } from "@/components/about-section"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us - Grocery Now | Uganda's Trusted Online Grocery Store",
  description: "Learn about Grocery Now - Uganda's #1 online grocery store. We deliver fresh groceries, fruits, vegetables, and more to your door in Kampala. Quality guaranteed, fast delivery.",
  keywords: [
    "about grocery now",
    "grocery store Uganda about",
    "online grocery Uganda",
    "fresh groceries Kampala",
    "Uganda grocery delivery"
  ],
  openGraph: {
    title: "About Us - Grocery Now | Uganda's Trusted Online Grocery Store",
    description: "Learn about Grocery Now - Uganda's #1 online grocery store delivering fresh groceries in Kampala.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://grocerynowstore.com"}/about`,
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://grocerynowstore.com"}/about`,
  },
}

export default function AboutPage() {
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
                "name": "About Us",
                "item": `${siteUrl}/about`
              }
            ]
          })
        }}
      />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <AboutSection />
      </main>
      <Footer />
    </div>
  )
}
