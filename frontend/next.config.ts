import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produce a self-contained server bundle for a small Docker image.
  output: "standalone",
  // Pin the workspace root so a stray lockfile in a parent folder doesn't
  // confuse Turbopack's root detection.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
