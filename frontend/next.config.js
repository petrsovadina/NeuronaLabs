const path = require('path');
const dotenv = require('dotenv');

// Načtení .env souboru z kořenového adresáře projektu
dotenv.config({ path: path.resolve(__dirname, '../.env') });

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true,
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
    optimizePackageImports: ['@radix-ui', 'lucide-react'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    domains: [
      'localhost',
      process.env.NEXT_PUBLIC_SUPABASE_URL,
    ],
  },
  reactStrictMode: true,
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
      {
        source: '/auth/callback',
        has: [
          {
            type: 'query',
            key: 'error',
          },
        ],
        permanent: false,
        destination: '/auth/login?error=:error',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ];
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': __dirname,
    };
    config.experiments = { ...config.experiments, topLevelAwait: true };
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
