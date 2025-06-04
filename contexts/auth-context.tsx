"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react"
import { useRouter } from "next/navigation"
import { authService, type AuthResponse } from "@/services/auth-service"
import type { User } from "@/types/api"
import { useToast } from "@/hooks/use-toast"

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; message: string }>
  register: (data: RegisterData) => Promise<{ success: boolean; message: string }>
  logout: () => Promise<void>
  updateUser: (user: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Cargar usuario desde el servicio de autenticación
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = authService.getStoredUser()
        if (storedUser) {
          setUser(storedUser)
          
          // Verificar token si hay un usuario almacenado
          const response = await authService.verifyToken()
          if (!response.success) {
            await authService.clearAuthData()
            setUser(null)
          }
        }
      } catch (error) {
        console.error("Error loading user:", error)
        await authService.clearAuthData()
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  const updateUser = useCallback(async (userData: Partial<User>) => {
    try {
      const response = await authService.updateProfile(userData)
      if (response.success && response.data) {
        setUser(prev => prev ? { ...prev, ...response.data } : null)
        return
      }
      throw new Error(response.message || 'Error al actualizar el perfil')
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al actualizar el perfil",
        variant: "destructive",
      })
      throw error
    }
  }, [toast])

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true)
    try {
      const response = await authService.login(credentials)
      
      if (response.user) {
        setUser(response.user)
        if (response.user.role === "admin") {
          router.push("/admin")
        } else {
          router.push("/")
        }
        return { success: true, message: "Inicio de sesión exitoso" }
      }
      
      return { 
        success: false, 
        message: "Error de autenticación" 
      }
    } catch (error: any) {
      await authService.clearAuthData()
      setUser(null)
      
      toast({
        title: "Error",
        description: error.message || "Error al iniciar sesión",
        variant: "destructive",
      })
      
      return { 
        success: false, 
        message: error.message || "Error interno del servidor" 
      }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterData): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true)
    try {
      const response = await authService.register(data)
      
      if (response.access_token) {
        setUser(response.user)
        return { success: true, message: "Registro exitoso" }
      }
      
      return { 
        success: false, 
        message: "Error en el registro" 
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al registrar el usuario",
        variant: "destructive",
      })
      
      return { 
        success: false, 
        message: error.message || "Error interno del servidor" 
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await authService.logout()
      setUser(null)
      router.push("/")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
      throw error
    }
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider 
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
