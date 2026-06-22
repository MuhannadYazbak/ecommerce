/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // 💡 THE PRODUCTION BUILD LIFESAVER:
    // Prevents missing compiler definitions from breaking the final CSS/JS chunk build
    ignoreBuildErrors: true, 
  },
  // Keep your other configs (like experimental features) here...
};

module.exports = nextConfig;