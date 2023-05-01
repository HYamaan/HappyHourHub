/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  productionBrowserSourceMaps: false,
  reactStrictMode: false,
  images: {
    domains: ["res.cloudinary.com"],
  },

}

module.exports = nextConfig

//DENME