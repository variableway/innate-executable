/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@atlas/ui'],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
