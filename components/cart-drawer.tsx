"use client"

import { useState } from "react"
import { ShoppingCart, X, Trash2, Plus, Minus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import CheckoutDialog from "@/components/checkout-dialog"
import AuthRequiredDialog from "@/components/auth-required-dialog"

export default function CartDrawer() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount, clearCart } = useCart()
  const { user } = useAuth()
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [authRequiredOpen, setAuthRequiredOpen] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleProceedToCheckout = () => {
    if (user) {
      setCheckoutOpen(true)
    } else {
      setAuthRequiredOpen(true)
    }
  }

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="relative text-white hover:bg-green-600">
            <ShoppingCart className="h-5 w-5" />
            {getCartCount() > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-amber-500 text-white">{getCartCount()}</Badge>
            )}
            <span className="sr-only">Carrito</span>
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-md flex flex-col">
          <SheetHeader>
            <SheetTitle className="flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Carrito de compras
              {getCartCount() > 0 && (
                <Badge variant="outline" className="ml-2">
                  {getCartCount()} {getCartCount() === 1 ? "producto" : "productos"}
                </Badge>
              )}
            </SheetTitle>
          </SheetHeader>

          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 py-12">
              <div className="rounded-full bg-muted p-6 mb-4">
                <ShoppingCart className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Tu carrito está vacío</h3>
              <p className="text-sm text-muted-foreground text-center mb-6">
                Parece que aún no has agregado productos a tu carrito
              </p>
              <SheetClose asChild>
                <Button asChild>
                  <Link href="/">Explorar productos</Link>
                </Button>
              </SheetClose>
            </div>
          ) : (
            <>
              <div className="flex justify-end mb-2">
                <Button variant="ghost" size="sm" className="text-sm text-muted-foreground" onClick={clearCart}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Vaciar carrito
                </Button>
              </div>

              <div className="flex-1 overflow-auto">
                <ul className="space-y-4">
                  {cart.map((item) => (
                    <li key={item.id} className="flex gap-4 py-2">
                      <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                        <Image src={item.imageUrl || "https://placehold.co/800?text=FrutyMax&font=roboto"} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/producto/${item.id}`} className="font-medium hover:underline">
                          {item.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(item.price)} / {item.unit}
                        </p>
                        <div className="flex items-center mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 mt-2 text-muted-foreground"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <Separator className="my-4" />
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(getCartTotal())}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-muted-foreground">Envío</span>
                  <span className="font-medium">Calculado al finalizar</span>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between mb-6">
                  <span className="text-lg font-medium">Total</span>
                  <span className="text-lg font-bold">{formatPrice(getCartTotal())}</span>
                </div>
                <SheetFooter>
                  <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleProceedToCheckout}>
                    Proceder al pago
                  </Button>
                </SheetFooter>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Diálogos */}
      <CheckoutDialog open={checkoutOpen} onOpenChange={setCheckoutOpen} />
      <AuthRequiredDialog open={authRequiredOpen} onOpenChange={setAuthRequiredOpen} />
    </>
  )
}
