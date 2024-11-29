const path = require('path');
const dotenv = require('dotenv');

// Načtení .env souboru z kořenového adresáře projektu
dotenv.config({ path: path.resolve(__dirname, '../.env') });

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_APPLICATIONINSIGHTS_CONNECTION_STRING:
      process.env.NEXT_PUBLIC_APPLICATIONINSIGHTS_CONNECTION_STRING,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

// Add Sentry configuration if DSN is provided
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  // Importing @sentry/nextjs configures the SDK automatically
  const { withSentryConfig } = require('@sentry/nextjs');

  module.exports = withSentryConfig(
    nextConfig,
    {
      // Additional Sentry configuration options
      silent: true,
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
    },
    {
      // Upload source maps to Sentry
      widenClientFileUpload: true,
      transpileClientSDK: true,
      tunnelRoute: '/monitoring',
      hideSourceMaps: true,
    }
  );
} else {
  module.exports = nextConfig;
}
