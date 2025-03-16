"use client"

import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import Header from "@/components/header"
import Banner from "@/components/banner"
import CategoryCard from "@/components/category-card"
import SearchBar from "@/components/search-bar"
import FilterSidebar from "@/components/filter-sidebar"

// Datos de ejemplo para los productos
const allProducts = [
  {
    id: 1,
    name: "Banano",
    price: 920,
    unit: "und",
    image: "/placeholder.svg?height=200&width=200",
    category: "frutas",
  },
  {
    id: 2,
    name: "Cebolla Blanca",
    price: 1340,
    unit: "und",
    image: "/placeholder.svg?height=200&width=200",
    category: "verduras",
  },
  {
    id: 3,
    name: "Aguacate Hass",
    price: 1740,
    unit: "und",
    image: "/placeholder.svg?height=200&width=200",
    category: "frutas",
  },
  {
    id: 4,
    name: "Pimentón",
    price: 1900,
    unit: "und",
    image: "/placeholder.svg?height=200&width=200",
    category: "verduras",
  },
  {
    id: 5,
    name: "Manzana Roja",
    price: 1500,
    unit: "und",
    image: "/placeholder.svg?height=200&width=200",
    category: "frutas",
  },
  {
    id: 6,
    name: "Zanahoria",
    price: 800,
    unit: "und",
    image: "/placeholder.svg?height=200&width=200",
    category: "verduras",
  },
  {
    id: 7,
    name: "Naranja",
    price: 1200,
    unit: "und",
    image: "/placeholder.svg?height=200&width=200",
    category: "frutas",
  },
  {
    id: 8,
    name: "Lechuga",
    price: 1100,
    unit: "und",
    image: "/placeholder.svg?height=200&width=200",
    category: "verduras",
  },
  {
    id: 9,
    name: "Fresa",
    price: 2500,
    unit: "canasta",
    image: "/placeholder.svg?height=200&width=200",
    category: "frutas",
  },
  {
    id: 10,
    name: "Papaya",
    price: 3500,
    unit: "und",
    image: "/placeholder.svg?height=200&width=200",
    category: "frutas",
  },
  {
    id: 11,
    name: "Tomate",
    price: 1200,
    unit: "und",
    image: "/placeholder.svg?height=200&width=200",
    category: "verduras",
  },
  {
    id: 12,
    name: "Piña",
    price: 4500,
    unit: "und",
    image: "/placeholder.svg?height=200&width=200",
    category: "frutas",
  },
  {
    id: 13,
    name: "Espinaca",
    price: 1800,
    unit: "manojo",
    image: "/placeholder.svg?height=200&width=200",
    category: "verduras",
  },
  {
    id: 14,
    name: "Pulpa de Fresa",
    price: 5000,
    unit: "500g",
    image: "/placeholder.svg?height=200&width=200",
    category: "pulpas",
  },
  {
    id: 15,
    name: "Pulpa de Mango",
    price: 4800,
    unit: "500g",
    image: "/placeholder.svg?height=200&width=200",
    category: "pulpas",
  },
  {
    id: 16,
    name: "Cilantro",
    price: 800,
    unit: "manojo",
    image: "/placeholder.svg?height=200&width=200",
    category: "hierbas",
  },
]

// Rangos de precios para filtros
const priceRanges = [
  { id: "price-1", label: "Menos de $1.000", min: 0, max: 1000 },
  { id: "price-2", label: "$1.000 - $2.000", min: 1000, max: 2000 },
  { id: "price-3", label: "$2.000 - $3.000", min: 2000, max: 3000 },
  { id: "price-4", label: "Más de $3.000", min: 3000, max: Number.POSITIVE_INFINITY },
]

// Categorías para filtros
const categories = [
  { id: "category-fruits", label: "Frutas", value: "frutas" },
  { id: "category-vegetables", label: "Verduras", value: "verduras" },
  { id: "category-pulps", label: "Pulpas", value: "pulpas" },
  { id: "category-herbs", label: "Hierbas y aromáticas", value: "hierbas" },
]

