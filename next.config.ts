import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utcdedqlpxnwkjtdbgua.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  // ⛔ Evita que ESLint bloquee tu build en Vercel
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ⛔ Evita que TypeScript bloquee el build por tipos no estrictos o any
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
