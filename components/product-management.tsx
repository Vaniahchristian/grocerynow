"use client"
import type React from "react"
import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/types"
import { Plus, Edit, Trash2, Search } from "lucide-react"
import { NoInternet } from "@/components/no-internet"
import { isOfflineError } from "@/lib/network"
import { api } from "@/lib/productapi"

const API_BASE = "";

// Helper function to construct proper image URLs
const getImageUrl = (imagePath: string | null | undefined) => {
  if (!imagePath) return "/placeholder.svg"
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) return imagePath
  // If it's a relative path starting with /api, prepend the backend URL
  if (imagePath.startsWith('/api')) return `${API_BASE}${imagePath}`
  // Otherwise, assume it's a relative path and construct the full URL
  return `${API_BASE}/api/uploads/${imagePath}`
}

const categories = [
  "Fruits",
  "Greens&Vegetables",
  "Spices",
  "Herbs",
  "Diary&Poultry",
  "Meat&Seafood"
]

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)

  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    price: 0,
    category: "",
    description: "",
    unit: "",
    inStock: true,
    image: "/placeholder.svg?height=300&width=300",
    images: [],
    variants: [],
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [listError, setListError] = useState<string | null>(null)
  const [offline, setOffline] = useState(false)

  const fetchProducts = async () => {
    try {
      setListError(null)
      setOffline(false)
      try { console.log('fetchProducts -> start') } catch {}
      const data = await api.getProducts()
      setProducts(data)
      try { console.log('fetchProducts -> loaded', Array.isArray(data) ? data.length : 'n/a') } catch {}
    } catch (err) {
      console.error("Failed to load products:", err)
      if (isOfflineError(err)) {
        setOffline(true)
        setListError('No internet connection')
      } else {
        setListError('Failed to load products')
      }
    }
  }


  useEffect(()=>{
    fetchProducts()
  },[])

  const filteredProducts = products.filter(
    (product) =>
      (product.name &&
        product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.category &&
        product.category.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      try { console.log('handleSubmit -> start', { editing: !!editingProduct, id: editingProduct?.id }) } catch {}
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name || '')
      formDataToSend.append('price', formData.price?.toString() || '0')
      formDataToSend.append('category', formData.category || '')
      formDataToSend.append('description', formData.description || '')
      formDataToSend.append('unit', formData.unit || '')
      formDataToSend.append('inStock', formData.inStock ? 'true' : 'false')
      
      if ((formData.images?.length ?? 0) > 0) {
        formDataToSend.append('images', JSON.stringify(formData.images))
      }
      if ((formData.variants?.length ?? 0) > 0) {
        formDataToSend.append('variants', JSON.stringify(formData.variants))
      }
      
      if (selectedFile) {
        formDataToSend.append('image', selectedFile)
      }
      if (additionalFiles.length > 0) {
        for (const f of additionalFiles) {
          formDataToSend.append('additionalImages', f)
        }
      }
      try {
        const entries: any[] = []
        formDataToSend.forEach((v, k) => {
          if (typeof File !== 'undefined' && v instanceof File) {
            entries.push({ key: k, file: { name: v.name, type: v.type, size: v.size } })
          } else {
            entries.push({ key: k, value: String(v) })
          }
        })
        console.log('handleSubmit -> formData', entries)
      } catch {}

      if (editingProduct) {
        // Update existing product
        try { console.log('handleSubmit -> updating', editingProduct.id) } catch {}
        const updatedProduct = await api.updateProductFormData(editingProduct.id, formDataToSend)
        
        setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p))
        try { console.log('handleSubmit -> update success', updatedProduct?.id) } catch {}
        alert("Product has been successfully updated.")
        setEditingProduct(null)
      } else {
        // Add new product
        try { console.log('handleSubmit -> adding') } catch {}
        const newProduct = await api.addProduct(formDataToSend)
        
        setProducts([...products, newProduct])
        try { console.log('handleSubmit -> add success', newProduct?.id) } catch {}
        alert("New product has been successfully added.")
      }
      
      setShowAddForm(false)
      resetForm()
    } catch (err) {
      console.error('Error submitting form:', err)
      alert('Failed to save product. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      price: 0,
      category: "",
      description: "",
      unit: "",
      inStock: true,
      image: "/placeholder.svg?height=300&width=300",
      images: [],
      variants: [],
    })
    setSelectedFile(null)
    setAdditionalFiles([])
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData(product)
    setShowAddForm(true)
    // Scroll to form after state updates
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        try { console.log('handleDelete ->', id) } catch {}
        await api.deleteProduct(id)
        
        setProducts(products.filter((p) => p.id !== id))
        try { console.log('handleDelete -> success', id) } catch {}
        alert("Product has been successfully deleted.")
      } catch (err) {
        console.error('Error deleting product:', err)
        alert('Failed to delete product. Please try again.')
      }
    }
  }

  const handleCancel = () => {
    setShowAddForm(false)
    setEditingProduct(null)
    resetForm()
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 px-1 sm:px-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">Product Management</h1>
          <p className="text-sm text-gray-600 sm:text-base">Manage your store products</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 rounded-lg shrink-0">
          <Plus className="w-4 h-4 mr-2 shrink-0" />
          Add Product
        </Button>
      </div>

      {(showAddForm || editingProduct) && (
        <Card ref={formRef} className="rounded-xl">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-base sm:text-lg">{editingProduct ? "Edit Product" : "Add New Product"}</CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
                  required
                />
              </div>

              

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="e.g., per lb, per piece"
                  required
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              {/* Variants */}
              <div className="md:col-span-2 space-y-2">
                <Label>Variants (optional)</Label>
                <div className="space-y-3">
                  {(formData.variants ?? []).map((v: any, idx) => (
                    <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 items-end">
                      <div className="min-w-0">
                        <Label className="text-xs">Label</Label>
                        <Input
                          value={v?.label ?? ""}
                          onChange={(e) => {
                            const variants = [...(formData.variants ?? [])]
                            variants[idx] = { ...variants[idx], label: e.target.value }
                            setFormData({ ...formData, variants })
                          }}
                          placeholder="e.g., 500g"
                        />
                      </div>
                      <div className="min-w-0">
                        <Label className="text-xs">Unit</Label>
                        <Input
                          value={v?.unit ?? ""}
                          onChange={(e) => {
                            const variants = [...(formData.variants ?? [])]
                            variants[idx] = { ...variants[idx], unit: e.target.value }
                            setFormData({ ...formData, variants })
                          }}
                          placeholder="e.g., per pack"
                        />
                      </div>
                      <div className="min-w-0">
                        <Label className="text-xs">Price</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={typeof v?.price === 'number' ? v.price : 0}
                          onChange={(e) => {
                            const variants = [...(formData.variants ?? [])]
                            const n = Number.parseFloat(e.target.value || '0')
                            variants[idx] = { ...variants[idx], price: Number.isNaN(n) ? 0 : n }
                            setFormData({ ...formData, variants })
                          }}
                          placeholder="0"
                        />
                      </div>
                      
                      <div className="flex gap-2 sm:col-span-2 md:col-span-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto"
                          onClick={() => {
                            const variants = (formData.variants ?? []).filter((_: any, i: number) => i !== idx)
                            setFormData({ ...formData, variants })
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const id = (typeof crypto !== 'undefined' && (crypto as any).randomUUID) ? (crypto as any).randomUUID() : Math.random().toString(36).slice(2)
                      setFormData({ ...formData, variants: [...(formData.variants ?? []), { id, label: "", unit: formData.unit || "piece", price: 0 }] })
                    }}
                  >
                    Add Variant
                  </Button>
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="image">Product Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
              </div>

              {/* Additional Images */}
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="additionalImages">Upload Additional Images (optional)</Label>
                <Input
                  id="additionalImages"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || [])
                    if (files.length) setAdditionalFiles((prev) => [...prev, ...files])
                  }}
                />
                {additionalFiles.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {additionalFiles.map((file, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-24 object-cover rounded-md border"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="mt-1 w-full"
                          onClick={() => setAdditionalFiles((prev) => prev.filter((_, i) => i !== idx))}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <Label className="mt-4">Additional Image URLs (optional)</Label>
                <div className="space-y-2">
                  {(formData.images ?? []).map((url, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row gap-2 min-w-0">
                      <Input
                        value={url}
                        onChange={(e) => {
                          const images = [...(formData.images ?? [])]
                          images[idx] = e.target.value
                          setFormData({ ...formData, images })
                        }}
                        placeholder="https://..."
                        className="min-w-0"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="shrink-0 w-full sm:w-auto"
                        onClick={() => {
                          const images = (formData.images ?? []).filter((_, i) => i !== idx)
                          setFormData({ ...formData, images })
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFormData({ ...formData, images: [...(formData.images ?? []), ""] })}
                  >
                    Add Image URL
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="inStock">Stock Status</Label>
                <select
                  id="inStock"
                  value={formData.inStock ? 'true' : 'false'}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.value === 'true' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="true">In Stock</option>
                  <option value="false">Out of Stock</option>
                </select>
              </div>

              <div className="md:col-span-2 flex flex-col-reverse sm:flex-row gap-2 sm:gap-4">
                <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 rounded-lg w-full sm:w-auto">
                  {loading ? 'Saving...' : (editingProduct ? "Update Product" : "Add Product")}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel} className="rounded-lg bg-transparent w-full sm:w-auto" disabled={loading}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-xl">
        <CardHeader className="px-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base sm:text-lg">Products ({filteredProducts.length})</CardTitle>
            <div className="relative w-full sm:w-64 min-w-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          {listError ? (
            offline ? (
              <NoInternet onRetry={fetchProducts} />
            ) : (
              <div className="text-center py-8 text-red-600">{listError}</div>
            )
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden min-w-0">
                  <div className="aspect-square bg-gray-100">
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  <div className="p-3 sm:p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base truncate" title={product.name}>{product.name}</h3>
                        <Badge variant="outline" className="text-xs mb-2">
                          {product.category}
                        </Badge>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(product)} className="rounded-lg h-8 w-8 p-0" aria-label="Edit">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-700 rounded-lg h-8 w-8 p-0"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2 min-w-0">{product.description}</p>
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <div className="min-w-0">
                        <span className="text-base sm:text-lg font-bold text-green-600">UGX {product.price.toLocaleString()}</span>
                        <span className="text-xs sm:text-sm text-gray-500 ml-1">{product.unit}</span>
                      </div>
                      <Badge variant={product.inStock ? "default" : "secondary"} className="text-xs shrink-0">
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
