import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ContactUs } from "@/components/contact-us"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us - Grocery Now Uganda | Get in Touch",
  description: "Contact Grocery Now - Uganda's #1 online grocery store. Call +256 207808052, email grocerynow@gmail.com, or visit us in Nakasero, Kampala. We're here to help!",
  keywords: [
    "contact grocery now",
    "grocery store contact Uganda",
    "grocery delivery contact Kampala",
    "online grocery customer service Uganda"
  ],
  openGraph: {
    title: "Contact Us - Grocery Now Uganda",
    description: "Get in touch with Grocery Now. Call +256 207808052 or email grocerynow@gmail.com. Located in Nakasero, Kampala.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://grocerynowstore.com"}/contact`,
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://grocerynowstore.com"}/contact`,
  },
}

export default function ContactPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://grocerynowstore.com"
  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contact Grocery Now",
            "description": "Contact Grocery Now - Uganda's #1 online grocery store",
            "url": `${siteUrl}/contact`,
            "mainEntity": {
              "@type": "Organization",
              "name": "Grocery Now",
              "telephone": "+256207808052",
              "email": "grocerynow@gmail.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Nakasero",
                "addressLocality": "Kampala",
                "addressRegion": "Central Region",
                "addressCountry": "UG"
              }
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
                "name": "Contact Us",
                "item": `${siteUrl}/contact`
              }
            ]
          })
        }}
      />
      <Header />
      <main>
        <ContactUs />
      </main>
      <Footer />
    </div>
  )
}
