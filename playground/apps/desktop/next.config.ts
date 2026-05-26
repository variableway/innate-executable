import type { NextConfig } from "next";

const basePath = process.env.NEXT_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "out",
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ["@innate/ui", "@innate/utils"],
  trailingSlash: true,
  staticPageGenerationTimeout: 300,
  ...(basePath
    ? { basePath, assetPrefix: basePath }
    : {}),
};

export default nextConfig;
