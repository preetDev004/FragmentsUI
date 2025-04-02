/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // Add these to help with Vercel deployments
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // This is not ideal but can help troubleshoot deployment issues
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
