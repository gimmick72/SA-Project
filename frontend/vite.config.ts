import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api': { target: 'http://localhost:8080', changeOrigin: true },
    },
  },
  resolve: {
    alias: {
      '@c': path.resolve(__dirname, 'src/components'),
      '@interface': path.resolve(__dirname, 'src/interface'),
      '@service': path.resolve(__dirname, 'src/services'), // <— สำคัญ
    },
  },
})