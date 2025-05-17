import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
