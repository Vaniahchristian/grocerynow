export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  description: string
  unit: string
  inStock: boolean
  images?: string[]
  variants?: Array<{
    id: string
    label: string
    unit: string
    price: number
  }>
}

export interface Category {
  id: string
  name: string
  image: string
  productCount: number
}

export interface Order {
  id: string
  customerName: string
  phone: string
  location: string
  deliveryZone?: string
  notes: string
  items: Array<{
    productId: string
    productName: string
    quantity: number
    price: number
  }>
  subtotal?: number
  deliveryFee?: number
  total: number
  status: "pending" | "confirmed" | "delivered"
  createdAt: string
}
