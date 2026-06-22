import type { NextConfig } from 'next'
import { API_URL } from './lib/apiConfig'

function getApiHostname(): string {
  try {
    return new URL(API_URL).hostname
  } catch {
    return 'stork-helpers-api.onrender.com'
  }
}

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ftp.goit.study',
      },
      {
        protocol: 'https',
        hostname: getApiHostname(),
      },
      {
        protocol: 'https',
        hostname: '**.onrender.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
}

export default nextConfig
