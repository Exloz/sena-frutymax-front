"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import CartDrawer from "@/components/cart-drawer"
import SearchBar from "@/components/search-bar"
import MobileSearch from "@/components/mobile-search"
import LoginDialog from "@/components/auth/login-dialog"
import RegisterDialog from "@/components/auth/register-dialog"
import UserMenu from "@/components/auth/user-menu"
import { useAuth } from "@/contexts/auth-context"
import { useRouter, useSearchParams } from "next/navigation"

interface HeaderProps {
  onSearch?: (term: string) => void
}

export default function Header({ onSearch }: HeaderProps) {
  const [mobileSearchVisible, setMobileSearchVisible] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()

  // Sync search term with URL
  useEffect(() => {
    const search = searchParams.get('search')
    if (search !== null) {
      setSearchTerm(search)
    }
  }, [searchParams])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    // Update URL with search query
    const params = new URLSearchParams(searchParams.toString())
    if (term) {
      params.set('search', term)
    } else {
      params.delete('search')
    }
    router.push(`/?${params.toString()}`)
    
    // Call the onSearch prop if provided
    onSearch?.(term)
  }

  const toggleMobileSearch = () => {
    setMobileSearchVisible(!mobileSearchVisible)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-green-500 text-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2 md:gap-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-green-600">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" className="text-lg font-medium">
                  Inicio
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Logo" width={50} height={50} />
            <span className="text-xl font-bold">FrutyMax</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:underline">
              Inicio
            </Link>
          </nav>
        </div>

        {/* <div className="hidden md:flex items-center relative w-full max-w-sm mx-4">
          <SearchBar 
            value={searchTerm}
            onChange={setSearchTerm}
            onSearch={handleSearch}
            placeholder="Buscar productos..." 
            className="bg-white text-black" 
          />
        </div> */}

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-green-600 md:hidden"
            onClick={toggleMobileSearch}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Buscar</span>
          </Button>

          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm">Hola, {user.name.split(" ")[0]}</span>
              </div>
              <UserMenu />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <LoginDialog>
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:flex bg-white text-green-600 hover:bg-gray-100"
                >
                  Iniciar sesión
                </Button>
              </LoginDialog>
              <RegisterDialog>
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:flex bg-white text-green-600 hover:bg-gray-100"
                >
                  Registrarse
                </Button>
              </RegisterDialog>
              <div className="md:hidden">
                <LoginDialog>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-green-600">
                    <Search className="h-5 w-5" />
                    <span className="sr-only">Cuenta</span>
                  </Button>
                </LoginDialog>
              </div>
            </div>
          )}

          <CartDrawer />
        </div>
      </div>

      {/* Búsqueda móvil */}
      {mobileSearchVisible && <MobileSearch onSearch={onSearch} onClose={() => setMobileSearchVisible(false)} />}
    </header>
  )
}
