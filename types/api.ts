// Tipos para la API REST

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Modelos de datos
export interface Product {
  id: number
  name: string
  description: string
  price: number
  unit: string
  image?: string
  category: string
  stock: number
  status: "active" | "inactive" | "out_of_stock"
  supplierId: number
  supplier?: Supplier
  nutritionalInfo?: {
    calories: number
    protein: string
    carbs: string
    fat: string
    fiber: string
  }
  origin?: string
  createdAt: string
  updatedAt: string
}

export interface Supplier {
  id: number
  name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  contactPerson: string
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

export interface User {
  id: number
  email: string
  name: string
  role: "cliente" | "admin"
  phone?: string
  address?: string
  createdAt: string
  updatedAt: string
}

export interface Order {
  id: number
  userId: number
  user?: User
  items: OrderItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  shippingAddress: string
  paymentMethod: string
  paymentStatus: "pending" | "paid" | "failed"
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: number
  orderId: number
  productId: number
  product?: Product
  quantity: number
  price: number
  subtotal: number
}

// DTOs para crear/actualizar
export interface CreateProductDto {
  name: string
  description: string
  price: number
  unit: string
  category: string
  stock: number
  supplierId: number
  nutritionalInfo?: {
    calories: number
    protein: string
    carbs: string
    fat: string
    fiber: string
  }
  origin?: string
}

export interface UpdateProductDto extends Partial<CreateProductDto> {
  status?: "active" | "inactive" | "out_of_stock"
}

export interface CreateSupplierDto {
  name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  contactPerson: string
}

export interface UpdateSupplierDto extends Partial<CreateSupplierDto> {
  status?: "active" | "inactive"
}

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  name: string
  email: string
  password: string
  phone?: string
  address?: string
}

export interface CreateOrderDto {
  items: {
    productId: number
    quantity: number
  }[]
  shippingAddress: string
  paymentMethod: string
}
