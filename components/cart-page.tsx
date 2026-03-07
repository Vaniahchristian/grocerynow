"use client"

import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { getImageUrl } from "@/lib/image-utils"

export function CartPage() {
  const { state, dispatch, removeFromCart } = useCart()

  const updateQuantity = async (id: number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(String(id))
    } else {
      // For quantity updates, we'll use the dispatch to update local state
      // The backend sync happens through the cart context
      dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
    }
  }

  const handleRemoveItem = async (id: number) => {
    await removeFromCart(String(id))
  }

  if (state.items.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Add some products to get started</p>
        <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 rounded-xl">
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-4">
          {state.items.map((item) => (
            <Card key={item.id} className="rounded-xl">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0"
                      crossOrigin="anonymous"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                      <p className="text-sm text-gray-600 truncate">{item.category}</p>
                      <p className="text-base sm:text-lg font-bold text-green-600">
                        UGX {item.price.toLocaleString()} {item.unit}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end space-x-2">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={async () => await updateQuantity(item.id, item.quantity - 1)}
                        className="rounded-lg h-8 w-8 sm:h-10 sm:w-10"
                      >
                        <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={async (e) => await updateQuantity(item.id, Number.parseInt(e.target.value) || 0)}
                        className="w-12 sm:w-16 text-center h-8 sm:h-10"
                        min="0"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={async () => await updateQuantity(item.id, item.quantity + 1)}
                        className="rounded-lg h-8 w-8 sm:h-10 sm:w-10"
                      >
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <p className="font-bold text-gray-900 text-sm sm:text-base">
                        UGX {(item.price * item.quantity).toLocaleString()}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={async () => await handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg h-8 w-8 p-0"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="lg:sticky lg:top-24 rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm sm:text-base">
                <span>Subtotal</span>
                <span className="font-medium">UGX {state.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span>Delivery Fee</span>
                <span className="font-medium">Calculated at checkout</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-base sm:text-lg">
                  <span>Total</span>
                  <span>UGX {state.total.toLocaleString()}</span>
                </div>
              </div>
              <Button asChild className="w-full bg-green-600 hover:bg-green-700 rounded-xl" size="lg">
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
