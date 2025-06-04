import api from "./api"
import type { Order, CreateOrderDto, ApiResponse, PaginatedResponse } from "@/types/api"

export const orderService = {
  // Obtener todos los pedidos con paginación y filtros
  async getOrders(params?: {
    page?: number
    limit?: number
    status?: string
    userId?: number
    dateFrom?: string
    dateTo?: string
  }): Promise<PaginatedResponse<Order>> {
    const searchParams = new URLSearchParams()

    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())
    if (params?.status) searchParams.append("status", params.status)
    if (params?.userId) searchParams.append("userId", params.userId.toString())
    if (params?.dateFrom) searchParams.append("dateFrom", params.dateFrom)
    if (params?.dateTo) searchParams.append("dateTo", params.dateTo)

    const query = searchParams.toString()
    return api.get<PaginatedResponse<Order>>(`/orders${query ? `?${query}` : ""}`)
  },

  // Obtener pedido por ID
  async getOrder(id: number): Promise<ApiResponse<Order>> {
    return api.get<ApiResponse<Order>>(`/orders/${id}`)
  },

  // Crear nuevo pedido
  async createOrder(data: CreateOrderDto): Promise<ApiResponse<Order>> {
    return api.post<ApiResponse<Order>>("/orders", data)
  },

  // Actualizar estado del pedido
  async updateOrderStatus(id: number, status: Order["status"]): Promise<ApiResponse<Order>> {
    return api.patch<ApiResponse<Order>>(`/orders/${id}/status`, { status })
  },

  // Obtener pedidos del usuario actual
  async getMyOrders(): Promise<ApiResponse<Order[]>> {
    return api.get<ApiResponse<Order[]>>("/orders/my-orders")
  },

  // Cancelar pedido
  async cancelOrder(id: number): Promise<ApiResponse<Order>> {
    return api.patch<ApiResponse<Order>>(`/orders/${id}/cancel`)
  },

  // Obtener estadísticas de pedidos
  async getOrderStats(): Promise<
    ApiResponse<{
      total: number
      pending: number
      processing: number
      delivered: number
      cancelled: number
      totalRevenue: number
    }>
  > {
    return api.get<ApiResponse<any>>("/orders/stats")
  },
}
