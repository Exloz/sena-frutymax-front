"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { productService } from "@/services/product-service"
import ProductDialog from "./product-dialog"
import DeleteConfirmation from "./delete-confirmation"
import type { Product } from "@/types/api"
import Image from "next/image"

export default function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>()
  const [productDialogOpen, setProductDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    hasMore: true
  })
  const { toast } = useToast()

  const loadProducts = async (page = 1, isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setIsLoadingMore(true)
      } else {
        setIsLoading(true)
        setPagination(prev => ({ ...prev, page }))
      }
      
      const response = await productService.getProducts({
        page,
        limit: 10,
        search: searchTerm || undefined,
        category: categoryFilter || undefined,
        status: statusFilter || undefined,
      })
      
      if (response?.success) {
        const newProducts = Array.isArray(response.data) ? response.data : []
        
        if (isLoadMore) {
          setProducts(prev => [...prev, ...newProducts])
        } else {
          setProducts(newProducts)
        }
        
        // Actualizar estado de paginación
        const { pagination: apiPagination } = response
        setPagination(prev => ({
          ...prev,
          page: apiPagination?.current_page || page,
          limit: apiPagination?.per_page || 10,
          total: apiPagination?.total || 0,
          hasMore: apiPagination?.current_page < apiPagination?.last_page
        }))
      }
    } catch (_error) {
      console.error("Error al cargar productos:", _error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [searchTerm, categoryFilter, statusFilter])

  useEffect(() => {
    // Resetear a la primera página cuando cambian los filtros
    loadProducts(1, false)
  }, [searchTerm, categoryFilter, statusFilter])

  const handleCreateProduct = () => {
    setSelectedProduct(undefined)
    setProductDialogOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setProductDialogOpen(true)
  }

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!productToDelete) return

    setIsDeleting(true)
    try {
      await productService.deleteProduct(productToDelete.id)
      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado correctamente.",
      })
      loadProducts()
      setDeleteDialogOpen(false)
      setProductToDelete(null)
    } catch (error) {
      console.error("Error al eliminar el producto:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar el producto. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline" | "warning"> = {
      active: "default",
      inactive: "secondary",
      out_of_stock: "destructive",
      low_stock: "warning",
    }

    const labels: Record<string, string> = {
      active: "Activo",
      inactive: "Inactivo",
      out_of_stock: "Agotado",
      low_stock: "Stock bajo",
    }

    return <Badge variant={variants[status] || "outline"}>{labels[status] || status}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Productos</h2>
        <Button onClick={handleCreateProduct} className="bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" />
          Agregar producto
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="frutas">Frutas</SelectItem>
                <SelectItem value="verduras">Verduras</SelectItem>
                <SelectItem value="pulpas">Pulpas</SelectItem>
                <SelectItem value="hierbas">Hierbas y aromáticas</SelectItem>
                <SelectItem value="varios">Productos Varios</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="inactive">Inactivo</SelectItem>
                <SelectItem value="out_of_stock">Agotado</SelectItem>
                <SelectItem value="low_stock">Stock bajo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de productos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de productos</CardTitle>
          <CardDescription>
            {products.length} producto{products.length !== 1 ? "s" : ""} encontrado{products.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Cargando productos...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No se encontraron productos</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Imagen</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Proveedor</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="relative h-12 w-12">
                          <Image
                            src={product.imageUrl || "https://placehold.co/800?text=FrutyMax&font=roboto"}
                            alt={product.name}
                            fill
                            className="rounded-md object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "https://placehold.co/800?text=FrutyMax&font=roboto";
                            }}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.unit}</p>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{product.category}</TableCell>
                      <TableCell>{formatPrice(product.price)}</TableCell>
                      <TableCell>
                        <span className={product.stock <= 10 ? "text-red-600 font-medium" : ""}>
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell>{product.supplier?.name || "N/A"}</TableCell>
                      <TableCell>{getStatusBadge(product.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon" onClick={() => handleEditProduct(product)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handleDeleteProduct(product)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {pagination.hasMore && (
                <div className="flex justify-center py-4">
                  <Button onClick={() => loadProducts(pagination.page + 1, true)} disabled={isLoadingMore}>
                    {isLoadingMore ? (
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    ) : (
                      "Cargar más"
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diálogos */}
      <ProductDialog
        open={productDialogOpen}
        onOpenChange={setProductDialogOpen}
        product={selectedProduct}
        onSuccess={loadProducts}
      />

      <DeleteConfirmation
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Eliminar producto"
        description={`¿Estás seguro de que quieres eliminar "${productToDelete?.name}"? Esta acción no se puede deshacer.`}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}
