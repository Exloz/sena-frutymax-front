"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"

interface CategoryCardProps {
  title: string
  image: string
  color: string
  onClick?: () => void
}

export default function CategoryCard({ title, image, color, onClick }: CategoryCardProps) {
  return (
    <div className={`relative overflow-hidden rounded-lg ${color} text-white`}>
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <Button className="bg-white text-green-600 hover:bg-gray-100" onClick={onClick}>
          ¡Cómpralo ya!
        </Button>
      </div>
    </div>
  )
}

