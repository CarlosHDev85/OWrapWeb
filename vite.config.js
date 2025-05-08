import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["8c1a-198-48-254-188.ngrok-free.app"]
  },
  resolve: {
    alias: {
      process: 'process/browser',
      buffer: 'buffer'
    }
  },
  optimizeDeps: {
    include: ['process', 'buffer']
  },
  define: {
    global: 'globalThis'
  }
})
