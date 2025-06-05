"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { toast } from "@/components/ui/use-toast"

import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import Header from "@/components/header"
import Banner from "@/components/banner"
import CategoryCard from "@/components/category-card"
import SearchBar from "@/components/search-bar"
import FilterSidebar from "@/components/filter-sidebar"
import { productService } from "@/services/product-service"
import type { Product } from "@/types/api"

type Category = {
  id: string
  name: string
  image: string
  label: string
  value: string
}

// Categorías disponibles
const categories: Category[] = [
  { id: 'frutas', name: 'Frutas', image: '/categories/frutas.jpg', label: 'Frutas', value: 'frutas' },
  { id: 'verduras', name: 'Verduras', image: '/categories/verduras.jpg', label: 'Verduras', value: 'verduras' },
  { id: 'raices', name: 'Raíces y Tubérculos', image: '/categories/raices.jpg', label: 'Raíces', value: 'raices' },
  { id: 'hierbas', name: 'Hierbas Aromáticas', image: '/categories/hierbas.jpg', label: 'Hierbas', value: 'hierbas' },
]

// Rangos de precios para filtros
const priceRanges = [
  { id: "price-1", label: "Menos de $1.000", min: 0, max: 1000 },
  { id: "price-2", label: "$1.000 - $2.000", min: 1000, max: 2000 },
  { id: "price-3", label: "$2.000 - $3.000", min: 2000, max: 3000 },
  { id: "price-4", label: "Más de $3.000", min: 3000, max: Number.POSITIVE_INFINITY },
]

// Opciones de ordenación
const sortOptions = [
  { label: "Relevancia", value: "relevance" },
  { label: "Precio: menor a mayor", value: "price-asc" },
  { label: "Precio: mayor a menor", value: "price-desc" },
  { label: "Nombre: A-Z", value: "name-asc" },
  { label: "Nombre: Z-A", value: "name-desc" },
]

function HomeContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("relevance")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    hasMore: true
  })

  // Cargar productos desde la API
  const fetchProducts = async (page = 1, isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setIsLoadingMore(true)
      } else {
        setIsLoading(true)
      }
      
      const response = await productService.getProducts({
        page,
        limit: pagination.limit,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategories.length > 0 && { category: selectedCategories.join(',') })
      })
      
      if (response?.success) {
        const newProducts = Array.isArray(response.data) ? response.data : []
        
        if (isLoadMore) {
          setProducts(prev => [...prev, ...newProducts])
          setFilteredProducts(prev => [...prev, ...newProducts])
        } else {
          setProducts(newProducts)
          setFilteredProducts(newProducts)
        }
        
        setPagination(prev => ({
          ...prev,
          page,
          total: response.pagination?.total || 0,
          hasMore: page < (response.pagination?.totalPages || 1)
        }))
      }
    } catch (err) {
      console.error("Error al cargar productos:", err)
      setError("No se pudieron cargar los productos. Intente de nuevo más tarde.")
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }

  // Cargar productos iniciales
  useEffect(() => {
    fetchProducts(1, false)
  }, [searchTerm, selectedCategories])
  
  // Función para cargar más productos
  const loadMoreProducts = () => {
    if (!isLoadingMore && pagination.hasMore) {
      const nextPage = pagination.page + 1
      fetchProducts(nextPage, true)
    }
  }

  // Aplicar filtros de precios y ordenación (los demás filtros ya se aplican en el servidor)
  useEffect(() => {
    let result = [...products]

    // Aplicar filtro de precios
    if (selectedPriceRanges.length > 0) {
      result = result.filter(product => {
        return selectedPriceRanges.some(rangeId => {
          const range = priceRanges.find(r => r.id === rangeId)
          return range && product.price >= range.min && product.price <= range.max
        })
      })
    }

    // Aplicar ordenación
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'name-asc':
          return a.name.localeCompare(b.name)
        case 'name-desc':
          return b.name.localeCompare(a.name)
        default:
          return 0
      }
    })

    setFilteredProducts(result)
  }, [products, selectedPriceRanges, sortBy])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    // Resetear a la primera página al buscar
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  // Manejadores de eventos para filtros

  const handleSortChange = (value: string) => {
    setSortBy(value)
  }

  const resetFilters = () => {
    setSearchTerm("")
    setSelectedCategories([])
    setSelectedPriceRanges([])
    setSortBy("relevance")
    // Resetear a la primera página al limpiar filtros
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Banner />
        <div className="flex flex-col md:flex-row gap-6">

          {/* Filtros */}
          <FilterSidebar
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            categories={categories}
            priceRanges={priceRanges}
            selectedCategories={selectedCategories}
            selectedPriceRanges={selectedPriceRanges}
            onCategoryChange={(category, checked) => {
              if (checked) {
                setSelectedCategories(prev => [...prev, category])
              } else {
                setSelectedCategories(prev => prev.filter(c => c !== category))
              }
            }}
            onPriceRangeChange={(rangeId, checked) => {
              if (checked) {
                setSelectedPriceRanges(prev => [...prev, rangeId])
              } else {
                setSelectedPriceRanges(prev => prev.filter(id => id !== rangeId))
              }
            }}
            onClearFilters={resetFilters}
          />
          
          {/* Contenido principal */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
              <div className="flex items-center space-x-4">
                <SearchBar onSearch={handleSearch} />
                <Button 
                  variant="outline" 
                  className="md:hidden"
                  onClick={() => setIsFilterOpen(true)}
                >
                  Filtros
                </Button>
              </div>
            </div>

            {/* Categorías */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Categorías</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {categories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    title={category.name}
                    image={category.image}
                    color="bg-green-600"
                    onClick={() => {
                      if (selectedCategories.includes(category.id)) {
                        setSelectedCategories(prev => prev.filter(id => id !== category.id))
                      } else {
                        setSelectedCategories(prev => [...prev, category.id])
                      }
                    }}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={`${product.id}-${product.updatedAt}`} product={product} />
                  ))}
                </div>
                
                {pagination.hasMore && (
                  <div className="mt-8 text-center">
                    <Button
                      onClick={loadMoreProducts}
                      disabled={isLoadingMore}
                      className="mx-auto"
                            image: product.image || '/placeholder.svg',
                            category: product.category
                          }}
                        />
                      ) : null
                    ))
                  ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500">No se encontraron productos con los filtros seleccionados.</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={resetFilters}
                    >
                      Limpiar filtros
                    </Button>
                  </div>
                )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// Crear un componente que solo se renderice en el cliente
const HomeClient = dynamic(() => Promise.resolve(HomeContent), { ssr: false })

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    }>
      <HomeClient />
    </Suspense>
  )
}
