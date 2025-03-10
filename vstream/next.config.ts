/** @type {import('next').NextConfig} */
const nextConfig = {
   
  images: {
    unoptimized: true,
    domains: ["i.ytimg.com"], // Add YouTube image domain here
  },
  reactStrictMode: false
};

module.exports = nextConfig;
