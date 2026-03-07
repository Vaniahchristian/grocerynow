import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { FeaturedProducts } from "@/components/featured-products"
import { Categories } from "@/components/categories"
import { PromotionalBanners } from "@/components/promotional-banners"
import { Footer } from "@/components/footer"
import { WhyChooseUs } from "@/components/why-choose-us"
import { OffersSection } from "@/components/offers-section"
import { NewsletterSection } from "@/components/newsletter-section"
import { ContactUs } from "@/components/contact-us"
import { OrderSteps } from "@/components/order-steps"
import { FadeIn } from "@/components/fade-in"
import { SEOContentSection } from "@/components/seo-content-section"
import { FAQSection } from "@/components/faq-section"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Grocery Uganda - Online Grocery Store | Fresh Groceries Delivered in Kampala",
  description: "Grocery Uganda - Shop fresh groceries online in Uganda! Grocery Now delivers fresh fruits, vegetables, meat, dairy, and pantry staples to your door in Kampala. Fast delivery, best prices, quality guaranteed. Order groceries online Uganda today!",
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
    "Uganda online grocery",
    "grocery delivery near me",
    "best grocery store Kampala",
    "fresh fruits Uganda",
    "organic groceries Uganda"
  ],
  openGraph: {
    title: "Grocery Now - Uganda's #1 Online Grocery Store | Fresh Groceries Delivered",
    description: "Shop fresh groceries online in Uganda! Fast delivery in Kampala. Fresh fruits, vegetables, meat, dairy & more. Quality guaranteed, best prices.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://grocerynowstore.com",
    siteName: "Grocery Now",
    images: [
      {
        url: "/logo1.png",
        width: 1200,
        height: 630,
        alt: "Grocery Now - Fresh Groceries Delivered in Uganda",
      },
    ],
    locale: "en_UG",
    type: "website",
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://grocerynowstore.com",
  },
}

export default function HomePage() {
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
              }
            ]
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Store",
            "name": "Grocery Now",
            "image": `${siteUrl}/logo1.png`,
            "description": "Uganda's #1 online grocery store. Fresh groceries delivered to your door in Kampala.",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Nakasero",
              "addressLocality": "Kampala",
              "addressRegion": "Central Region",
              "postalCode": "",
              "addressCountry": "UG"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "0.3476",
              "longitude": "32.5825"
            },
            "url": siteUrl,
            "telephone": "+256207808052",
            "priceRange": "$$",
            "openingHoursSpecification": [
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                "opens": "08:00",
                "closes": "20:00"
              }
            ],
            "areaServed": {
              "@type": "City",
              "name": "Kampala"
            }
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Is Grocery Now the best online grocery store in Uganda?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! Grocery Now is one of Uganda's leading online grocery stores, offering fresh products, competitive prices, and fast delivery in Kampala. We're committed to providing the best grocery shopping experience for Ugandan families."
                }
              },
              {
                "@type": "Question",
                "name": "Do you deliver groceries throughout Uganda?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Currently, we deliver fresh groceries to Kampala and surrounding areas. We're expanding our delivery network to serve more locations across Uganda. Check our delivery page for the latest coverage areas."
                }
              },
              {
                "@type": "Question",
                "name": "How fast is grocery delivery in Kampala?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We offer same-day delivery in Kampala for orders placed before 3 PM. Our delivery team ensures your fresh groceries arrive promptly at your doorstep, maintaining quality and freshness."
                }
              },
              {
                "@type": "Question",
                "name": "What payment methods do you accept for grocery orders?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We accept multiple payment methods including MTN Mobile Money, Airtel Money, cash on delivery, and other mobile payment options. This makes grocery shopping convenient for all our customers in Uganda."
                }
              },
              {
                "@type": "Question",
                "name": "Are your groceries fresh and organic?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! We source fresh produce directly from local Ugandan farmers and trusted suppliers. Many of our products are organic and we ensure all groceries meet our high quality standards before delivery."
                }
              }
            ]
          })
        }}
      />
      <Header />
      <main className="space-y-16 md:space-y-24" itemScope itemType="https://schema.org/WebPage">
        <FadeIn>
          <Hero />
        </FadeIn>

        {/* Search Section */}
        {/* <FadeIn delay={40}>
          <SearchSection />
        </FadeIn> */}

        {/* Categories Section */}
        <FadeIn delay={80}>
          <Categories />
        </FadeIn>

        {/* Promotional Banners */}
        <FadeIn delay={120}>
          <PromotionalBanners />
        </FadeIn>

        {/* Featured Products */}
        <FadeIn delay={160}>
          <FeaturedProducts /> 
        </FadeIn>

        {/* Best Selling Products */}
        {/* <FadeIn delay={200}>
          <BestSellingProducts />
        </FadeIn> */}

        {/* Special Offers */}
        {/* <FadeIn delay={220}>
          <SpecialOffers />
        </FadeIn> */}

        {/* Trust & value props */}
        <FadeIn delay={240}>
          <WhyChooseUs />
        </FadeIn>

        {/* SEO Content Section - Keyword Rich */}
        {/* <SEOContentSection /> */}

        {/* FAQ Section for SEO */}
        <FAQSection />

        {/* Newsletter Section */}
        {/* <FadeIn delay={280}>
          <NewsletterSection />
        </FadeIn> */}

        {/* Contact section */}
        {/* <FadeIn delay={320}>
          <ContactUs />
        </FadeIn> */}
      </main>
      <Footer />
    </div>
  )
}
