"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import SupplierForm from "./supplier-form"
import type { Supplier } from "@/types/api"

interface SupplierDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplier?: Supplier
  onSuccess: () => void
}

export default function SupplierDialog({ open, onOpenChange, supplier, onSuccess }: SupplierDialogProps) {
  const handleSuccess = () => {
    onSuccess()
    onOpenChange(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{supplier ? "Editar proveedor" : "Crear nuevo proveedor"}</DialogTitle>
          <DialogDescription>
            {supplier
              ? "Modifica la información del proveedor existente"
              : "Completa la información para crear un nuevo proveedor"}
          </DialogDescription>
        </DialogHeader>

        <SupplierForm supplier={supplier} onSuccess={handleSuccess} onCancel={handleCancel} />
      </DialogContent>
    </Dialog>
  )
}
