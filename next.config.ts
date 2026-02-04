import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // 这些库需要排除在 webpack 打包之外
  serverExternalPackages: ['sharp', 'xlsx'],
}

export default nextConfig
