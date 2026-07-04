import { create } from 'zustand'
import api from '../utils/api'

export const useCartStore = create((set, get) => ({
  items:  [],
  total:  '0',
  count:  0,

  fetchCart: async () => {
    try {
      const { data } = await api.get('/api/cart/')
      set({ items: data.items, total: data.total, count: data.count })
    } catch {}
  },

  addToCart: async (productId, qty = 1) => {
    const formData = new FormData()
    formData.append('action', 'post')
    formData.append('product_id', productId)
    formData.append('qty', qty)
    await api.post('/cart_add/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    get().fetchCart()
  },

  removeFromCart: async (productId) => {
    const formData = new FormData()
    formData.append('action', 'post')
    formData.append('product_id', productId)
    await api.post('/delete_cart/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    get().fetchCart()
  },
}))

export const useUserStore = create((set) => ({
  user: null,
  loaded: false,

  fetchUser: async () => {
    try {
      const { data } = await api.get('/api/user/')
      set({ user: data, loaded: true })
    } catch {
      set({ loaded: true })
    }
  },
}))

export const useProductsStore = create((set, get) => ({
  products: [],
  categories: [],
  totalPages: 1,
  currentPage: 1,
  totalCount: 0,
  loading: false,
  error: null,
  
  // Single product detail
  currentProduct: null,
  currentReviews: [],
  relatedProducts: [],
  productLoading: false,

  fetchProducts: async (params = {}) => {
    set({ loading: true, error: null })
    try {
      const query = new URLSearchParams(params).toString()
      const { data } = await api.get(`/api/products/?${query}`)
      set({ 
        products: data.products,
        categories: data.categories,
        totalPages: data.total_pages,
        currentPage: data.current_page,
        totalCount: data.total_count,
        loading: false
      })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  fetchProductDetail: async (id) => {
    set({ productLoading: true, error: null })
    try {
      const { data } = await api.get(`/api/products/${id}/`)
      set({
        currentProduct: data.product,
        currentReviews: data.reviews,
        relatedProducts: data.related,
        productLoading: false
      })
    } catch (err) {
      set({ error: err.message, productLoading: false })
    }
  }
}))