// Opciones de ordenación
const sortOptions = [
  { label: "Relevancia", value: "relevance" },
  { label: "Precio: menor a mayor", value: "price-asc" },
  { label: "Precio: mayor a menor", value: "price-desc" },
  { label: "Nombre: A-Z", value: "name-asc" },
  { label: "Nombre: Z-A", value: "name-desc" },
]

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("relevance")
  const [products, setProducts] = useState(allProducts)

  // Efecto para aplicar filtros, búsqueda y ordenamiento
  useEffect(() => {
    let filteredProducts = [...allProducts]

    // Aplicar filtro de búsqueda
    if (searchTerm) {
      filteredProducts = filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Aplicar filtro de categorías
    if (selectedCategories.length > 0) {
      filteredProducts = filteredProducts.filter((product) => selectedCategories.includes(product.category))
    }

    // Aplicar filtro de rango de precios
    if (selectedPriceRanges.length > 0) {
      const ranges = selectedPriceRanges
        .map((rangeId) => {
          const range = priceRanges.find((r) => r.id === rangeId)
          return range ? { min: range.min, max: range.max } : null
        })
        .filter(Boolean)

      if (ranges.length > 0) {
        filteredProducts = filteredProducts.filter((product) =>
          ranges.some((range) => range && product.price >= range.min && product.price <= range.max),
        )
      }
    }

    // Aplicar ordenamiento
    switch (sortBy) {
      case "price-asc":
        filteredProducts.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        filteredProducts.sort((a, b) => b.price - a.price)
        break
      case "name-asc":
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "name-desc":
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name))
        break
      default:
        // Relevancia (orden predeterminado)
        break
    }

    setProducts(filteredProducts)
  }, [searchTerm, selectedCategories, selectedPriceRanges, sortBy])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories((prev) => [...prev, category])
    } else {
      setSelectedCategories((prev) => prev.filter((c) => c !== category))
    }
  }

  const handlePriceRangeChange = (rangeId: string, checked: boolean) => {
    if (checked) {
      setSelectedPriceRanges((prev) => [...prev, rangeId])
    } else {
      setSelectedPriceRanges((prev) => prev.filter((id) => id !== rangeId))
    }
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedPriceRanges([])
    setSearchTerm("")
    setSortBy("relevance")
  }

  return (
    <main className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />

      <div className="container mx-auto px-4 py-6">
        <Banner />

        {/* Categorías destacadas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
          <CategoryCard
            title="Frutas"
            image="/placeholder.svg?height=300&width=500"
            color="bg-amber-500"
            onClick={() => {
              setSelectedCategories(["frutas"])
              setSelectedPriceRanges([])
            }}
          />
          <CategoryCard
            title="Verduras"
            image="/placeholder.svg?height=300&width=500"
            color="bg-green-500"
            onClick={() => {
              setSelectedCategories(["verduras"])
              setSelectedPriceRanges([])
            }}
          />
          <CategoryCard
            title="Pulpas"
            image="/placeholder.svg?height=300&width=500"
            color="bg-red-500"
            onClick={() => {
              setSelectedCategories(["pulpas"])
              setSelectedPriceRanges([])
            }}
          />
        </div>

        {/* Filtros móviles y barra de búsqueda (visible solo en móvil) */}
        <div className="block md:hidden mb-6">
          <SearchBar value={searchTerm} onChange={handleSearch} placeholder="Buscar productos..." className="mb-4" />
        </div>

        {/* Filtros y productos */}
        <div className="flex flex-col md:flex-row gap-6 mt-8">
          {/* Sidebar de filtros */}
          <FilterSidebar
            categories={categories}
            priceRanges={priceRanges}
            selectedCategories={selectedCategories}
            selectedPriceRanges={selectedPriceRanges}
            onCategoryChange={handleCategoryChange}
            onPriceRangeChange={handlePriceRangeChange}
            onClearFilters={clearFilters}
          />

          {/* Lista de productos */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <div>
                <h2 className="text-2xl font-bold">Productos</h2>
                {(selectedCategories.length > 0 || selectedPriceRanges.length > 0 || searchTerm) && (
                  <div className="text-sm text-muted-foreground mt-1">
                    Filtros aplicados:
                    {selectedCategories.length > 0 && (
                      <span className="ml-1">
                        {selectedCategories
                          .map((c) => {
                            const cat = categories.find((category) => category.value === c)
                            return cat ? cat.label : c
                          })
                          .join(", ")}
                      </span>
                    )}
                    {selectedPriceRanges.length > 0 && (
                      <span className="ml-1">
                        {selectedPriceRanges
                          .map((id) => {
                            const range = priceRanges.find((r) => r.id === id)
                            return range ? range.label : id
                          })
                          .join(", ")}
                      </span>
                    )}
                    {searchTerm && <span className="ml-1">Búsqueda: "{searchTerm}"</span>}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-sm text-muted-foreground">{products.length} resultados</span>
                <select
                  className="text-sm border rounded p-1 ml-auto"
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-12 bg-muted/20 rounded-lg">
                <h3 className="text-lg font-medium mb-2">No se encontraron productos</h3>
                <p className="text-muted-foreground mb-4">Intenta con otros filtros o términos de búsqueda</p>
                <Button onClick={clearFilters}>Limpiar filtros</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

