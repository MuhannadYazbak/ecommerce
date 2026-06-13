import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Forces all compiled chunks and files to fetch cleanly from the root directory asset path
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://ecommerce-t7tm.vercel.app' : '',
};

export default nextConfig;