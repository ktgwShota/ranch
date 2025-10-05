/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    runtime: "experimental-edge" // Cloudflare Pages Functions 対応
  },
  output: undefined // 静的エクスポートを無効化
};

export default nextConfig;
