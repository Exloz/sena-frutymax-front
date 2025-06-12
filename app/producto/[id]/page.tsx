import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Star, Truck, ShieldCheck, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Header from "@/components/header"
import ProductQuantity from "@/components/product-quantity"
import RelatedProducts from "@/components/related-products"
import { productService } from "@/services/product-service"
import type { Product } from "@/types/api"

// Esta función le dice a Next.js qué páginas generar estáticamente
export async function generateStaticParams() {
  try {
    console.log('🔍 Obteniendo productos para generación estática...');
    const API_BASE_URL = "https://api.frutymax.exloz.site/api"
    
    // 1. Primero intentamos obtener TODOS los productos activos
    const response = await fetch(`${API_BASE_URL}/products?status=active&limit=500`);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success || !data.data) {
      console.error('❌ Respuesta inesperada de la API:', data);
      throw new Error('Formato de respuesta inesperado');
    }
    
    // 2. Procesar los items de la respuesta
    const items = Array.isArray(data.data) ? data.data : data.data.items || [];
    
    if (items.length === 0) {
      console.warn('⚠️ No se encontraron productos activos');
    } else {
      console.log(`✅ Se encontraron ${items.length} productos activos`);
    }
    
    // 3. Extraer IDs únicos
    const productIds = new Set<string>();
    
    // 4. Asegurarnos de que los IDs sean válidos
    items.forEach((product: any) => {
      const id = product?.id?.toString();
      if (id && !isNaN(Number(id))) {
        productIds.add(id);
      }
    });
    
    // 5. Asegurarnos de que los IDs importantes estén incluidos
    const REQUIRED_IDS = ['1', '4']; // IDs que deben estar siempre presentes
    REQUIRED_IDS.forEach(id => productIds.add(id));
    
    console.log(`📦 Generando ${productIds.size} páginas de productos (incluyendo IDs requeridos)`);
    
    // 6. Convertir a array de objetos { id: string }
    const params = Array.from(productIds).map(id => ({ id }));
    
    // 7. Log de los primeros 5 IDs para depuración
    console.log('📋 Primeros IDs:', params.slice(0, 5).map(p => p.id).join(', '), 
                params.length > 5 ? `... (${params.length - 5} más)` : '');
    
    return params;
  } catch (error) {
    console.error('Error generando rutas estáticas para productos:', error)
    return [{ id: '1' }]
  }
}

// Esto indica a Next.js que solo genere las páginas definidas en generateStaticParams
export const dynamicParams = false

async function getProduct(id: number): Promise<Product> {
  try {
    const API_BASE_URL = "https://api.frutymax.exloz.site/api"
    const response = await fetch(`${API_BASE_URL}/products/${id}`)
    
    if (!response.ok) {
      console.error('Error al obtener el producto:', response.statusText)
      notFound()
    }
    
    const data = await response.json()
    
    if (!data.success || !data.data) {
      console.error('Respuesta inesperada de la API:', data)
      notFound()
    }
    
    return data.data
  } catch (error) {
    console.error('Error fetching product:', error)
    notFound()
  }
}

async function getRelatedProducts(category: string, currentId: number): Promise<Product[]> {
  try {
    const response = await productService.getProducts({ 
      category, 
      limit: 4,
      status: 'active' 
    })
    
    if (!response.success || !response.data) {
      return []
    }
    
    // Filtrar el producto actual y limitar a 4 productos
    return (response.data as unknown as Product[])
      .filter((p: Product) => p.id !== currentId)
      .slice(0, 4)
  } catch (error) {
    console.error('Error fetching related products:', error)
    return []
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const productId = Number.parseInt(params.id)
  
  if (isNaN(productId)) {
    notFound()
  }

  const product = await getProduct(productId)
  console.log(product)
  const relatedProducts = await getRelatedProducts(product.category, product.id)
  
  const productWithDefaults = {
    ...product,
    imageUrl: product.image || "https://placehold.co/800?text=FrutyMax&font=roboto",
  }


  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Volver a productos
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Imagen del producto */}
          <div className="relative">
            <div className="sticky top-20">
              <div className="relative aspect-square overflow-hidden rounded-lg border bg-white">
                <Badge className="absolute top-3 left-3 z-10 bg-amber-500">
                  {productWithDefaults.category}
                </Badge>
                <Image
                  src={productWithDefaults.imageUrl}
                  alt={productWithDefaults.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>

          {/* Detalles del producto */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold">{productWithDefaults.name}</h1>

            <div className="flex items-center mt-2 mb-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className="h-5 w-5 text-muted-foreground" 
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-muted-foreground">
                (0 reseñas)
              </span>
            </div>

            <div className="mt-2 mb-6">
              <div className="text-3xl font-bold">{formatPrice(productWithDefaults.price)}</div>
              <div className="text-sm text-muted-foreground">Precio por {productWithDefaults.unit}</div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4 mb-6">
              <p>{productWithDefaults.description}</p>
              {productWithDefaults.origin && (
                <p className="text-sm text-muted-foreground">Origen: {productWithDefaults.origin}</p>
              )}
              <div className={`flex items-center text-sm ${
                productWithDefaults.stock > 10 ? 'text-green-600' : productWithDefaults.stock > 0 ? 'text-amber-500' : 'text-red-600'
              }`}>
                <ShieldCheck className="mr-1 h-4 w-4" />
                <span>
                  {productWithDefaults.stock > 0 
                    ? `En stock: ${productWithDefaults.stock} disponible${productWithDefaults.stock !== 1 ? 's' : ''}`
                    : 'Agotado'}
                </span>
              </div>
            </div>

            <Separator className="my-6" />

            <ProductQuantity product={productWithDefaults} />

            <div className="mt-8 space-y-4">
              <div className="flex items-center">
                <Truck className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>Envío gratuito en pedidos superiores a $50.000</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>Entrega estimada: 24-48 horas</span>
              </div>
            </div>

            <Separator className="my-6" />

            <div>
              <h3 className="font-semibold mb-2">Información nutricional</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {product.nutritionalInfo && (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Calorías</p>
                      <p className="text-sm text-muted-foreground">{product.nutritionalInfo.calories || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Proteínas</p>
                      <p className="text-sm text-muted-foreground">{product.nutritionalInfo.protein || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Carbohidratos</p>
                      <p className="text-sm text-muted-foreground">{product.nutritionalInfo.carbs || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Grasas</p>
                      <p className="text-sm text-muted-foreground">{product.nutritionalInfo.fat || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Fibra</p>
                      <p className="text-sm text-muted-foreground">{product.nutritionalInfo.fiber || 'N/A'}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Productos relacionados */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Productos relacionados</h2>
          <RelatedProducts products={relatedProducts} />
        </div>
      </div>
    </main>
  )
}
