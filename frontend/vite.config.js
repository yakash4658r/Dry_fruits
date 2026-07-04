import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
export default defineConfig(({ command }) => ({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // Proxy all API calls to Django backend
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
      // Proxy auth routes
      '/accounts': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
      // Proxy media files
      '/media': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
      // Proxy cart/payment endpoints
      '/cart_add': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/cart': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/cart_update': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/delete_cart': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/payment': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/wishlist': { target: 'http://127.0.0.1:8000', changeOrigin: true },
    },
  },
}))
