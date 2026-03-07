import type { Product, Category, Order } from "./types"

// Category images matched to labels (Unsplash, w=400&h=400&fit=crop)
export const categories: Category[] = [
  {
    id: "1",
    name: "Fruits",
    image: "/fruits.jpg",
    productCount: 25,
  },
  {
    id: "2",
    name: "Greens&Vegetables",
    image: "/greens and vegetables.jpg",
    productCount: 15,
  },
  {
    id: "3",
    name: "Spices",
    image: "/spices.jpg",
    productCount: 20,
  },
  {
    id: "4",
    name: "Herbs",
    image: "/herbs.jpg",
    productCount: 30,
  },
  {
    id: "5",
    name: "Diary&Poultry",
    image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop",
    productCount: 18,
  },
  {
    id: "6",
    name: "Meat&Seafood",
    image: "https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=400&fit=crop",
    productCount: 22,
  },
]

