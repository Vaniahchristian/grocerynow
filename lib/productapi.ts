import type { Product, Category } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'
if (typeof console !== 'undefined') {
  try { console.log('API_BASE_URL', API_BASE_URL) } catch {}
}

// API utility functions
export const api = {
  // Products
  async getProducts(): Promise<Product[]> {
    try {
      const url = `${API_BASE_URL}/products`
      console.log('getProducts ->', url)
      const response = await fetch(url)
      console.log('getProducts status', response.status)
      if (!response.ok) {
        let text = ''
        try { text = await response.text() } catch {}
        console.error('getProducts failed', response.status, text)
        throw new Error(`HTTP error! status: ${response.status} ${text}`)
      }
      const data = await response.json()
      try { console.log('getProducts count', Array.isArray(data) ? data.length : 'n/a') } catch {}

      // Transform backend data to match frontend Product type
      return data.map((product: any) => {
        let images: string[] | undefined
        const collect: string[] = []
        if (Array.isArray(product.images)) {
          collect.push(...product.images)
        } else if (typeof product.images === 'string') {
          try { const parsed = JSON.parse(product.images); if (Array.isArray(parsed)) collect.push(...parsed) } catch { collect.push(...product.images.split(',').map((s: string) => s.trim())) }
        }
        if (Array.isArray((product as any).additionalImages)) {
          collect.push(...(product as any).additionalImages)
        } else if (typeof (product as any).additionalImages === 'string') {
          try { const parsed = JSON.parse((product as any).additionalImages); if (Array.isArray(parsed)) collect.push(...parsed) } catch { collect.push(...String((product as any).additionalImages).split(',').map((s: string) => s.trim())) }
        }
        if (Array.isArray((product as any).gallery)) {
          collect.push(...(product as any).gallery)
        } else if (typeof (product as any).gallery === 'string') {
          try { const parsed = JSON.parse((product as any).gallery); if (Array.isArray(parsed)) collect.push(...parsed) } catch { collect.push(...String((product as any).gallery).split(',').map((s: string) => s.trim())) }
        }
        const deduped = Array.from(new Set([product.image, ...collect].filter(Boolean)))
        if (deduped.length) images = deduped

        let variants: Array<{ id: string; label: string; unit: string; price: number }> | undefined
        if (Array.isArray(product.variants)) {
          variants = product.variants.map((v: any, idx: number) => ({
            id: (v.id ?? `${product.id}-${idx}`).toString(),
            label: v.label ?? v.name ?? `Option ${idx+1}`,
            unit: v.unit ?? product.unit ?? 'piece',
            price: Number(v.price) || 0,
          }))
        } else if (typeof product.variants === 'string') {
          try {
            const parsed = JSON.parse(product.variants)
            if (Array.isArray(parsed)) {
              variants = parsed.map((v: any, idx: number) => ({
                id: (v.id ?? `${product.id}-${idx}`).toString(),
                label: v.label ?? v.name ?? `Option ${idx+1}`,
                unit: v.unit ?? product.unit ?? 'piece',
                price: Number(v.price) || 0,
              }))
            }
          } catch {}
        }

        return {
          id: product.id.toString(),
          name: product.name || 'Unknown Product',
          price: Number(product.price) || 0,
          image: product.image || '/placeholder-product.jpg',
          category: product.category || 'Uncategorized',
          description: product.description || 'No description available',
          unit: product.unit || 'piece',
          inStock: product.inStock !== 0,
          images,
          variants,
        }
      })
    } catch (error) {
      console.error('Error fetching products:', error)
      throw error
    }
  },

  async getProduct(id: string): Promise<Product> {
    try {
      const url = `${API_BASE_URL}/products/${id}`
      console.log('getProduct ->', url)
      const response = await fetch(url)
      console.log('getProduct status', response.status)
      if (!response.ok) {
        let text = ''
        try { text = await response.text() } catch {}
        console.error('getProduct failed', response.status, text)
        throw new Error(`HTTP error! status: ${response.status} ${text}`)
      }
      const data = await response.json()

      // Transform backend data to match frontend Product type
      let images: string[] | undefined
      const collect: string[] = []
      if (Array.isArray(data.images)) {
        collect.push(...data.images)
      } else if (typeof data.images === 'string') {
        try { const parsed = JSON.parse(data.images); if (Array.isArray(parsed)) collect.push(...parsed) } catch { collect.push(...data.images.split(',').map((s: string) => s.trim())) }
      }
      if (Array.isArray((data as any).additionalImages)) {
        collect.push(...(data as any).additionalImages)
      } else if (typeof (data as any).additionalImages === 'string') {
        try { const parsed = JSON.parse((data as any).additionalImages); if (Array.isArray(parsed)) collect.push(...parsed) } catch { collect.push(...String((data as any).additionalImages).split(',').map((s: string) => s.trim())) }
      }
      if (Array.isArray((data as any).gallery)) {
        collect.push(...(data as any).gallery)
      } else if (typeof (data as any).gallery === 'string') {
        try { const parsed = JSON.parse((data as any).gallery); if (Array.isArray(parsed)) collect.push(...parsed) } catch { collect.push(...String((data as any).gallery).split(',').map((s: string) => s.trim())) }
      }
      const deduped = Array.from(new Set([data.image, ...collect].filter(Boolean)))
      if (deduped.length) images = deduped

      let variants: Array<{ id: string; label: string; unit: string; price: number }> | undefined
      if (Array.isArray(data.variants)) {
        variants = data.variants.map((v: any, idx: number) => ({
          id: (v.id ?? `${data.id}-${idx}`).toString(),
          label: v.label ?? v.name ?? `Option ${idx+1}`,
          unit: v.unit ?? data.unit ?? 'piece',
          price: Number(v.price) || 0,
        }))
      } else if (typeof data.variants === 'string') {
        try {
          const parsed = JSON.parse(data.variants)
          if (Array.isArray(parsed)) {
            variants = parsed.map((v: any, idx: number) => ({
              id: (v.id ?? `${data.id}-${idx}`).toString(),
              label: v.label ?? v.name ?? `Option ${idx+1}`,
              unit: v.unit ?? data.unit ?? 'piece',
              price: Number(v.price) || 0,
            }))
          }
        } catch {}
      }

      return {
        id: data.id.toString(),
        name: data.name || 'Unknown Product',
        price: Number(data.price) || 0,
        image: data.image || '/placeholder-product.jpg',
        category: data.category || 'Uncategorized',
        description: data.description || 'No description available',
        unit: data.unit || 'piece',
        inStock: data.inStock !== 0,
        images,
        variants,
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      throw error
    }
  },

  async getRelatedProducts(category: string, excludeId: string, limit: number = 4): Promise<Product[]> {
    try {
      const url = `${API_BASE_URL}/products?category=${encodeURIComponent(category)}&exclude=${excludeId}&limit=${limit}`
      console.log('getRelatedProducts ->', url)
      const response = await fetch(url)
      console.log('getRelatedProducts status', response.status)
      if (!response.ok) {
        let text = ''
        try { text = await response.text() } catch {}
        console.error('getRelatedProducts failed', response.status, text)
        throw new Error(`HTTP error! status: ${response.status} ${text}`)
      }
      const data = await response.json()
      try { console.log('getRelatedProducts count', Array.isArray(data) ? data.length : 'n/a') } catch {}

      // Transform backend data to match frontend Product type
      return data.map((product: any) => ({
        id: product.id.toString(),
        name: product.name || 'Unknown Product',
        price: Number(product.price) || 0,
        image: product.image || '/placeholder-product.jpg',
        category: product.category || 'Uncategorized',
        description: product.description || 'No description available',
        unit: product.unit || 'piece',
        inStock: product.inStock !== 0,
        
      }))
    } catch (error) {
      console.error('Error fetching related products:', error)
      throw error
    }
  },

  async getCategories(): Promise<Category[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      
      // Transform backend data to match frontend Category type
      return data.map((category: any) => ({
        id: category.id.toString(),
        name: category.name,
        image: category.image || '/placeholder-category.jpg',
        productCount: category.productCount || 0
      }))
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    }
  },

  async addProduct(productData: FormData): Promise<Product> {
    try {
      const url = `${API_BASE_URL}/products`
      const entries: any[] = []
      try {
        productData.forEach((v, k) => {
          if (typeof File !== 'undefined' && v instanceof File) {
            entries.push({ key: k, file: { name: v.name, type: v.type, size: v.size } })
          } else {
            entries.push({ key: k, value: String(v) })
          }
        })
        console.log('addProduct formData', entries)
      } catch {}
      const response = await fetch(url, {
        method: 'POST',
        body: productData
      })
      console.log('addProduct status', response.status)
      if (!response.ok) {
        let text = ''
        try { text = await response.text() } catch {}
        console.error('addProduct failed', response.status, text)
        throw new Error(`HTTP error! status: ${response.status} ${text}`)
      }
      const data = await response.json()
      try { console.log('addProduct success id', data?.id) } catch {}
      
      return {
        id: data.id.toString(),
        name: data.name || 'Unknown Product',
        price: Number(data.price) || 0,
        image: data.image || '/placeholder-product.jpg',
        category: data.category || 'Uncategorized',
        description: data.description || 'No description available',
        unit: data.unit || 'piece',
        inStock: data.inStock !== 0,
        
        // images/variants may echo back depending on backend; try parse
        images: (() => {
          try {
            const collect: string[] = []
            if (Array.isArray((data as any).images)) collect.push(...(data as any).images)
            else if (typeof (data as any).images === 'string') {
              try { const parsed = JSON.parse((data as any).images); if (Array.isArray(parsed)) collect.push(...parsed) } catch { collect.push(...String((data as any).images).split(',').map((s: string) => s.trim())) }
            }
            if (Array.isArray((data as any).additionalImages)) collect.push(...(data as any).additionalImages)
            else if (typeof (data as any).additionalImages === 'string') {
              try { const parsed = JSON.parse((data as any).additionalImages); if (Array.isArray(parsed)) collect.push(...parsed) } catch { collect.push(...String((data as any).additionalImages).split(',').map((s: string) => s.trim())) }
            }
            if (Array.isArray((data as any).gallery)) collect.push(...(data as any).gallery)
            else if (typeof (data as any).gallery === 'string') {
              try { const parsed = JSON.parse((data as any).gallery); if (Array.isArray(parsed)) collect.push(...parsed) } catch { collect.push(...String((data as any).gallery).split(',').map((s: string) => s.trim())) }
            }
            const deduped = Array.from(new Set([data.image, ...collect].filter(Boolean)))
            return deduped.length ? deduped : undefined
          } catch { return undefined }
        })(),
        variants: (() => { try { const v = typeof data.variants === 'string' ? JSON.parse(data.variants) : data.variants; return Array.isArray(v) ? v.map((x: any, idx: number) => ({ id: (x.id ?? `${data.id}-${idx}`).toString(), label: x.label ?? x.name ?? `Option ${idx+1}`, unit: x.unit ?? data.unit ?? 'piece', price: Number(x.price) || 0 })) : undefined } catch { return undefined } })()
      }
    } catch (error) {
      console.error('Error adding product:', error)
      throw error
    }
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    try {
      const url = `${API_BASE_URL}/products/${id}`
      console.log('updateProduct ->', url, updates)
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      })
      console.log('updateProduct status', response.status)
      if (!response.ok) {
        let text = ''
        try { text = await response.text() } catch {}
        console.error('updateProduct failed', response.status, text)
        throw new Error(`HTTP error! status: ${response.status} ${text}`)
      }
      const data = await response.json()
      
      return {
        id: data.id.toString(),
        name: data.name || 'Unknown Product',
        price: Number(data.price) || 0,
        image: data.image || '/placeholder-product.jpg',
        category: data.category || 'Uncategorized',
        description: data.description || 'No description available',
        unit: data.unit || 'piece',
        inStock: data.inStock !== 0,
        
        images: (() => {
          try {
            const collect: string[] = []
            if (Array.isArray((data as any).images)) collect.push(...(data as any).images)
            else if (typeof (data as any).images === 'string') {
              try { const parsed = JSON.parse((data as any).images); if (Array.isArray(parsed)) collect.push(...parsed) } catch { collect.push(...String((data as any).images).split(',').map((s: string) => s.trim())) }
            }
            if (Array.isArray((data as any).additionalImages)) collect.push(...(data as any).additionalImages)
            else if (typeof (data as any).additionalImages === 'string') {
              try { const parsed = JSON.parse((data as any).additionalImages); if (Array.isArray(parsed)) collect.push(...parsed) } catch { collect.push(...String((data as any).additionalImages).split(',').map((s: string) => s.trim())) }
            }
            if (Array.isArray((data as any).gallery)) collect.push(...(data as any).gallery)
            else if (typeof (data as any).gallery === 'string') {
              try { const parsed = JSON.parse((data as any).gallery); if (Array.isArray(parsed)) collect.push(...parsed) } catch { collect.push(...String((data as any).gallery).split(',').map((s: string) => s.trim())) }
            }
            const deduped = Array.from(new Set(collect.filter(Boolean)))
            return deduped.length ? deduped : undefined
          } catch { return undefined }
        })(),
        variants: (() => { try { const v = typeof data.variants === 'string' ? JSON.parse(data.variants) : data.variants; return Array.isArray(v) ? v.map((x: any, idx: number) => ({ id: (x.id ?? `${data.id}-${idx}`).toString(), label: x.label ?? x.name ?? `Option ${idx+1}`, unit: x.unit ?? data.unit ?? 'piece', price: Number(x.price) || 0 })) : undefined } catch { return undefined } })()
      }
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  },

  async updateProductFormData(id: string, productData: FormData): Promise<Product> {
    try {
      const url = `${API_BASE_URL}/products/${id}`
      const entries: any[] = []
      try {
        productData.forEach((v, k) => {
          if (typeof File !== 'undefined' && v instanceof File) {
            entries.push({ key: k, file: { name: v.name, type: v.type, size: v.size } })
          } else {
            entries.push({ key: k, value: String(v) })
          }
        })
        console.log('updateProductFormData formData', { id }, entries)
      } catch {}
      const response = await fetch(url, {
        method: 'PATCH',
        body: productData
      })
      console.log('updateProductFormData status', response.status)
      if (!response.ok) {
        let text = ''
        try { text = await response.text() } catch {}
        console.error('updateProductFormData failed', response.status, text)
        throw new Error(`HTTP error! status: ${response.status} ${text}`)
      }
      const data = await response.json()
      
      return {
        id: data.id.toString(),
        name: data.name || 'Unknown Product',
        price: Number(data.price) || 0,
        image: data.image || '/placeholder-product.jpg',
        category: data.category || 'Uncategorized',
        description: data.description || 'No description available',
        unit: data.unit || 'piece',
        inStock: data.inStock !== 0,
        images: (() => {
          try {
            const collect: string[] = []
            if (Array.isArray((data as any).images)) collect.push(...(data as any).images)
            else if (typeof (data as any).images === 'string') {
              try { const parsed = JSON.parse((data as any).images); if (Array.isArray(parsed)) collect.push(...parsed) } catch { collect.push(...String((data as any).images).split(',').map((s: string) => s.trim())) }
            }
            if (Array.isArray((data as any).additionalImages)) collect.push(...(data as any).additionalImages)
            else if (typeof (data as any).additionalImages === 'string') {
              try { const parsed = JSON.parse((data as any).additionalImages); if (Array.isArray(parsed)) collect.push(...parsed) } catch { collect.push(...String((data as any).additionalImages).split(',').map((s: string) => s.trim())) }
            }
            if (Array.isArray((data as any).gallery)) collect.push(...(data as any).gallery)
            else if (typeof (data as any).gallery === 'string') {
              try { const parsed = JSON.parse((data as any).gallery); if (Array.isArray(parsed)) collect.push(...parsed) } catch { collect.push(...String((data as any).gallery).split(',').map((s: string) => s.trim())) }
            }
            const deduped = Array.from(new Set(collect.filter(Boolean)))
            return deduped.length ? deduped : undefined
          } catch { return undefined }
        })(),
        variants: (() => { try { const v = typeof data.variants === 'string' ? JSON.parse(data.variants) : data.variants; return Array.isArray(v) ? v.map((x: any, idx: number) => ({ id: (x.id ?? `${data.id}-${idx}`).toString(), label: x.label ?? x.name ?? `Option ${idx+1}`, unit: x.unit ?? data.unit ?? 'piece', price: Number(x.price) || 0 })) : undefined } catch { return undefined } })()
      }
    } catch (error) {
      console.error('Error updating product with form data:', error)
      throw error
    }
  },

  async deleteProduct(id: string): Promise<void> {
    try {
      const url = `${API_BASE_URL}/products/${id}`
      console.log('deleteProduct ->', url)
      const response = await fetch(url, {
        method: 'DELETE'
      })
      console.log('deleteProduct status', response.status)
      if (!response.ok) {
        let text = ''
        try { text = await response.text() } catch {}
        console.error('deleteProduct failed', response.status, text)
        throw new Error(`HTTP error! status: ${response.status} ${text}`)
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  }
}
