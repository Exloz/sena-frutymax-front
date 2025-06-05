import api from "./api"
import type { Supplier, CreateSupplierDto, UpdateSupplierDto, ApiResponse, PaginatedResponse } from "@/types/api"

export const supplierService = {
  // Obtener todos los proveedores con paginación y filtros
  async getSuppliers(params?: {
    page?: number
    limit?: number
    search?: string
    status?: boolean
    city?: string
  }): Promise<PaginatedResponse<Supplier>> {
    const searchParams = new URLSearchParams()

    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())
    if (params?.search) searchParams.append("search", params.search)
    if (params?.status) searchParams.append("status", params.status.toString())
    if (params?.city) searchParams.append("city", params.city)

    const query = searchParams.toString()
    return api.get<PaginatedResponse<Supplier>>(`/suppliers${query ? `?${query}` : ""}`)
  },

  // Obtener proveedor por ID
  async getSupplier(id: number): Promise<ApiResponse<Supplier>> {
    return api.get<ApiResponse<Supplier>>(`/suppliers/${id}`)
  },

  // Crear nuevo proveedor
  async createSupplier(data: CreateSupplierDto): Promise<ApiResponse<Supplier>> {
    return api.post<ApiResponse<Supplier>>("/suppliers", data)
  },

  // Actualizar proveedor
  async updateSupplier(id: number, data: UpdateSupplierDto): Promise<ApiResponse<Supplier>> {
    return api.put<ApiResponse<Supplier>>(`/suppliers/${id}`, data)
  },

  // Eliminar proveedor
  async deleteSupplier(id: number): Promise<ApiResponse<void>> {
    return api.delete<ApiResponse<void>>(`/suppliers/${id}`)
  },

  // Obtener productos de un proveedor
  async getSupplierProducts(id: number): Promise<ApiResponse<any[]>> {
    return api.get<ApiResponse<any[]>>(`/suppliers/${id}/products`)
  },

  // Activar/desactivar proveedor
  async toggleSupplierStatus(id: number): Promise<ApiResponse<Supplier>> {
    return api.patch<ApiResponse<Supplier>>(`/suppliers/${id}/toggle-status`)
  },
}
