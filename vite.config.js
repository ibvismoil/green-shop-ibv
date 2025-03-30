import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  images: {
    domains: ['firebasestorage.googleapis.com', 'res.cloudinary.com'], 
  },
})
