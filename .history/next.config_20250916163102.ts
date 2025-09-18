/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    allowedDevOrigins: [
      'http://localhost:3000',
      'http://10.3.28.138:3000', // твой IP
    ],
  },
};

module.exports = nextConfig;
