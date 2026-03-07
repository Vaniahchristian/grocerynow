"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Order } from "@/lib/types"
import { Search, Eye, CheckCircle, Clock, Truck, Trash2, AlertTriangle } from "lucide-react"
import { NoInternet } from "@/components/no-internet"
import { isOfflineError } from "@/lib/network"
import { listOrders, updateOrderStatusApi, deleteOrderApi, deleteAllOrdersApi } from "@/lib/orderapi"
import type { OrderResponse } from "@/lib/orderapi"

const toOrder = (r: OrderResponse): Order => ({
  id: String(r.id),
  customerName: r.customerName,
  phone: r.phone,
  location: r.location,
  deliveryZone: r.deliveryZone ?? undefined,
  notes: r.notes ?? "",
  items: r.items.map((i) => ({
    productId: String(i.productId),
    productName: i.productName,
    quantity: i.quantity,
    price: i.price,
  })),
  subtotal: r.subtotal,
  deliveryFee: r.deliveryFee,
  total: r.total,
  status: r.status as Order["status"],
  createdAt: r.createdAt,
})

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [listError, setListError] = useState<string | null>(null)
  const [offline, setOffline] = useState(false)
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false)

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      setLoading(true)
      setListError(null)
      setOffline(false)
      const data = await listOrders()
      setOrders(data.map(toOrder))
    } catch (err) {
      console.error('Failed to load orders:', err)
      if (isOfflineError(err)) {
        setOffline(true)
        setListError('No internet connection')
      } else {
        setListError('Failed to load orders. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const filteredOrders = orders.filter(
    (order) =>
      (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.id && order.id.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.phone && order.phone.includes(searchTerm)),
  )

  const updateOrderStatus = async (orderId: string | number, status: Order["status"]) => {
    try {
      setLoading(true)
      const updatedOrder = await updateOrderStatusApi(orderId, status)
      
      // Update orders list
      setOrders(orders.map((order) => 
        order.id === orderId ? { ...order, status } : order
      ))
      
      // Update selected order if it's the one being updated
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status })
      }
      
      alert(`Order status changed to ${status}`)
    } catch (err) {
      console.error('Error updating order status:', err)
      alert('Failed to update order status. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const deleteOrder = async (orderId: string | number) => {
    if (!confirm(`Are you sure you want to delete order #${orderId}? This action cannot be undone.`)) {
      return
    }

    try {
      setLoading(true)
      await deleteOrderApi(orderId)
      
      // Remove order from list
      setOrders(orders.filter((order) => order.id !== orderId))
      
      // Clear selected order if it was deleted
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(null)
      }
      
      alert('Order deleted successfully')
    } catch (err) {
      console.error('Error deleting order:', err)
      alert('Failed to delete order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const deleteAllOrders = async () => {
    if (!confirm('Are you sure you want to delete ALL orders? This action cannot be undone and will permanently remove all order data.')) {
      return
    }

    try {
      setLoading(true)
      await deleteAllOrdersApi()
      
      // Clear all orders
      setOrders([])
      setSelectedOrder(null)
      setShowDeleteAllConfirm(false)
      
      alert('All orders deleted successfully')
    } catch (err) {
      console.error('Error deleting all orders:', err)
      alert('Failed to delete all orders. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />
      case "delivered":
        return <Truck className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "delivered":
        return "bg-green-100 text-green-800"
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600">Track and manage customer orders</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {orders.length > 0 && (
            <Button
              variant="destructive"
              onClick={() => setShowDeleteAllConfirm(true)}
              disabled={loading}
              className="flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete All</span>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>Orders ({filteredOrders.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {listError ? (
                offline ? (
                  <NoInternet onRetry={fetchOrders} />
                ) : (
                  <div className="flex justify-center items-center py-8">
                    <div className="text-red-600">{listError}</div>
                  </div>
                )
              ) : loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="text-gray-500">Loading orders...</div>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No orders found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-gray-900">{order.id}</h3>
                        <Badge className={getStatusColor(order.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(order.status)}
                            <span className="capitalize">{order.status}</span>
                          </div>
                        </Badge>
                      </div>
                      <span className="text-lg font-bold text-green-600">UGX {order.total.toLocaleString()}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <p>
                          <strong>Customer:</strong> {order.customerName}
                        </p>
                        <p>
                          <strong>Phone:</strong> {order.phone}
                        </p>
                      </div>
                      <div>
                        <p>
                          <strong>Items:</strong> {order.items.length} products
                        </p>
                        <p>
                          <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex space-x-2">
                      {order.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            updateOrderStatus(order.id, "confirmed")
                          }}
                          disabled={loading}
                          className="bg-blue-600 hover:bg-blue-700 rounded-lg"
                        >
                          {loading ? 'Updating...' : 'Confirm Order'}
                        </Button>
                      )}
                      {order.status === "confirmed" && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            updateOrderStatus(order.id, "delivered")
                          }}
                          disabled={loading}
                          className="bg-green-600 hover:bg-green-700 rounded-lg"
                        >
                          {loading ? 'Updating...' : 'Mark Delivered'}
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedOrder(order)
                        }}
                        className="rounded-lg"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteOrder(order.id)
                        }}
                        disabled={loading}
                        className="rounded-lg"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          {selectedOrder ? (
            <Card className="sticky top-24 rounded-xl">
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Order Information</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Order ID:</strong> {selectedOrder.id}
                    </p>
                    <p>
                      <strong>Status:</strong>
                      <Badge className={`ml-2 ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</Badge>
                    </p>
                    <p>
                      <strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Customer Details</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Name:</strong> {selectedOrder.customerName}
                    </p>
                    <p>
                      <strong>Phone:</strong> {selectedOrder.phone}
                    </p>
                    <p>
                      <strong>Location:</strong> {selectedOrder.location}
                    </p>
                    {selectedOrder.deliveryZone && (
                      <p>
                        <strong>Delivery Area:</strong> {selectedOrder.deliveryZone}
                      </p>
                    )}
                    {selectedOrder.notes && (
                      <p>
                        <strong>Notes:</strong> {selectedOrder.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Order Items</h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">UGX {(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-2 mt-2 space-y-1 text-sm">
                    {typeof selectedOrder.subtotal === 'number' && (
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>UGX {selectedOrder.subtotal.toLocaleString()}</span>
                      </div>
                    )}
                    {typeof selectedOrder.deliveryFee === 'number' && (
                      <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span>UGX {selectedOrder.deliveryFee.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold border-t pt-2">
                      <span>Total</span>
                      <span>UGX {selectedOrder.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {selectedOrder.status === "pending" && (
                    <Button
                      onClick={() => updateOrderStatus(selectedOrder.id, "confirmed")}
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg"
                    >
                      {loading ? 'Updating...' : 'Confirm Order'}
                    </Button>
                  )}
                  {selectedOrder.status === "confirmed" && (
                    <Button
                      onClick={() => updateOrderStatus(selectedOrder.id, "delivered")}
                      disabled={loading}
                      className="w-full bg-green-600 hover:bg-green-700 rounded-lg"
                    >
                      {loading ? 'Updating...' : 'Mark as Delivered'}
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    onClick={() => deleteOrder(selectedOrder.id)}
                    disabled={loading}
                    className="w-full rounded-lg"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {loading ? 'Deleting...' : 'Delete Order'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="rounded-xl">
              <CardContent className="p-8 text-center text-gray-500">
                <Eye className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Select an order to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Delete All Confirmation Dialog */}
      {showDeleteAllConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96 mx-4">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                <span>Delete All Orders</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Are you sure you want to delete <strong>all {orders.length} orders</strong>? 
                This action cannot be undone and will permanently remove all order data.
              </p>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteAllConfirm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={deleteAllOrders}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Deleting...' : 'Delete All Orders'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
