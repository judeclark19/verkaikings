const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: false,
  workboxOptions: {
    disableDevLogs: true,
    globPatterns: ["**/*.{ico,png,svg,webmanifest,json}"]
  }
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true
  },
  images: {
    domains: ["flagcdn.com"]
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/, // Match all `.svg` files
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgo: false, // Disable SVGO optimizations
            titleProp: true, // Pass title as a prop
            ref: true // Allow forward refs
          }
        }
      ]
    });
    return config;
  }
};

module.exports = withPWA(nextConfig);
