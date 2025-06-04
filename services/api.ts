// Configuración base de la API
import { AUTH_TOKEN_KEY } from "./auth-service"

const API_BASE_URL = "https://api.frutymax.exloz.site/api"

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  // Obtener token de autenticación si existe
  const token = typeof window !== "undefined" ? localStorage.getItem(AUTH_TOKEN_KEY) : null
  console.log(token)

  // Configurar headers por defecto
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` }),
    ...options.headers
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include' as const, // Incluir credenciales en la petición
    mode: 'cors' as const, // Especificar modo CORS
  }

  try {
    const response = await fetch(url, config)
    
    if (response.status === 401) {
      // Limpiar datos de autenticación si el token es inválido
      if (typeof window !== 'undefined') {
        localStorage.removeItem(AUTH_TOKEN_KEY)
        window.location.href = '/' // Redirigir al inicio
      }
      throw new ApiError('Sesión expirada o inválida', 401, {})
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(errorData.message || `HTTP error! status: ${response.status}`, response.status, errorData)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError("Error de red. Por favor verifica tu conexión.", 0, error)
  }
}

// Métodos HTTP helpers
export const api = {
  get<T>(endpoint: string): Promise<T> {
    return apiRequest<T>(endpoint, { method: "GET" })
  },

  post<T>(endpoint: string, data?: any): Promise<T> {
    return apiRequest<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  },

  put<T>(endpoint: string, data?: any): Promise<T> {
    return apiRequest<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  },

  patch<T>(endpoint: string, data?: any): Promise<T> {
    return apiRequest<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    })
  },

  delete<T>(endpoint: string): Promise<T> {
    return apiRequest<T>(endpoint, { method: "DELETE" })
  },
}

// Exportación por defecto
export default api

// Helper para subir archivos
export async function uploadFile(file: File, endpoint: string): Promise<{ url: string }> {
  const formData = new FormData()
  formData.append("file", file)

  const token = typeof window !== "undefined" ? localStorage.getItem("AUTH_TOKEN_KEY") : null

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new ApiError(errorData.message || "Upload failed", response.status, errorData)
  }

  return await response.json()
}
