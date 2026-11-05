/** @type {import('next').NextConfig} */
const allowedHosts = process.env.ALLOWED_HOSTS
  ? process.env.ALLOWED_HOSTS.split(',').map((h) => h.trim())
  : undefined;

const nextConfig = {
  compress: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      allowedOrigins: allowedHosts || ['localhost:3000', '127.0.0.1:3000', '*.vercel.app'],
    },
  },
};

module.exports = nextConfig;
