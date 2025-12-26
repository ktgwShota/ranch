import type { NextConfig } from 'next';
import path from 'path';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

// 開発環境でCloudflareコンテキストを使用できるようにする
initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  // @opennextjs/cloudflare が自動的に処理するため特別な設定は不要
  // ただし、パスエイリアスを明示的に設定
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './src'),
    };
    return config;
  },
};

export default nextConfig;
