"use client"

import React, { createContext, useContext, useReducer, type ReactNode } from "react"
import type { Product } from "./types"
import { useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"



const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api'

export interface CartItem {
  id: number           // cart item ID from database
  product_id: number   // actual product ID
  quantity: number
  price_at_time: number // price when added to cart
  // Product fields from JOIN
  name: string
  image: string
  unit: string
  category: string
  // Computed price field
  price: number
}

interface CartState {
  items: CartItem[]
  total: number
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Product }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } }
  | { type: "CLEAR_CART" }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
  addToCart: (product: Product, quantity?: number) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
} | null>(null)

function cartReducer(state: CartState, action: CartAction | { type: 'HYDRATE'; payload: CartState }): CartState {
  console.log('🛒 Cart Reducer - Action:', action.type, 'Payload:', 'payload' in action ? action.payload : 'none')
  console.log('🛒 Cart Reducer - Current State:', state)
  
  switch (action.type) {
    case "ADD_ITEM":
      // ADD_ITEM is handled by backend API calls, this is just for local state consistency
      console.log('🛒 ADD_ITEM action - handled by backend API')
      return state

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload)
      return {
        items: newItems,
        total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      }
    }

    case "UPDATE_QUANTITY": {
      const updatedItems = state.items
        .map((item) =>
          item.id === action.payload.id ? { ...item, quantity: Math.max(0, action.payload.quantity) } : item,
        )
        .filter((item) => item.quantity > 0)

      return {
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      }
    }

    case "CLEAR_CART":
      return { items: [], total: 0 }

    case "HYDRATE":
      return action.payload
    default:
      return state
  }
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  // Hydrate cart from backend when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      fetch(`${API_BASE}/cart/${user.id}`)
        .then(res => res.json())
        .then(data => {
          const items = (data.items || []).map((item: any) => ({
            ...item,
            price: item.price_at_time ?? item.price, // normalize price
          }));
          dispatch({ type: "HYDRATE", payload: {
            items,
            total: items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
          }});
        });
    } else {
      // Optionally, clear cart for guests or hydrate from localStorage if you want guest carts
      dispatch({ type: "HYDRATE", payload: { items: [], total: 0 } });
    }
  }, [isAuthenticated, user]);

  // Add or update cart item
  const addToCart = async (product: Product, quantity: number = 1): Promise<void> => {
    if (!user) return;
    await fetch(`${API_BASE}/cart/${user.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: product.id,
        quantity,
        price: product.price,
      }),
    });
    // Re-fetch cart
    const res = await fetch(`${API_BASE}/cart/${user.id}`);
    const data = await res.json();
    const items = (data.items || []).map((item: any) => ({
      ...item,
      price: item.price_at_time ?? item.price,
    }));
    dispatch({ type: "HYDRATE", payload: {
      items,
      total: items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
    }});
  };

  // Remove cart item
  const removeFromCart = async (itemId: string): Promise<void> => {
    if (!user) return;
    await fetch(`${API_BASE}/cart/${user.id}/${itemId}`, { method: "DELETE" });
    // Re-fetch cart
    const res = await fetch(`${API_BASE}/cart/${user.id}`);
    const data = await res.json();
    const items = (data.items || []).map((item: any) => ({
      ...item,
      price: item.price_at_time ?? item.price,
    }));
    dispatch({ type: "HYDRATE", payload: {
      items,
      total: items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
    }});
  };

  // Clear cart
  const clearCart = async (): Promise<void> => {
    if (!user) return;
    await fetch(`${API_BASE}/cart/${user.id}`, { method: "DELETE" });
    dispatch({ type: "HYDRATE", payload: { items: [], total: 0 } });
  };

  return (
    <CartContext.Provider value={{ state, dispatch, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
