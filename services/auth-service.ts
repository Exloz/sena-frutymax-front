import api from "./api"
import type { User, LoginDto, RegisterDto, ApiResponse } from "@/types/api"

export interface AuthResponse {
  user: User
  access_token: string
  token_type: string
}

const AUTH_TOKEN_KEY = 'authToken'
const USER_KEY = 'user'

export const authService = {
  // Obtener token almacenado
  getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(AUTH_TOKEN_KEY)
  },

  // Obtener usuario almacenado
  getStoredUser(): User | null {
    if (typeof window === 'undefined') return null
    const userStr = localStorage.getItem(USER_KEY)
    return userStr ? JSON.parse(userStr) : null
  },

  // Almacenar datos de autenticación
  storeAuthData(authData: AuthResponse): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(AUTH_TOKEN_KEY, authData.access_token)
    localStorage.setItem(USER_KEY, JSON.stringify(authData.user))
  },

  // Limpiar datos de autenticación
  clearAuthData(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },

  // Iniciar sesión
  async login(credentials: LoginDto): Promise<ApiResponse<AuthResponse>> {
    const response = await api.post<ApiResponse<AuthResponse>>("/auth/login", credentials)
    
    if (response.success && response.data) {
      this.storeAuthData(response.data)
    }

    return response
  },

  // Registrarse
  async register(userData: RegisterDto): Promise<ApiResponse<AuthResponse>> {
    const response = await api.post<ApiResponse<AuthResponse>>("/auth/register", userData)
    
    if (response.success && response.data) {
      this.storeAuthData(response.data)
    }

    return response
  },

  // Cerrar sesión
  async logout(): Promise<void> {
    try {
      await api.post("/auth/logout")
    } finally {
      this.clearAuthData()
    }
  },

  // Obtener perfil del usuario actual
  async getProfile(): Promise<ApiResponse<User>> {
    return api.get<ApiResponse<User>>("/auth/profile")
  },

  // Actualizar perfil
  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    const response = await api.put<ApiResponse<User>>("/auth/profile", data)
    
    // Actualizar usuario en localStorage si la actualización fue exitosa
    if (response.success && response.data) {
      const currentUser = this.getStoredUser()
      if (currentUser) {
        localStorage.setItem(USER_KEY, JSON.stringify({ ...currentUser, ...response.data }))
      }
    }
    
    return response
  },

  // Verificar token
  async verifyToken(): Promise<ApiResponse<User>> {
    return api.get<ApiResponse<User>>("/auth/verify")
  },

  // Cambiar contraseña
  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<void>> {
    return api.post<ApiResponse<void>>("/auth/change-password", {
      currentPassword,
      newPassword,
    })
  },
}
