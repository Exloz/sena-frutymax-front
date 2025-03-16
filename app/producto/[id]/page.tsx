import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Star, Truck, ShieldCheck, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Header from "@/components/header"
import ProductQuantity from "@/components/product-quantity"
import RelatedProducts from "@/components/related-products"

// Datos de ejemplo para los productos (en un proyecto real, esto vendría de una base de datos)
const products = [
  {
    id: 1,
    name: "Banano",
    price: 920,
    unit: "und",
    image: "/placeholder.svg?height=600&width=600",
    category: "frutas",
    description:
      "Banano fresco y maduro, rico en potasio y perfecto para consumir como snack o en batidos. Nuestros bananos son cultivados localmente por agricultores comprometidos con prácticas sostenibles.",
    nutritionalInfo: {
      calories: 105,
      protein: "1.3g",
      carbs: "27g",
      fat: "0.4g",
      fiber: "3.1g",
    },
    origin: "Valle del Cauca, Colombia",
    stock: 50,
  },
  {
    id: 2,
    name: "Cebolla Blanca",
    price: 1340,
    unit: "und",
    image: "/placeholder.svg?height=600&width=600",
    category: "verduras",
    description:
      "Cebolla blanca fresca, ideal para dar sabor a tus comidas. Su sabor suave la hace perfecta para ensaladas y platos crudos. Cultivada por agricultores locales comprometidos con la calidad.",
    nutritionalInfo: {
      calories: 40,
      protein: "1.1g",
      carbs: "9.3g",
      fat: "0.1g",
      fiber: "1.7g",
    },
    origin: "Boyacá, Colombia",
    stock: 35,
  },
  {
    id: 3,
    name: "Aguacate Hass",
    price: 1740,
    unit: "und",
    image: "/placeholder.svg?height=600&width=600",
    category: "frutas",
    description:
      "Aguacate Hass de la mejor calidad, cremoso y con un sabor excepcional. Rico en grasas saludables y perfecto para guacamole, ensaladas o para untar en pan. Cultivado con prácticas sostenibles.",
    nutritionalInfo: {
      calories: 240,
      protein: "3g",
      carbs: "12g",
      fat: "22g",
      fiber: "10g",
    },
    origin: "Antioquia, Colombia",
    stock: 25,
  },
  {
    id: 4,
    name: "Pimentón",
    price: 1900,
    unit: "und",
    image: "/placeholder.svg?height=600&width=600",
    category: "verduras",
    description:
      "Pimentón fresco y crujiente, ideal para dar color y sabor a tus platos. Rico en vitamina C y antioxidantes. Cultivado por agricultores locales comprometidos con prácticas sostenibles.",
    nutritionalInfo: {
      calories: 30,
      protein: "1g",
      carbs: "6g",
      fat: "0.3g",
      fiber: "2.1g",
    },
    origin: "Cundinamarca, Colombia",
    stock: 40,
  },
  {
    id: 5,
    name: "Manzana Roja",
    price: 1500,
    unit: "und",
    image: "/placeholder.svg?height=600&width=600",
    category: "frutas",
    description:
      "Manzana roja dulce y crujiente, perfecta como snack saludable o para postres. Rica en fibra y antioxidantes. Nuestras manzanas son seleccionadas cuidadosamente para garantizar la mejor calidad.",
    nutritionalInfo: {
      calories: 95,
      protein: "0.5g",
      carbs: "25g",
      fat: "0.3g",
      fiber: "4.4g",
    },
    origin: "Boyacá, Colombia",
    stock: 45,
  },
]

export default function ProductPage({ params }: { params: { id: string } }) {
  const productId = Number.parseInt(params.id)
  const product = products.find((p) => p.id === productId)

  if (!product) {
    notFound()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  // Filtrar productos relacionados (misma categoría, excluyendo el actual)
  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

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
                  {product.category === "frutas" ? "Fruta" : "Verdura"}
                </Badge>
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Detalles del producto */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold">{product.name}</h1>

            <div className="flex items-center mt-2 mb-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                <Star className="h-5 w-5 text-muted-foreground" />
              </div>
              <span className="ml-2 text-sm text-muted-foreground">(24 reseñas)</span>
            </div>

            <div className="mt-2 mb-6">
              <div className="text-3xl font-bold">{formatPrice(product.price)}</div>
              <div className="text-sm text-muted-foreground">Precio por {product.unit}</div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4 mb-6">
              <p>{product.description}</p>
              <p className="text-sm text-muted-foreground">Origen: {product.origin}</p>
              <div className="flex items-center text-sm text-green-600">
                <ShieldCheck className="mr-1 h-4 w-4" />
                <span>En stock: {product.stock} disponibles</span>
              </div>
            </div>

            <Separator className="my-6" />

            <ProductQuantity product={product} />

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
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Calorías:</span>
                  <span>{product.nutritionalInfo.calories} kcal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Proteínas:</span>
                  <span>{product.nutritionalInfo.protein}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Carbohidratos:</span>
                  <span>{product.nutritionalInfo.carbs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Grasas:</span>
                  <span>{product.nutritionalInfo.fat}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fibra:</span>
                  <span>{product.nutritionalInfo.fiber}</span>
                </div>
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

