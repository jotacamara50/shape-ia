/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Needed for @react-pdf/renderer in app router (uses React class components)
    serverComponentsExternalPackages: ["@react-pdf/renderer"],
  },
  output: "standalone",
}

module.exports = nextConfig
