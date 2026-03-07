import type React from "react"
import type { Metadata } from 'next'

const site = process.env.NEXT_PUBLIC_SITE_URL || "https://grocerynowstore.com";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  let product: any = null;
  try {
    const res = await fetch(`${site}/api/products/${id}`, { 
      cache: "no-store",
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; GroceryNowBot/1.0)',
      }
    });
    if (res.ok) {
      product = await res.json();
    }
  } catch (error) {
    console.error('Error fetching product for metadata:', error);
  }

  const titleBase = product?.name 
    ? `${product.name} - Buy Online in Uganda | UGX ${Number(product.price || 0).toLocaleString()} | Grocery Now` 
    : "Product - Grocery Now Uganda";
  
  const description = product?.description 
    ? `${product.description} Buy ${product.name} online in Uganda. Fast delivery in Kampala. Best prices, quality guaranteed. Order now from Grocery Now.`
    : "Buy fresh groceries online in Uganda. Fast delivery, best prices. Shop now at Grocery Now.";

  // Get product image - ensure absolute URL
  const pickImage = () => {
    const imgs: string[] = [];
    if (Array.isArray(product?.images)) imgs.push(...product.images);
    if (product?.image) imgs.push(product.image);
    const img = imgs.find(Boolean);
    if (!img) return `${site}/logo1.png`; // Fallback to logo
    if (img.startsWith("http")) return img;
    if (img.startsWith("/api")) return `${site}${img}`;
    if (img.startsWith("/")) return `${site}${img}`;
    return `${site}/api/uploads/${img}`;
  };

  const ogImage = pickImage();
  const url = `${site}/products/${id}`;

  // Ensure image URL is absolute and accessible
  const ensureAbsoluteUrl = (imageUrl: string) => {
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }
    // Remove leading slash if present to avoid double slashes
    const cleanPath = imageUrl.startsWith("/") ? imageUrl.slice(1) : imageUrl;
    return `${site}/${cleanPath}`;
  };

  const finalOgImage = ensureAbsoluteUrl(ogImage);

  return {
    title: titleBase,
    description: description,
    openGraph: {
      type: "website", // Next.js only supports: website, article, book, profile, music, video
      title: titleBase,
      description: description,
      url: url,
      siteName: "Grocery Now",
      images: [
        {
          url: finalOgImage,
          width: 1200,
          height: 630,
          alt: product?.name || "Product image",
          secureUrl: finalOgImage,
        },
      ],
      locale: "en_UG",
    },
    twitter: {
      card: "summary_large_image",
      title: titleBase,
      description: description,
      images: [finalOgImage],
    },
    alternates: {
      canonical: url,
    },
    other: {
      // Override og:type to "product" for external crawlers (WhatsApp, Facebook, etc.)
      'og:type': 'product',
      'product:price:amount': product?.price ? String(product.price) : '',
      'product:price:currency': 'UGX',
      'product:category': product?.category || '',
      // Additional WhatsApp-specific tags
      'og:image:type': 'image/jpeg',
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:image:secure_url': finalOgImage,
    },
  };
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children;
}

