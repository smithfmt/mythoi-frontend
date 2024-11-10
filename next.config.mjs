/** @type {import('next').NextConfig} */
// next.config.js
const nextConfig =  {
    async rewrites() {
      return [
        {
          source: '/api/socket',
          destination: '/api/socket-init',
        },
      ];
    },
  };
  
export default nextConfig;
