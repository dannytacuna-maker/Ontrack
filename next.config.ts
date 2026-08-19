import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Without this list Next clamps every request to q=75, ignoring the
    // quality set on each Image.
    qualities: [75, 85, 88, 90, 92, 95, 100],
  },
};

export default nextConfig;
