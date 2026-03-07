import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://grocerynowstore.com'
  
  return {
    name: 'Grocery Now - Uganda Online Grocery Store',
    short_name: 'Grocery Now',
    description: "Uganda's #1 online grocery store. Fresh groceries delivered to your door in Kampala.",
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#16a34a',
    icons: [
      {
        src: '/logo1.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
    categories: ['shopping', 'food', 'groceries'],
    lang: 'en-UG',
    dir: 'ltr',
    orientation: 'portrait',
    scope: '/',
  }
}

