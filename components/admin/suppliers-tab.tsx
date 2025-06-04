"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Search, Filter, MapPin, Phone, Mail } from "lucide-react"
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
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | undefined>()
  const [supplierDialogOpen, setSupplierDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const loadSuppliers = async () => {
    try {
      setIsLoading(true)
      const response = await supplierService.getSuppliers({
        search: searchTerm || undefined,
        status: statusFilter || undefined,
      })
      setSuppliers(response.data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los proveedores",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSuppliers()
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

  const toggleSupplierStatus = async (supplier: Supplier) => {
    try {
      await supplierService.toggleSupplierStatus(supplier.id)
      toast({
        title: "Éxito",
        description: `Proveedor ${supplier.status === "active" ? "desactivado" : "activado"} correctamente`,
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

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default",
      inactive: "secondary",
    }

    const labels: Record<string, string> = {
      active: "Activo",
      inactive: "Inactivo",
    }

    return <Badge variant={variants[status] || "outline"}>{labels[status] || status}</Badge>
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
                  <TableHead>Contacto</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha de registro</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{supplier.name}</p>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Mail className="h-3 w-3 mr-1" />
                          {supplier.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{supplier.contactPerson}</p>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Phone className="h-3 w-3 mr-1" />
                          {supplier.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-3 w-3 mr-1" />
                        {supplier.city}, {supplier.country}
                      </div>
                    </TableCell>
                    <TableCell>
                      <button onClick={() => toggleSupplierStatus(supplier)} className="cursor-pointer">
                        {getStatusBadge(supplier.status)}
                      </button>
                    </TableCell>
                    <TableCell>{new Date(supplier.createdAt).toLocaleDateString("es-CO")}</TableCell>
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
