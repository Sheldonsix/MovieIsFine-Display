import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "movieisfine-images.053000.xyz",
      },
    ],
    // 禁用图片优化，直接使用远程图片（避免超时问题）
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
