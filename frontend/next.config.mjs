/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['www.bing.com'], // Add other domains as needed
  },
};

export default nextConfig;
