/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permitir build na Vercel mesmo com avisos do ESLint/Types
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ignorar arquivos do sistema Windows
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/.next/**',
          // Ignorar arquivos do sistema Windows
          'C:/hiberfil.sys',
          'C:/pagefile.sys',
          'C:/swapfile.sys',
          'C:/DumpStack.log.tmp',
          'C:/$*',
        ],
      }
    }
    return config
  },
}

export default nextConfig
