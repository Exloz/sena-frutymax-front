"use client"

import { useState } from "react"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart, type CartProduct } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"
import { Product } from "@/types/api"

interface ProductQuantityProps {
  product: Product
}

export default function ProductQuantity({ product }: ProductQuantityProps) {
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const { toast } = useToast()

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  const handleAddToCart = () => {
    const cartProduct: CartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      imageUrl: product.imageUrl || "/placeholder.svg",
      category: product.category,
      quantity,
    }

    addToCart(cartProduct)

    toast({
      title: "Producto añadido",
      description: `${quantity} ${product.name} añadido al carrito`,
      duration: 3000,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Button variant="outline" size="icon" onClick={decreaseQuantity} disabled={quantity <= 1}>
          -
        </Button>
        <span className="w-12 text-center">{quantity}</span>
        <Button variant="outline" size="icon" onClick={increaseQuantity}>
          +
        </Button>
      </div>

      <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleAddToCart}>
        <ShoppingCart className="mr-2 h-5 w-5" />
        Añadir al carrito
      </Button>
    </div>
  )
}
