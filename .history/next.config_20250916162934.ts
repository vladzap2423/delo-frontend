/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    allowedDevOrigins: [
      'http://10.3.28.138:3000', // твой IP
      'http://localhost:3000',   // оставь и localhost
    ],
  },
};

module.exports = nextConfig;
