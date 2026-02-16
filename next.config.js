const path = require('path');
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    minimumCacheTTL: 2592000, // 30 days = 24*60*60*30
    deviceSizes: [768, 1024, 1280, 1440, 2560], // Screens sizes
    imageSizes: [], // Prevents small image sizes from being generated  
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },

    ],
    domains: ['localhost', 'cdn.sanity.io'],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  reactStrictMode: true,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: false,
  },
  trailingSlash: true,
};

module.exports = nextConfig
