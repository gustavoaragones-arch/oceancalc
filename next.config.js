/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  webpack: (config) => {
    config.cache = false;
    return config;
  },
};

module.exports = nextConfig;
