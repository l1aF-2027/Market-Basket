import { NextConfig } from "next";

let userConfig: Partial<NextConfig> | undefined;

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      "cdn.pixabay.com",
      "images.unsplash.com",
      "raw.githubusercontent.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        {
          key: "X-Robots-Tag",
          value: "index, follow",
        },
      ],
    },
  ],
};

mergeConfig(nextConfig, userConfig);

function mergeConfig(
  baseConfig: NextConfig,
  userConfig?: Partial<NextConfig>
): void {
  if (!userConfig) {
    return;
  }

  for (const key in userConfig) {
    if (
      typeof baseConfig[key as keyof NextConfig] === "object" &&
      !Array.isArray(baseConfig[key as keyof NextConfig])
    ) {
      baseConfig[key as keyof NextConfig] = {
        ...baseConfig[key as keyof NextConfig],
        ...userConfig[key as keyof NextConfig],
      };
    } else {
      baseConfig[key as keyof NextConfig] = userConfig[
        key as keyof NextConfig
      ] as any;
    }
  }
}

export default nextConfig;
