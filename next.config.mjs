/** @type {import('next').NextConfig} */

let userConfig = undefined;

const nextConfig = {
  // Configuración para exportación estática
  output: 'export',
  trailingSlash: true,
  
  // Configuración experimental
  experimental: {
    // Habilita la generación estática incremental
    isr: true,
    // Habilita la generación de mapas de fuente en producción
    serverComponentsExternalPackages: ['sharp', 'onnxruntime-node'],
    // Configuraciones adicionales de Webpack
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['exloz.site', 'api.frutymax.exloz.site'],
    path: '/_next/image/',
  },
  // Deshabilitar la optimización de imágenes ya que no funciona con exportación estática
  // Las imágenes se servirán directamente desde el directorio público
  // Asegúrate de que las imágenes estén en la carpeta public
};

// Configuración para generación estática
export const dynamic = 'force-static';
export const dynamicParams = true;
// Configuración de revalidación
export const revalidate = 60; // Revalidar cada 60 segundos

// Configuración para manejar rutas dinámicas
export const config = {
  // Esto le dice a Next.js que estas páginas pueden ser generadas estáticamente
  // pero también pueden ser servidas dinámicamente si es necesario
  runtime: 'nodejs',
  regions: ['iad1'],
  supportsResponseStreaming: true,
};

mergeConfig(nextConfig, userConfig);

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) return nextConfig;

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      };
    } else {
      nextConfig[key] = userConfig[key];
    }
  }
  
  return nextConfig;
}

export default nextConfig;
