/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
    images: {
        domains: [
          'pbs.twimg.com',
          'abs.twimg.com',
          'twimg.com',
          'github.com'
        ],
        // Or use the newer remotePatterns (recommended)
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'pbs.twimg.com',
          },
          {
            protocol: 'https',
            hostname: 'abs.twimg.com',
          },
          {
            protocol: 'https',
            hostname: 'avatars.githubusercontent.com',
          },
        ],
      },
};

export default config;
