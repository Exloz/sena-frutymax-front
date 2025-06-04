"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Loader2, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { productService } from "@/services/product-service"
import { supplierService } from "@/services/supplier-service"
import type { Product, CreateProductDto, UpdateProductDto, Supplier } from "@/types/api"
import Image from "next/image"

interface ProductFormProps {
  product?: Product
  onSuccess: () => void
  onCancel: () => void
}

export default function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image || null)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
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
          supplierId: product.supplierId,
          origin: product.origin,
          nutritionalInfo: product.nutritionalInfo,
        }
      : undefined,
  })

  // Cargar proveedores
  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        const response = await supplierService.getSuppliers({ status: "active" })
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const onSubmit = async (data: CreateProductDto) => {
    setIsLoading(true)
    try {
      let response

      if (product) {
        // Actualizar producto existente
        response = await productService.updateProduct(product.id, data as UpdateProductDto)
      } else {
        // Crear nuevo producto
        response = await productService.createProduct(data)
      }

      // Subir imagen si se seleccionó una
      if (imageFile && response.data) {
        await productService.uploadProductImage(response.data.id, imageFile)
      }

      toast({
        title: "Éxito",
        description: product ? "Producto actualizado correctamente" : "Producto creado correctamente",
      })

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
                    <SelectItem value="frutas">Frutas</SelectItem>
                    <SelectItem value="verduras">Verduras</SelectItem>
                    <SelectItem value="pulpas">Pulpas</SelectItem>
                    <SelectItem value="hierbas">Hierbas y aromáticas</SelectItem>
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
              <Label htmlFor="supplierId">Proveedor *</Label>
              <Select
                onValueChange={(value) => setValue("supplierId", Number.parseInt(value))}
                defaultValue={product?.supplierId?.toString()}
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
              {errors.supplierId && <p className="text-sm text-red-500">{errors.supplierId.message}</p>}
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
                {imagePreview ? (
                  <div className="relative">
                    <Image
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      width={200}
                      height={200}
                      className="rounded-lg object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">Selecciona una imagen</p>
                  </div>
                )}

                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
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
