import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // ensures correct asset paths in production
  base: '/',

  // only used during local development
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000', // local backend only
        changeOrigin: true,
        secure: false
      }
    }
  },

  // required for Render (vite preview server)
  preview: {
    host: true,
    allowedHosts: true   // allow all hosts (fixes Render domain issue)
  }
})
