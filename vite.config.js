import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    proxy: {
      // Proxy Judge.me private API to avoid browser CORS during local dev
      '/__proxy/judgeme-private': {
        target: 'https://api.judge.me',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/__proxy\/judgeme-private/, ''),
      },
      // Proxy Judge.me public widget API
      '/__proxy/judgeme-public': {
        target: 'https://judge.me',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/__proxy\/judgeme-public/, ''),
      },
    },
  },
})
