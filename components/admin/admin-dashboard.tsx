"use client"

import { useState } from "react"
import { Package, Users, ShoppingCart, TrendingUp, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import Header from "@/components/header"
import ProductsTab from "./products-tab"
import SuppliersTab from "./suppliers-tab"

// Datos de ejemplo para el dashboard
const stats = [
  {
    title: "Productos totales",
    value: "156",
    description: "+12% desde el mes pasado",
    icon: Package,
  },
  {
    title: "Usuarios registrados",
    value: "1,234",
    description: "+8% desde el mes pasado",
    icon: Users,
  },
  {
    title: "Pedidos del mes",
    value: "89",
    description: "+23% desde el mes pasado",
    icon: ShoppingCart,
  },
  {
    title: "Ventas del mes",
    value: "$12,345",
    description: "+15% desde el mes pasado",
    icon: TrendingUp,
  },
]

export default function AdminDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <p className="text-muted-foreground">Bienvenido de vuelta, {user?.name}</p>
        </div>

        {/* Navegación de pestañas */}
        <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg w-fit">
          <Button
            variant={activeTab === "overview" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("overview")}
          >
            Resumen
          </Button>
          <Button
            variant={activeTab === "products" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("products")}
          >
            Productos
          </Button>
          <Button
            variant={activeTab === "suppliers" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("suppliers")}
          >
            Proveedores
          </Button>
          <Button
            variant={activeTab === "orders" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("orders")}
          >
            Pedidos
          </Button>
          <Button variant={activeTab === "users" ? "default" : "ghost"} size="sm" onClick={() => setActiveTab("users")}>
            Usuarios
          </Button>
        </div>

        {/* Contenido según la pestaña activa */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Estadísticas */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Resumen rápido */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Acciones rápidas</CardTitle>
                  <CardDescription>Tareas comunes de administración</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab("products")}>
                    <Package className="mr-2 h-4 w-4" />
                    Gestionar productos
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab("suppliers")}>
                    <Truck className="mr-2 h-4 w-4" />
                    Gestionar proveedores
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab("orders")}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Ver pedidos
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estado del sistema</CardTitle>
                  <CardDescription>Información general del sistema</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">API Status:</span>
                    <span className="text-sm font-medium text-green-600">Conectado</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Base de datos:</span>
                    <span className="text-sm font-medium text-green-600">Operativa</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Última sincronización:</span>
                    <span className="text-sm font-medium">Hace 2 minutos</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "products" && <ProductsTab />}
        {activeTab === "suppliers" && <SuppliersTab />}

        {activeTab === "orders" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Gestión de Pedidos</h2>
            <Card>
              <CardHeader>
                <CardTitle>Lista de pedidos</CardTitle>
                <CardDescription>Gestiona los pedidos de tus clientes</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Funcionalidad de gestión de pedidos en desarrollo...</p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "users" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>
            <Card>
              <CardHeader>
                <CardTitle>Lista de usuarios</CardTitle>
                <CardDescription>Gestiona los usuarios registrados en la plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Funcionalidad de gestión de usuarios en desarrollo...</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
