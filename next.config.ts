const withNextIntl = require('next-intl/plugin')(
  './next-intl.config.ts'
);

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = withNextIntl(nextConfig);









































// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   typescript: {
//     // Ignore TypeScript errors during build
//     ignoreBuildErrors: true,
//   },
//   eslint: {
//     // Optionally, ignore ESLint errors during build (we'll handle ESLint separately)
//     ignoreDuringBuilds: false,
//   },
// };

// module.exports = nextConfig;