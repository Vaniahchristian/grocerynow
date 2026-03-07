import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://grocerynowstore.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/auth/', '/profile/', '/checkout/', '/cart/', '/payments/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/auth/', '/profile/', '/checkout/', '/cart/', '/payments/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}

