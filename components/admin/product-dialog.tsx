"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import ProductForm from "./product-form"
import type { Product } from "@/types/api"

interface ProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product
  onSuccess: () => void
}

export default function ProductDialog({ open, onOpenChange, product, onSuccess }: ProductDialogProps) {
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
          <DialogTitle>{product ? "Editar producto" : "Crear nuevo producto"}</DialogTitle>
          <DialogDescription>
            {product
              ? "Modifica la información del producto existente"
              : "Completa la información para crear un nuevo producto"}
          </DialogDescription>
        </DialogHeader>

        <ProductForm product={product} onSuccess={handleSuccess} onCancel={handleCancel} />
      </DialogContent>
    </Dialog>
  )
}
