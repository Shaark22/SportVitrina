import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      'trustee-overact-dimness.ngrok-free.dev',
      '.ngrok-free.dev',
      '.ngrok.io',
    ],
    proxy: {
      '/api': 'http://localhost:3001',
      '/uploads': 'http://localhost:3001',
    },
    watch: {
      ignored: ['**/server/data/**'],
    },
  },
})
