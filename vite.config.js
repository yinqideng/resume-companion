import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        followRedirects: true,
        // 支持 SSE 流式传输
        proxyTimeout: 30000,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  }
})
