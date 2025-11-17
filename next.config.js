/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server Actions are enabled by default in Next.js 14
  reactStrictMode: true,
  
  // Prevent blocking operations during build
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  
  // Optimize build performance
  swcMinify: true,
  
  // Disable source maps in production for faster builds
  productionBrowserSourceMaps: false,
  
  // Webpack config to prevent blocking
  webpack: (config, { isServer, dev }) => {
    // Prevent database connections during build
    if (!dev && isServer) {
      config.externals = config.externals || []
      config.externals.push({
        '@prisma/client': '@prisma/client',
      })
    }
    return config
  },
}

module.exports = nextConfig

