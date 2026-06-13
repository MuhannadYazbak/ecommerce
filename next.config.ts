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
   turbopack: {
      root: __dirname, // This tells Next.js: "Stop looking up! This folder is the real root."
    },
  }
};


// module.exports = {
//   i18n: {
//     locales: ['en', 'ar', 'he'],
//     defaultLocale: 'en',
//   },
// };
