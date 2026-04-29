import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/manager/', '/api/', '/_next/'],
    },
    sitemap: 'https://azisunt.shop/sitemap.xml',
  }
}
