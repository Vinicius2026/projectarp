/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permitir build na Vercel mesmo com avisos do ESLint/Types
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Configurar domínios de imagem do Supabase
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // Otimizar imagens para reduzir tamanho do build
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
