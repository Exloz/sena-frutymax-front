"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { supplierService } from "@/services/supplier-service"
import type { Supplier, CreateSupplierDto, UpdateSupplierDto } from "@/types/api"

interface SupplierFormProps {
  supplier?: Supplier
  onSuccess: () => void
  onCancel: () => void
}

export default function SupplierForm({ supplier, onSuccess, onCancel }: SupplierFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateSupplierDto>({
    defaultValues: supplier
      ? {
          name: supplier.name,
          email: supplier.email,
          phone: supplier.phone,
          address: supplier.address,
          city: supplier.city,
          country: supplier.country,
          contactPerson: supplier.contactPerson,
        }
      : {
          country: "Colombia",
        },
  })

  const onSubmit = async (data: CreateSupplierDto) => {
    setIsLoading(true)
    try {
      if (supplier) {
        // Actualizar proveedor existente
        await supplierService.updateSupplier(supplier.id, data as UpdateSupplierDto)
        toast({
          title: "Éxito",
          description: "Proveedor actualizado correctamente",
        })
      } else {
        // Crear nuevo proveedor
        await supplierService.createSupplier(data)
        toast({
          title: "Éxito",
          description: "Proveedor creado correctamente",
        })
      }

      onSuccess()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error inesperado",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información de la empresa */}
        <Card>
          <CardHeader>
            <CardTitle>Información de la empresa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre de la empresa *</Label>
              <Input
                id="name"
                {...register("name", { required: "El nombre es requerido" })}
                placeholder="Ej: Frutas del Valle S.A.S"
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="email">Email corporativo *</Label>
              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: "El email es requerido",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email inválido",
                  },
                })}
                placeholder="contacto@empresa.com"
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <Label htmlFor="phone">Teléfono *</Label>
              <Input
                id="phone"
                {...register("phone", { required: "El teléfono es requerido" })}
                placeholder="+57 300 123 4567"
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
            </div>

            <div>
              <Label htmlFor="contactPerson">Persona de contacto *</Label>
              <Input
                id="contactPerson"
                {...register("contactPerson", { required: "La persona de contacto es requerida" })}
                placeholder="Nombre del representante"
              />
              {errors.contactPerson && <p className="text-sm text-red-500">{errors.contactPerson.message}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Información de ubicación */}
        <Card>
          <CardHeader>
            <CardTitle>Información de ubicación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Dirección *</Label>
              <Input
                id="address"
                {...register("address", { required: "La dirección es requerida" })}
                placeholder="Calle 123 #45-67"
              />
              {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
            </div>

            <div>
              <Label htmlFor="city">Ciudad *</Label>
              <Input id="city" {...register("city", { required: "La ciudad es requerida" })} placeholder="Ej: Cali" />
              {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
            </div>

            <div>
              <Label htmlFor="country">País *</Label>
              <Select
                onValueChange={(value) => setValue("country", value)}
                defaultValue={supplier?.country || "Colombia"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar país" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Colombia">Colombia</SelectItem>
                  <SelectItem value="Ecuador">Ecuador</SelectItem>
                  <SelectItem value="Perú">Perú</SelectItem>
                  <SelectItem value="Venezuela">Venezuela</SelectItem>
                  <SelectItem value="Brasil">Brasil</SelectItem>
                  <SelectItem value="Argentina">Argentina</SelectItem>
                  <SelectItem value="Chile">Chile</SelectItem>
                  <SelectItem value="México">México</SelectItem>
                </SelectContent>
              </Select>
              {errors.country && <p className="text-sm text-red-500">{errors.country.message}</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {supplier ? "Actualizando..." : "Creando..."}
            </>
          ) : supplier ? (
            "Actualizar proveedor"
          ) : (
            "Crear proveedor"
          )}
        </Button>
      </div>
    </form>
  )
}
