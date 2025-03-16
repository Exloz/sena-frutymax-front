"use client"

import { useState } from "react"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: number
  name: string
  price: number
  unit: string
  image: string
  category: string
}

export default function ProductQuantity({ product }: { product: Product }) {
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
    addToCart({
      ...product,
      quantity,
    })

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

