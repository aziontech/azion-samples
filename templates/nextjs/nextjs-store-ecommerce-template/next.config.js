/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: [
        "fakestoreapi.com"
    ]
  }
}

module.exports = nextConfig
