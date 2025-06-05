"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Search, Filter, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { supplierService } from "@/services/supplier-service"
import SupplierDialog from "./supplier-dialog"
import DeleteConfirmation from "./delete-confirmation"
import type { Supplier } from "@/types/api"

export default function SuppliersTab() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | undefined>()
  const [supplierDialogOpen, setSupplierDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    hasMore: true
  })
  const { toast } = useToast()

  const loadSuppliers = async (page = 1, isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setIsLoadingMore(true)
      } else {
        setIsLoading(true)
        setPagination(prev => ({ ...prev, page }))
      }
      
      const response = await supplierService.getSuppliers({
        page,
        limit: 10,
        search: searchTerm || undefined,
        status: statusFilter || undefined,
      })
      
      if (response?.success) {
        const newSuppliers = Array.isArray(response.data) ? response.data : []
        
        if (isLoadMore) {
          setSuppliers(prev => [...prev, ...newSuppliers])
        } else {
          setSuppliers(newSuppliers)
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
    } catch (error: any) {
      console.error("Error al cargar proveedores:", error)
      toast({
        title: "Error",
        description: error.message || "No se pudieron cargar los proveedores",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }

  const handleLoadMore = () => {
    loadSuppliers(pagination.page + 1, true)
  }

  useEffect(() => {
    loadSuppliers()
  }, [searchTerm, statusFilter])
  
  useEffect(() => {
    // Resetear a la primera página cuando cambian los filtros
    loadSuppliers(1, false)
  }, [searchTerm, statusFilter])

  const handleCreateSupplier = () => {
    setSelectedSupplier(undefined)
    setSupplierDialogOpen(true)
  }

  const handleEditSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier)
    setSupplierDialogOpen(true)
  }

  const handleDeleteSupplier = (supplier: Supplier) => {
    setSupplierToDelete(supplier)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!supplierToDelete) return

    setIsDeleting(true)
    try {
      await supplierService.deleteSupplier(supplierToDelete.id)
      toast({
        title: "Éxito",
        description: "Proveedor eliminado correctamente",
      })
      loadSuppliers()
      setDeleteDialogOpen(false)
      setSupplierToDelete(null)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el proveedor",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleToggleStatus = async (supplier: Supplier) => {
    try {
      await supplierService.toggleSupplierStatus(supplier.id)
      toast({
        title: "Éxito",
        description: `Proveedor ${supplier.status ? "desactivado" : "activado"} correctamente`,
      })
      loadSuppliers()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo cambiar el estado del proveedor",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Proveedores</h2>
        <Button onClick={handleCreateSupplier} className="bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" />
          Agregar proveedor
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar proveedores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="inactive">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de proveedores */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de proveedores</CardTitle>
          <CardDescription>
            {suppliers.length} proveedor{suppliers.length !== 1 ? "es" : ""} encontrado
            {suppliers.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Cargando proveedores...</div>
          ) : suppliers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No se encontraron proveedores</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Persona de Contacto</TableHead>
                  <TableHead>Información de Contacto</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>RIF/NIT</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha de Registro</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.name}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{supplier.contact_person || 'No especificado'}</p>
                        {supplier.payment_terms && (
                          <div className="text-sm text-muted-foreground">
                            Términos: {supplier.payment_terms} días
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1 text-muted-foreground" />
                          {supplier.email || 'No especificado'}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                          {supplier.phone || 'No especificado'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{supplier.address || 'No especificado'}</TableCell>
                    <TableCell>
                      <div>
                        <div>{supplier.tax_id || 'No especificado'}</div>
                        {supplier.notes && (
                          <div className="text-sm text-muted-foreground truncate max-w-[150px]">
                            {supplier.notes}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <button 
                        onClick={() => handleToggleStatus(supplier)}
                        className="cursor-pointer"
                      >
                        <Badge variant={supplier.status ? 'default' : 'destructive'}>
                          {supplier.status ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </button>
                    </TableCell>
                    <TableCell>{new Date(supplier.created_at).toLocaleDateString('es-CO')}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon" onClick={() => handleEditSupplier(supplier)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDeleteSupplier(supplier)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {pagination.hasMore && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      <Button
                        variant="outline"
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                        className="mt-4"
                      >
                        {isLoadingMore ? 'Cargando...' : 'Cargar más'}
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      {/* Diálogos */}
      <SupplierDialog
        open={supplierDialogOpen}
        onOpenChange={setSupplierDialogOpen}
        supplier={selectedSupplier}
        onSuccess={loadSuppliers}
      />

      <DeleteConfirmation
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Eliminar proveedor"
        description={`¿Estás seguro de que quieres eliminar "${supplierToDelete?.name}"? Esta acción no se puede deshacer.`}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}
