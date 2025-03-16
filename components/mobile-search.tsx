"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface MobileSearchProps {
  onSearch?: (term: string) => void
  onClose: () => void
}

export default function MobileSearch({ onSearch, onClose }: MobileSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Focus the input when component mounts
    if (inputRef.current) {
      inputRef.current.focus()
    }

    // Add event listener for outside clicks
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchTerm)
    }
    onClose()
  }

  return (
    <div className="w-full bg-green-600 py-2 px-4 relative">
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <Button type="button" variant="ghost" size="icon" className="text-white hover:bg-green-700" onClick={onClose}>
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Volver</span>
        </Button>

        <Input
          ref={inputRef}
          type="search"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-white"
        />

        <Button type="submit" variant="ghost" size="icon" className="text-white hover:bg-green-700">
          <Search className="h-5 w-5" />
          <span className="sr-only">Buscar</span>
        </Button>
      </form>
    </div>
  )
}

