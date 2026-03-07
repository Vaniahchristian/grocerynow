"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Order } from "@/lib/types"
import { Search, Eye, CheckCircle, Clock, Truck, Trash2, AlertTriangle, FileSpreadsheet, FileText, Filter, X } from "lucide-react"
import { NoInternet } from "@/components/no-internet"
import { isOfflineError } from "@/lib/network"
import { listOrders, updateOrderStatusApi, deleteOrderApi, deleteAllOrdersApi } from "@/lib/orderapi"
import type { OrderResponse } from "@/lib/orderapi"
import { format, startOfMonth, endOfMonth, startOfDay, endOfDay, subMonths, isWithinInterval, parseISO } from "date-fns"
import * as XLSX from "xlsx"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

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

// Build month options: All time + last 12 months
function getMonthOptions(): { value: string; label: string }[] {
  const options = [{ value: "", label: "All time" }]
  const now = new Date()
  for (let i = 0; i < 12; i++) {
    const d = subMonths(now, i)
    options.push({
      value: format(d, "yyyy-MM"),
      label: format(d, "MMMM yyyy"),
    })
  }
  return options
}

const MONTH_OPTIONS = getMonthOptions()

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [listError, setListError] = useState<string | null>(null)
  const [offline, setOffline] = useState(false)
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false)
  // Filters
  const [filterMonth, setFilterMonth] = useState("")
  const [filterDateFrom, setFilterDateFrom] = useState("")
  const [filterDateTo, setFilterDateTo] = useState("")
  const [filterStatus, setFilterStatus] = useState("")

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

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Search
      const matchesSearch =
        !searchTerm ||
        (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.id && order.id.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.phone && order.phone.includes(searchTerm))
      if (!matchesSearch) return false

      // Status
      if (filterStatus && order.status !== filterStatus) return false

      // Date filters
      const orderDate = parseISO(order.createdAt)
      if (filterMonth) {
        const [y, m] = filterMonth.split("-").map(Number)
        const monthStart = startOfMonth(new Date(y, m - 1))
        const monthEnd = endOfMonth(new Date(y, m - 1))
        if (!isWithinInterval(orderDate, { start: monthStart, end: monthEnd })) return false
      }
      if (filterDateFrom) {
        const from = startOfDay(parseISO(filterDateFrom))
        if (orderDate < from) return false
      }
      if (filterDateTo) {
        const to = endOfDay(parseISO(filterDateTo))
        if (orderDate > to) return false
      }
      return true
    })
  }, [orders, searchTerm, filterMonth, filterDateFrom, filterDateTo, filterStatus])

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

  const hasActiveFilters = filterMonth || filterDateFrom || filterDateTo || filterStatus

  const clearFilters = () => {
    setFilterMonth("")
    setFilterDateFrom("")
    setFilterDateTo("")
    setFilterStatus("")
  }

  const formatItemNames = (order: Order) =>
    order.items.map((i) => `${i.productName} (${i.quantity})`).join(", ")

  const exportToExcel = () => {
    const rows = filteredOrders.map((order) => ({
      "Order ID": order.id,
      Customer: order.customerName,
      Phone: order.phone,
      Location: order.location,
      Status: order.status,
      Date: format(parseISO(order.createdAt), "yyyy-MM-dd HH:mm"),
      "Item Names": formatItemNames(order),
      Items: order.items.length,
      Subtotal: order.subtotal ?? "",
      "Delivery Fee": order.deliveryFee ?? "",
      Total: order.total,
    }))
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Orders")
    XLSX.writeFile(wb, `orders-${format(new Date(), "yyyy-MM-dd")}.xlsx`)
  }

  const exportToPdf = () => {
    const doc = new jsPDF({ orientation: "landscape" })
    doc.setFontSize(14)
    doc.text("Order Management – Grocery Now", 14, 15)
    doc.setFontSize(10)
    doc.text(`Exported: ${format(new Date(), "PPpp")} • ${filteredOrders.length} order(s)`, 14, 22)
    const tableData = filteredOrders.map((order) => [
      order.id,
      order.customerName,
      order.phone,
      format(parseISO(order.createdAt), "MM/dd/yyyy"),
      formatItemNames(order),
      order.status,
      `UGX ${order.total.toLocaleString()}`,
    ])
    autoTable(doc, {
      startY: 28,
      head: [["Order ID", "Customer", "Phone", "Date", "Item Names", "Status", "Total"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [34, 197, 94] },
      columnStyles: { 4: { cellWidth: "auto", overflow: "linebreak" } },
    })
    doc.save(`orders-${format(new Date(), "yyyy-MM-dd")}.pdf`)
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
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 px-1 sm:px-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">Order Management</h1>
          <p className="text-sm text-gray-600 sm:text-base">Track and manage customer orders</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {filteredOrders.length > 0 && (
              <>
                <Button
                  variant="outline"
                  onClick={exportToExcel}
                  size="sm"
                  className="flex flex-1 min-w-0 sm:flex-initial items-center justify-center gap-1.5 border-green-200 text-green-700 hover:bg-green-50 text-xs sm:text-sm"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  <span className="truncate">Excel</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={exportToPdf}
                  size="sm"
                  className="flex flex-1 min-w-0 sm:flex-initial items-center justify-center gap-1.5 border-red-200 text-red-700 hover:bg-red-50 text-xs sm:text-sm"
                >
                  <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  <span className="truncate">PDF</span>
                </Button>
              </>
            )}
            {orders.length > 0 && (
              <Button
                variant="destructive"
                onClick={() => setShowDeleteAllConfirm(true)}
                disabled={loading}
                size="sm"
                className="flex flex-1 min-w-0 sm:flex-initial items-center justify-center gap-1.5 text-xs sm:text-sm"
              >
                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="truncate">Delete All</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Filters: month, date range, status */}
      <Card className="rounded-xl">
        <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-gray-500 shrink-0" />
            <span className="text-sm font-medium text-gray-700">Filters</span>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-500 hover:text-gray-700">
                <X className="w-4 h-4 mr-1" />
                Clear filters
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-center gap-3 lg:gap-4">
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-2">
              <label className="text-sm text-gray-600 whitespace-nowrap">Month</label>
              <Select value={filterMonth || "__all__"} onValueChange={(v) => setFilterMonth(v === "__all__" ? "" : v)}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="All time" />
                </SelectTrigger>
                <SelectContent>
                  {MONTH_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value || "all"} value={opt.value || "__all__"}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-2">
              <label className="text-sm text-gray-600 whitespace-nowrap">From</label>
              <Input
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                className="w-full sm:w-[140px]"
              />
            </div>
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-2">
              <label className="text-sm text-gray-600 whitespace-nowrap">To</label>
              <Input
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                className="w-full sm:w-[140px]"
              />
            </div>
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-2">
              <label className="text-sm text-gray-600 whitespace-nowrap">Status</label>
              <Select value={filterStatus || "__all__"} onValueChange={(v) => setFilterStatus(v === "__all__" ? "" : v)}>
                <SelectTrigger className="w-full sm:w-[130px]">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2 min-w-0">
          <Card className="rounded-xl">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-base sm:text-lg">Orders ({filteredOrders.length})</CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
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
                <div className="space-y-3 sm:space-y-4">
                  {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="border rounded-lg p-3 sm:p-4 hover:bg-gray-50 cursor-pointer active:bg-gray-100"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3">
                      <div className="flex flex-wrap items-center gap-2 sm:space-x-3">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">#{order.id}</h3>
                        <Badge className={`${getStatusColor(order.status)} text-xs w-fit`}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(order.status)}
                            <span className="capitalize">{order.status}</span>
                          </div>
                        </Badge>
                      </div>
                      <span className="text-base sm:text-lg font-bold text-green-600">UGX {order.total.toLocaleString()}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                      <div className="min-w-0">
                        <p className="truncate" title={order.customerName}>
                          <strong>Customer:</strong> {order.customerName}
                        </p>
                        <p>
                          <strong>Phone:</strong> {order.phone}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <p>
                          <strong>Items:</strong> {order.items.length} products
                        </p>
                        <p>
                          <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {order.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            updateOrderStatus(order.id, "confirmed")
                          }}
                          disabled={loading}
                          className="bg-blue-600 hover:bg-blue-700 rounded-lg text-xs sm:text-sm flex-1 min-w-0 sm:flex-initial"
                        >
                          {loading ? 'Updating...' : 'Confirm'}
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
                          className="bg-green-600 hover:bg-green-700 rounded-lg text-xs sm:text-sm flex-1 min-w-0 sm:flex-initial"
                        >
                          {loading ? 'Updating...' : 'Delivered'}
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedOrder(order)
                        }}
                        className="rounded-lg text-xs sm:text-sm flex-1 min-w-0 sm:flex-initial"
                      >
                        <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 shrink-0" />
                        Details
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteOrder(order.id)
                        }}
                        disabled={loading}
                        className="rounded-lg text-xs sm:text-sm flex-1 min-w-0 sm:flex-initial"
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 shrink-0" />
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

        <div className="lg:col-span-1 min-w-0">
          {selectedOrder ? (
            <Card className="rounded-xl lg:sticky lg:top-24">
              <CardHeader className="px-4 sm:px-6">
                <CardTitle className="text-base sm:text-lg">Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-4 sm:px-6 pb-6">
                <div>
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">Order Information</h4>
                  <div className="space-y-1 text-xs sm:text-sm">
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
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">Customer Details</h4>
                  <div className="space-y-1 text-xs sm:text-sm break-words">
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
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">Order Items</h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between gap-2 text-xs sm:text-sm min-w-0">
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">UGX {(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-2 mt-2 space-y-1 text-xs sm:text-sm">
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
                      className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg text-sm"
                    >
                      {loading ? 'Updating...' : 'Confirm Order'}
                    </Button>
                  )}
                  {selectedOrder.status === "confirmed" && (
                    <Button
                      onClick={() => updateOrderStatus(selectedOrder.id, "delivered")}
                      disabled={loading}
                      className="w-full bg-green-600 hover:bg-green-700 rounded-lg text-sm"
                    >
                      {loading ? 'Updating...' : 'Mark as Delivered'}
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    onClick={() => deleteOrder(selectedOrder.id)}
                    disabled={loading}
                    className="w-full rounded-lg text-sm"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {loading ? 'Deleting...' : 'Delete Order'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="rounded-xl">
              <CardContent className="p-6 sm:p-8 text-center text-gray-500">
                <Eye className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-300" />
                <p className="text-sm sm:text-base">Select an order to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Delete All Confirmation Dialog */}
      {showDeleteAllConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md mx-auto">
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
