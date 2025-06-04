"use client"

import { useState } from "react"
import { ShoppingCart, User, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import LoginDialog from "@/components/auth/login-dialog"
import RegisterDialog from "@/components/auth/register-dialog"

interface AuthRequiredDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AuthRequiredDialog({ open, onOpenChange }: AuthRequiredDialogProps) {
  const [loginOpen, setLoginOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)

  const handleLoginClick = () => {
    onOpenChange(false)
    setLoginOpen(true)
  }

  const handleRegisterClick = () => {
    onOpenChange(false)
    setRegisterOpen(true)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Inicia sesión para continuar
            </DialogTitle>
            <DialogDescription>Para proceder con tu pedido, necesitas tener una cuenta en FrutyMax</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-4">
                <div className="text-center">
                  <h3 className="font-semibold text-green-800 mb-2">¿Por qué necesitas una cuenta?</h3>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Seguimiento de tus pedidos</li>
                    <li>• Historial de compras</li>
                    <li>• Ofertas personalizadas</li>
                    <li>• Proceso de compra más rápido</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-3">
              <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={handleLoginClick}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Ya tengo cuenta
                  </CardTitle>
                  <CardDescription className="text-sm">Inicia sesión con tu email y contraseña</CardDescription>
                </CardHeader>
              </Card>

              <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={handleRegisterClick}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Crear cuenta nueva
                  </CardTitle>
                  <CardDescription className="text-sm">Regístrate gratis en menos de 2 minutos</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="text-center">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full">
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogos de autenticación */}
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
      <RegisterDialog open={registerOpen} onOpenChange={setRegisterOpen} />
    </>
  )
}
