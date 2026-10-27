import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // album art from Apple's iTunes API (is1-ssl.mzstatic.com ... is5-ssl.mzstatic.com)
      { protocol: "https", hostname: "**.mzstatic.com", pathname: "/image/**" },
    ],
  },
};

export default nextConfig;
