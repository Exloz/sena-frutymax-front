/** @type {import('next').NextConfig} */

let userConfig = undefined;

const nextConfig = {
  // Configuración para exportación estática
  output: 'export',
  trailingSlash: true,
  
  // Configuración para manejar rutas dinámicas
  async exportPathMap() {
    const paths = {
      '/': { page: '/' },
    };
    
    try {
      // Obtener productos para generar rutas estáticas
      const API_BASE_URL = "https://api.frutymax.exloz.site/api";
      const response = await fetch(`${API_BASE_URL}/products?status=active&limit=500`);
      
      if (response.ok) {
        const data = await response.json();
        const items = Array.isArray(data.data) ? data.data : data.data?.items || [];
        
        // Agregar rutas de productos
        items.forEach((product) => {
          if (product?.id) {
            paths[`/producto/${product.id}/`] = { page: '/producto/[id]', query: { id: product.id.toString() } };
          }
        });
      }
    } catch (error) {
      console.error('Error generando rutas estáticas:', error);
    }
    
    return paths;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['exloz.site'],
    path: '/_next/image/',
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
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
