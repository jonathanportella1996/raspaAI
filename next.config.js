/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { appDir: false }, // força desativar App Router
};
module.exports = nextConfig;
