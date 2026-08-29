import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * The Indonesian summary used to live at its own address, before the whole
   * site had a second language. That address is in documents we cannot edit,
   * so it forwards to the full Indonesian audit rather than turning into a 404
   * for whoever follows it.
   */
  async redirects() {
    return [
      { source: "/audit/ringkasan", destination: "/id/audit", permanent: true },
    ];
  },
};

export default nextConfig;
