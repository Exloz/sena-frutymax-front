"use client"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: number
  name: string
  price: number
  unit: string
  imageUrl: string
  category: string
}

export default function ProductCard({ product }: { product: Product }) {
  const { cart, addToCart, updateQuantity } = useCart()
  const { toast } = useToast()

  // Buscar si el producto ya está en el carrito
  const cartItem = cart.find((item) => item.id === product.id)
  const quantity = cartItem ? cartItem.quantity : 0

  const handleAddToCart = () => {
    addToCart({
      ...product,
      imageUrl: product.imageUrl || 'https://placehold.co/800?text=FrutyMax&font=roboto',
      quantity: 1,
    })

    toast({
      title: "Producto añadido",
      description: `${product.name} añadido al carrito`,
      duration: 3000,
    })
  }

  const increaseQuantity = () => {
    updateQuantity(product.id, quantity + 1)
  }

  const decreaseQuantity = () => {
    updateQuantity(product.id, quantity - 1)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg h-full flex flex-col">
      <Link href={`/producto/${product.id}`} className="block relative h-48 bg-gray-100">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onError={({ currentTarget }) => {
            currentTarget.src = "https://placehold.co/800?text=FrutyMax&font=roboto"
          }}
        />
        <Badge className="absolute top-2 right-2 bg-amber-500">
          {product.category}
        </Badge>
      </Link>
      <CardContent className="p-4 flex-1 flex flex-col">
        <Link href={`/producto/${product.id}`} className="block">
          <h3 className="font-semibold text-lg hover:underline">{product.name}</h3>
        </Link>
        <div className="flex justify-between items-center mt-2">
          <div>
            <p className="text-lg font-bold">{formatPrice(product.price)}</p>
            <p className="text-xs text-muted-foreground">({product.unit})</p>
          </div>

          {quantity === 0 ? (
            <Button onClick={handleAddToCart} className="bg-green-600 hover:bg-green-700">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Agregar
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={decreaseQuantity}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-6 text-center">{quantity}</span>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={increaseQuantity}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
