import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    allowedDevOrigins: [
      'http://10.3.28.138:3000', // твой IP
      'http://localhost:3000',   // оставь и localhost
    ],
  },/
};

export default nextConfig;
