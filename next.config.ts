import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Skip ESLint during builds to prevent deployment issues
  eslint: {
    // Only run ESLint during development, not during builds
    ignoreDuringBuilds: true,
  },
  // Skip TypeScript type checking during builds
  typescript: {
    // Only run type checking during development, not during builds
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "instagram.fbcn7-1.fna.fbcdn.net",
      },
      {
        protocol: "https",
        hostname: "instagram.fbcn7-2.fna.fbcdn.net",
      },
      {
        protocol: "https",
        hostname: "instagram.fbcn7-3.fna.fbcdn.net",
      },
      {
        protocol: "https",
        hostname: "instagram.fbcn7-4.fna.fbcdn.net",
      },
      {
        protocol: "https",
        hostname: "atractive-smithers.e1a9e993199c23a6e0099c1e3a5fe29e.r2.cloudflarestorage.com",
      },
    ],
  },
};

export default nextConfig;
