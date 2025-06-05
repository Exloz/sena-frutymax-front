import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

import { Product } from "@/types/api"

export default function RelatedProducts({ products }: { products: Product[] }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.map((product) => (
        <Link key={product.id} href={`/producto/${product.id}`} className="group">
          <div className="relative aspect-square overflow-hidden rounded-lg border bg-white">
            <Badge className="absolute top-2 right-2 z-10 bg-amber-500">
              {product.category === "frutas" ? "Fruta" : "Verdura"}
            </Badge>
            <Image
              src={product.imageUrl || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>
          <div className="mt-2">
            <h3 className="font-medium group-hover:underline">{product.name}</h3>
            <p className="text-sm text-muted-foreground">
              {formatPrice(product.price)} / {product.unit}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}
