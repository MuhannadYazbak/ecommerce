import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  // i18n: {
  //   locales: ['en', 'ar', 'he'],
  //   defaultLocale: 'en',
  // }
};


export default nextConfig;

module.exports = {
  experimental: {
    runtime: 'nodejs'
  }
};


// module.exports = {
//   i18n: {
//     locales: ['en', 'ar', 'he'],
//     defaultLocale: 'en',
//   },
// };
