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
