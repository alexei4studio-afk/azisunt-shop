/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cmtvxrkfdjqozdgpgpby.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'sc02.alicdn.com',
      },
      {
        protocol: 'https',
        hostname: 'l.profitshare.ro',
      },
    ],
  },
  experimental: {
    // Această opțiune forțează Turbopack (motorul de dezvoltare Next.js)
    // să recunoască acest folder ca fiind rădăcina proiectului.
    // Va ignora fișierele rătăcite din alte directoare și va rezolva
    // atât eroarea 404, cât și problema de memorie.
    turbopack: {
      root: process.cwd(),
    },
  },
};

export default nextConfig;