"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  onSearch?: (term: string) => void
  value?: string
  onChange?: (term: string) => void
  placeholder?: string
  className?: string
}

export default function SearchBar({
  onSearch,
  value,
  onChange,
  placeholder = "Buscar...",
  className = "",
}: SearchBarProps) {
  // Estado local si no se proporciona valor controlado
  const [searchTerm, setSearchTerm] = useState(value || "")
  const isControlled = value !== undefined && onChange !== undefined

  // Actualizar el estado local si cambia el valor controlado
  useEffect(() => {
    if (isControlled && value !== searchTerm) {
      setSearchTerm(value)
    }
  }, [value, isControlled, searchTerm])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value

    if (isControlled) {
      onChange!(newValue)
    } else {
      setSearchTerm(newValue)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const term = isControlled ? value : searchTerm
    if (onSearch) {
      onSearch(term)
    }
  }

  const clearSearch = () => {
    if (isControlled) {
      onChange!("")
    } else {
      setSearchTerm("")
    }

    if (onSearch) {
      onSearch("")
    }
  }

  const currentTerm = isControlled ? value : searchTerm

  return (
    <form onSubmit={handleSubmit} className={`relative w-full ${className}`}>
      <Input
        type="search"
        placeholder={placeholder}
        value={currentTerm}
        onChange={handleInputChange}
        className="pl-8 pr-8"
      />
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />

      {currentTerm && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground hover:bg-transparent"
          onClick={clearSearch}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Limpiar búsqueda</span>
        </Button>
      )}
    </form>
  )
}

