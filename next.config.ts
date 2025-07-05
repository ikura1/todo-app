import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/todo-app' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/todo-app' : '',
};

export default nextConfig;
