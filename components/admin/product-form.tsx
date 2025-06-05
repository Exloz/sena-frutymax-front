"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { productService } from "@/services/product-service"
import { supplierService } from "@/services/supplier-service"
import type { Product, CreateProductDto, Supplier } from "@/types/api"
import Image from "next/image"

interface ProductFormProps {
  product?: Product
  onSuccess: () => void
  onCancel: () => void
}

export default function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [imageUrl, setImageUrl] = useState<string>(product?.imageUrl || '')
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateProductDto>({
    defaultValues: product
      ? {
          name: product.name,
          description: product.description,
          price: product.price,
          unit: product.unit,
          category: product.category,
          stock: product.stock,
          supplier_id: product.supplier_id,
          origin: product.origin,
          nutritionalInfo: product.nutritionalInfo,
        }
      : undefined,
  })

  // Cargar proveedores
  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        const response = await supplierService.getSuppliers({ status: true })
        setSuppliers(response.data)
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudieron cargar los proveedores",
          variant: "destructive",
        })
      }
    }
    loadSuppliers()
  }, [toast])

  // Manejar cambio en la URL de la imagen
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setImageUrl(url)
  }

  // Limpiar la URL de la imagen
  const handleClearImage = () => {
    setImageUrl('')
  }

  // Enviar el formulario
  const onSubmit = async (data: CreateProductDto) => {
    setIsLoading(true)
    try {
      const productData = {
        ...data,
        imageUrl: imageUrl || undefined
      }

      if (product) {
        // Actualizar producto existente
        await productService.updateProduct(product.id, productData)
        toast({
          title: "Producto actualizado",
          description: "El producto se ha actualizado correctamente.",
        })
      } else {
        // Crear nuevo producto
        await productService.createProduct(productData)
        toast({
          title: "Producto creado",
          description: "El producto se ha creado correctamente.",
        })
      }
      onSuccess()
    } catch (error) {
      console.error("Error al guardar el producto:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar el producto. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información básica */}
        <Card>
          <CardHeader>
            <CardTitle>Información básica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre del producto *</Label>
              <Input
                id="name"
                {...register("name", { required: "El nombre es requerido" })}
                placeholder="Ej: Banano orgánico"
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Descripción detallada del producto"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Precio *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register("price", {
                    required: "El precio es requerido",
                    min: { value: 0, message: "El precio debe ser mayor a 0" },
                  })}
                  placeholder="0.00"
                />
                {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
              </div>

              <div>
                <Label htmlFor="unit">Unidad *</Label>
                <Select onValueChange={(value) => setValue("unit", value)} defaultValue={product?.unit}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar unidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="und">Unidad</SelectItem>
                    <SelectItem value="kg">Kilogramo</SelectItem>
                    <SelectItem value="g">Gramo</SelectItem>
                    <SelectItem value="lb">Libra</SelectItem>
                    <SelectItem value="canasta">Canasta</SelectItem>
                    <SelectItem value="manojo">Manojo</SelectItem>
                  </SelectContent>
                </Select>
                {errors.unit && <p className="text-sm text-red-500">{errors.unit.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Categoría *</Label>
                <Select onValueChange={(value) => setValue("category", value)} defaultValue={product?.category}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Frutas">Frutas</SelectItem>
                    <SelectItem value="Verduras">Verduras</SelectItem>
                    <SelectItem value="Pulpas">Pulpas</SelectItem>
                    <SelectItem value="Hierbas y aromáticas">Hierbas y aromáticas</SelectItem>
                    <SelectItem value="Productos varios">Productos varios</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
              </div>

              <div>
                <Label htmlFor="stock">Stock *</Label>
                <Input
                  id="stock"
                  type="number"
                  {...register("stock", {
                    required: "El stock es requerido",
                    min: { value: 0, message: "El stock no puede ser negativo" },
                  })}
                  placeholder="0"
                />
                {errors.stock && <p className="text-sm text-red-500">{errors.stock.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="supplier_id">Proveedor *</Label>
              <Select
                onValueChange={(value) => setValue("supplier_id", Number.parseInt(value))}
                defaultValue={product?.supplier_id?.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar proveedor" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id.toString()}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.supplier_id && <p className="text-sm text-red-500">{errors.supplier_id.message}</p>}
            </div>

            <div>
              <Label htmlFor="origin">Origen</Label>
              <Input id="origin" {...register("origin")} placeholder="Ej: Valle del Cauca, Colombia" />
            </div>
          </CardContent>
        </Card>

        {/* Imagen y información nutricional */}
        <div className="space-y-6">
          {/* Imagen del producto */}
          <Card>
            <CardHeader>
              <CardTitle>Imagen del producto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Campo de URL de la imagen */}
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">URL de la imagen</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="imageUrl"
                      type="url"
                      placeholder="https://ejemplo.com/imagen.jpg"
                      value={imageUrl}
                      onChange={handleImageUrlChange}
                      className="flex-1"
                    />
                    {imageUrl && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleClearImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Ingresa la URL completa de la imagen (ej: https://ejemplo.com/imagen.jpg)
                  </p>
                </div>

                {/* Vista previa de la imagen */}
                {imageUrl && (
                  <div className="space-y-2">
                    <Label>Vista previa</Label>
                    <div className="relative h-48 w-full overflow-hidden rounded-md border">
                      <Image
                        src={imageUrl}
                        alt="Vista previa de la imagen"
                        fill
                        className="object-contain"
                        onError={(e) => {
                          // Mostrar un placeholder si la imagen no se puede cargar
                          e.currentTarget.src = 'https://placehold.co/800?text=FrutyMax&font=roboto';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Información nutricional */}
          <Card>
            <CardHeader>
              <CardTitle>Información nutricional (opcional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="calories">Calorías (por 100g)</Label>
                <Input
                  id="calories"
                  type="number"
                  {...register("nutritionalInfo.calories", { valueAsNumber: true })}
                  placeholder="0"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="protein">Proteínas</Label>
                  <Input id="protein" {...register("nutritionalInfo.protein")} placeholder="0g" />
                </div>

                <div>
                  <Label htmlFor="carbs">Carbohidratos</Label>
                  <Input id="carbs" {...register("nutritionalInfo.carbs")} placeholder="0g" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fat">Grasas</Label>
                  <Input id="fat" {...register("nutritionalInfo.fat")} placeholder="0g" />
                </div>

                <div>
                  <Label htmlFor="fiber">Fibra</Label>
                  <Input id="fiber" {...register("nutritionalInfo.fiber")} placeholder="0g" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
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
              {product ? "Actualizando..." : "Creando..."}
            </>
          ) : product ? (
            "Actualizar producto"
          ) : (
            "Crear producto"
          )}
        </Button>
      </div>
    </form>
  )
}
