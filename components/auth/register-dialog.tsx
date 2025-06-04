"use client"

import type React from "react"

import { useState } from "react"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

interface RegisterDialogProps {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function RegisterDialog({ children, open, onOpenChange }: RegisterDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { register, isLoading } = useAuth()
  const { toast } = useToast()

  // Usar props si están disponibles, sino usar estado interno
  const isOpen = open !== undefined ? open : internalOpen
  const setIsOpen = onOpenChange !== undefined ? onOpenChange : setInternalOpen

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      })
      return
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive",
      })
      return
    }

    const result = await register({ name, email, password, password_confirmation: confirmPassword })

    if (result.success) {
      toast({
        title: "¡Registro exitoso!",
        description: "Tu cuenta ha sido creada correctamente",
      })
      setIsOpen(false)
      setName("")
      setEmail("")
      setPassword("")
      setConfirmPassword("")
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      })
    }
  }

  const dialogContent = (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Crear cuenta</DialogTitle>
        <DialogDescription>Regístrate para comenzar a comprar en FrutyMax</DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre completo</Label>
          <Input
            id="name"
            type="text"
            placeholder="Tu nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-6 w-6"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Repite tu contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creando cuenta...
            </>
          ) : (
            "Crear cuenta"
          )}
        </Button>
      </form>

      <p className="text-xs text-muted-foreground text-center mt-4">
        Al registrarte, aceptas nuestros términos de servicio y política de privacidad.
      </p>
    </DialogContent>
  )

  // Si hay children, usar como trigger
  if (children) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        {dialogContent}
      </Dialog>
    )
  }

  // Si no hay children, usar como diálogo controlado
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {dialogContent}
    </Dialog>
  )
}
