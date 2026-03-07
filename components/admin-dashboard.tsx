"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, Package, DollarSign, Users, Tag } from "lucide-react"
import { AdminOffers } from "@/components/admin-offers"
import type { Order, Product } from "@/lib/types"
import { NoInternet } from "@/components/no-internet"
import { isOfflineError } from "@/lib/network"

const API_BASE = "";

export function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [offline, setOffline] = useState(false)


   const [totalRevenue, setTotalRevenue] = useState(0);

  // Fetch data from backend
  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      setOffline(false)
      // Fetch orders, products, and revenue in parallel
      const [ordersRes, productsRes, revenueRes] = await Promise.all([
        fetch(`${API_BASE}/api/orders`),
        fetch(`${API_BASE}/api/products`),
        fetch(`${API_BASE}/api/orders/total-revenue`)
      ])
      if (!ordersRes.ok) throw new Error('Failed to fetch orders')
      if (!productsRes.ok) throw new Error('Failed to fetch products')
      if (!revenueRes.ok) throw new Error('Failed to fetch revenue')
      const [ordersData, productsData, revenueData] = await Promise.all([
        ordersRes.json(),
        productsRes.json(),
        revenueRes.json()
      ])
      setOrders(ordersData)
      setProducts(productsData)
      setTotalRevenue(revenueData.totalRevenue || 0)
    } catch (err) {
      console.error('Failed to load dashboard data:', err)
      if (isOfflineError(err)) {
        setOffline(true)
        setError('No internet connection')
      } else {
        setError('Failed to load dashboard data. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Calculate metrics with null checks
  const totalOrders = orders.length
  const totalProducts = products.length
  const pendingOrders = orders.filter((order) => order.status === "pending").length
  const uniqueCustomers = new Set(orders.map(order => order.customerName).filter(Boolean)).size
  const inStockProducts = products.filter(product => product.inStock).length

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of your store performance</p>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-500">Loading dashboard data...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of your store performance</p>
        </div>
        <div className="flex justify-center items-center py-12 w-full">
          {offline ? (
            <NoInternet onRetry={fetchDashboardData} />
          ) : (
            <div className="text-red-500">{error}</div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your store performance</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <ShoppingCart className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="offers" className="flex items-center space-x-2">
            <Tag className="h-4 w-4" />
            <span>Offers</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">{pendingOrders} pending orders</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">{inStockProducts} in stock</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">UGX {totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">From all orders</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueCustomers}</div>
            <p className="text-xs text-muted-foreground">Unique customers</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <p>No orders yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-sm text-gray-600">Order #{order.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">UGX {(order.total || 0).toLocaleString()}</p>
                      <p
                        className={`text-sm capitalize ${
                          order.status === "pending"
                            ? "text-yellow-600"
                            : order.status === "confirmed"
                              ? "text-blue-600"
                              : "text-green-600"
                        }`}
                      >
                        {order.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <p>No products yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {products.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.image ? `${API_BASE}${product.image}` : "/placeholder.svg"}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg";
                        }}
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">UGX {(product.price || 0).toLocaleString()}</p>
                      <p className={`text-xs ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
        </TabsContent>

        <TabsContent value="offers">
          <AdminOffers />
        </TabsContent>
      </Tabs>
    </div>
  )
}
