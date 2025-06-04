"use client"

import { useState } from "react"
import { CheckCircle, Package, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import Image from "next/image"

interface CheckoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CheckoutDialog({ open, onOpenChange }: CheckoutDialogProps) {
  const { cart, getCartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const [orderGenerated, setOrderGenerated] = useState(false)
  const [orderNumber] = useState(() => Math.floor(Math.random() * 1000000) + 100000)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleConfirmOrder = () => {
    // Simular la generación del pedido
    setOrderGenerated(true)

    // Limpiar el carrito después de 2 segundos para dar tiempo a ver la confirmación
    setTimeout(() => {
      clearCart()
    }, 2000)
  }

  const handleClose = () => {
    setOrderGenerated(false)
    onOpenChange(false)
  }

  if (!user) {
    return null // Este diálogo no se debe mostrar si no hay usuario
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {!orderGenerated ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Confirmar pedido
              </DialogTitle>
              <DialogDescription>
                Revisa tu pedido antes de confirmar. Una vez confirmado, procederemos con la preparación.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Información del usuario */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Información de entrega</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="font-medium">Cliente:</span>
                      <span className="ml-2">{user.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">Email:</span>
                      <span className="ml-2">{user.email}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm text-muted-foreground">
                        La dirección de entrega se confirmará por WhatsApp
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Productos del pedido */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Productos del pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {formatPrice(item.price)} / {item.unit}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">x{item.quantity}</p>
                          <p className="text-sm font-bold">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatPrice(getCartTotal())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Envío:</span>
                      <span className="text-green-600">Gratis</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>{formatPrice(getCartTotal())}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Información de entrega */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Clock className="mr-2 h-5 w-5" />
                    Información de entrega
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p>
                      • <strong>Tiempo estimado:</strong> 24-48 horas
                    </p>
                    <p>
                      • <strong>Método de pago:</strong> Contraentrega (efectivo)
                    </p>
                    <p>
                      • <strong>Contacto:</strong> Te contactaremos por WhatsApp para confirmar la dirección
                    </p>
                    <p>
                      • <strong>Productos frescos:</strong> Garantizamos la frescura de todos nuestros productos
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Botones de acción */}
              <div className="flex gap-4">
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={handleConfirmOrder} className="flex-1 bg-green-600 hover:bg-green-700">
                  Confirmar pedido
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center text-green-600">
                <CheckCircle className="mr-2 h-6 w-6" />
                ¡Pedido confirmado!
              </DialogTitle>
              <DialogDescription>Tu pedido ha sido generado correctamente y será entregado pronto.</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Número de pedido */}
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">Número de pedido</h3>
                    <div className="text-2xl font-bold text-green-600">#{orderNumber}</div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Guarda este número para hacer seguimiento a tu pedido
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Resumen del pedido */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Resumen de tu pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 rounded overflow-hidden">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total pagado:</span>
                    <span className="text-green-600">{formatPrice(getCartTotal())}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Información de entrega */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">¿Qué sigue?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Badge className="bg-blue-100 text-blue-800 mt-1">1</Badge>
                      <div>
                        <p className="font-medium">Confirmación por WhatsApp</p>
                        <p className="text-sm text-muted-foreground">
                          Te contactaremos en los próximos 30 minutos para confirmar tu dirección de entrega
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge className="bg-yellow-100 text-yellow-800 mt-1">2</Badge>
                      <div>
                        <p className="font-medium">Preparación del pedido</p>
                        <p className="text-sm text-muted-foreground">
                          Seleccionaremos los productos más frescos para tu pedido
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge className="bg-green-100 text-green-800 mt-1">3</Badge>
                      <div>
                        <p className="font-medium">Entrega a domicilio</p>
                        <p className="text-sm text-muted-foreground">
                          Recibirás tu pedido en 24-48 horas. Pago contraentrega
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Botón de cerrar */}
              <Button onClick={handleClose} className="w-full bg-green-600 hover:bg-green-700">
                Continuar comprando
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
