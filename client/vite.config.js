import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    proxy: {
      '/api': {
        target: 'https://hertz-way-1-frontend.onrender.com',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: 'localhost'
      }
    }
  }
})
