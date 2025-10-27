import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  transpilePackages: ['@emagrecer/control', '@emagrecer/storage'],
  serverExternalPackages: ['typeorm'],
  experimental: {
    authInterrupts: true,
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
