const path = require('path');
const dotenv = require('dotenv');

// Načtení .env souboru z kořenového adresáře projektu
dotenv.config({ path: path.resolve(__dirname, '../.env') });

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    AUTH_REDIRECT_URL: process.env.AUTH_REDIRECT_URL,
    ENABLE_REALTIME: process.env.ENABLE_REALTIME || 'false',
    ENABLE_EDGE_FUNCTIONS: process.env.ENABLE_EDGE_FUNCTIONS || 'false',
    DEBUG: process.env.DEBUG || 'false',
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/auth/login',
        permanent: true,
      },
      {
        source: '/patients/:id/edit',
        destination: '/patients/:id',
        permanent: false,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ]
  },
}

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
