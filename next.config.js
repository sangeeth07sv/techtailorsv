/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
  // Suppress build warnings for cleaner output
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig
