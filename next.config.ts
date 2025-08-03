import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [{
      hostname: "fmvuxchxz3.ufs.sh"
    }]
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
