// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '', // Leave empty for standard HTTPS port (443)
        // Correct pathname to allow all images under your Cloudinary cloud name
        pathname: '/dzpk8cfl0/**',
      },
    ],
  },
};

export default nextConfig;