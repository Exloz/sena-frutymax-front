import api, { uploadFile } from "./api"
import type { Product, CreateProductDto, UpdateProductDto, ApiResponse, PaginatedResponse } from "@/types/api"

export const productService = {
  // Obtener todos los productos con paginación y filtros
  async getProducts(params?: {
    page?: number
    limit?: number
    category?: string
    search?: string
    supplier_id?: number
    status?: string
  }): Promise<PaginatedResponse<Product>> {
    const searchParams = new URLSearchParams()

    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())
    if (params?.category) searchParams.append("category", params.category)
    if (params?.search) searchParams.append("search", params.search)
    if (params?.supplier_id) searchParams.append("supplier_id", params.supplier_id.toString())
    if (params?.status) searchParams.append("status", params.status)

    const query = searchParams.toString()
    return api.get<PaginatedResponse<Product>>(`/products${query ? `?${query}` : ""}`)
  },

  // Obtener producto por ID
  async getProduct(id: number): Promise<ApiResponse<Product>> {
    return api.get<ApiResponse<Product>>(`/products/${id}`)
  },

  // Crear nuevo producto
  async createProduct(data: CreateProductDto): Promise<ApiResponse<Product>> {
    // Siempre enviar como JSON
    return api.post<ApiResponse<Product>>("/products", data);
  },

  // Actualizar producto
  async updateProduct(id: number, data: UpdateProductDto): Promise<ApiResponse<Product>> {
    // Siempre enviar como JSON
    return api.put<ApiResponse<Product>>(`/products/${id}`, data);
  },

  // Eliminar producto
  async deleteProduct(id: number): Promise<ApiResponse<void>> {
    return api.delete<ApiResponse<void>>(`/products/${id}`)
  },

  async uploadProductImage(productId: number, file: File): Promise<ApiResponse<{ imageUrl: string }>> {
    const response = await uploadFile(file, `/products/${productId}/image`);
    if (response && response.url) {
      return {
        success: true,
        data: {
          imageUrl: response.url
        }
      };
    }
    throw new Error('Error al cargar la imagen');
  },

  // Obtener categorías disponibles
  async getCategories(): Promise<ApiResponse<string[]>> {
    return api.get<ApiResponse<string[]>>("/products/categories")
  },

  // Actualizar stock de producto
  async updateStock(id: number, stock: number): Promise<ApiResponse<Product>> {
    return api.patch<ApiResponse<Product>>(`/products/${id}/stock`, { stock })
  },

  // Obtener productos con bajo stock
  async getLowStockProducts(threshold = 10): Promise<ApiResponse<Product[]>> {
    return api.get<ApiResponse<Product[]>>(`/products/low-stock?threshold=${threshold}`)
  },
}
