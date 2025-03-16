"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"

interface Category {
  id: string
  label: string
  value: string
}

interface PriceRange {
  id: string
  label: string
  min: number
  max: number
}

interface FilterSidebarProps {
  categories: Category[]
  priceRanges: PriceRange[]
  selectedCategories: string[]
  selectedPriceRanges: string[]
  onCategoryChange: (category: string, checked: boolean) => void
  onPriceRangeChange: (rangeId: string, checked: boolean) => void
  onClearFilters: () => void
}

export default function FilterSidebar({
  categories,
  priceRanges,
  selectedCategories,
  selectedPriceRanges,
  onCategoryChange,
  onPriceRangeChange,
  onClearFilters,
}: FilterSidebarProps) {
  const hasActiveFilters = selectedCategories.length > 0 || selectedPriceRanges.length > 0

  // Contenido de filtros compartido entre desktop y móvil
  const FiltersContent = () => (
    <>
      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium">Categoría</h4>
          {selectedCategories.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-muted-foreground"
              onClick={() => selectedCategories.forEach((c) => onCategoryChange(c, false))}
            >
              Limpiar
            </Button>
          )}
        </div>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={selectedCategories.includes(category.value)}
                onCheckedChange={(checked) => onCategoryChange(category.value, checked === true)}
              />
              <label htmlFor={category.id} className="text-sm cursor-pointer">
                {category.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t mt-4 pt-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium">Precio</h4>
          {selectedPriceRanges.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-muted-foreground"
              onClick={() => selectedPriceRanges.forEach((id) => onPriceRangeChange(id, false))}
            >
              Limpiar
            </Button>
          )}
        </div>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <div key={range.id} className="flex items-center space-x-2">
              <Checkbox
                id={range.id}
                checked={selectedPriceRanges.includes(range.id)}
                onCheckedChange={(checked) => onPriceRangeChange(range.id, checked === true)}
              />
              <label htmlFor={range.id} className="text-sm cursor-pointer">
                {range.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Filtros en móvil - Sheet */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros
              {hasActiveFilters && (
                <span className="bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-1">
                  {selectedCategories.length + selectedPriceRanges.length}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[85vw] sm:max-w-md">
            <SheetHeader>
              <SheetTitle className="flex items-center justify-between">
                <span>Filtros</span>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-sm">
                    Limpiar todos
                  </Button>
                )}
              </SheetTitle>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              <FiltersContent />
            </div>

            <SheetFooter className="mt-6">
              <SheetClose asChild>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Ver {hasActiveFilters ? "resultados filtrados" : "todos los productos"}
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* Filtros en desktop - Sidebar fijo */}
      <div className="hidden md:block w-64 shrink-0">
        <div className="bg-white p-4 rounded-lg shadow sticky top-24">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Filtrar por</h3>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={onClearFilters} className="h-8 px-2 text-xs">
                Limpiar todos
              </Button>
            )}
          </div>

          <FiltersContent />

          {hasActiveFilters && <Button className="w-full mt-6 bg-green-600 hover:bg-green-700">Aplicar filtros</Button>}
        </div>
      </div>
    </>
  )
}

