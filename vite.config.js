import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  define: {
    'global': 'window'
  },
  server:{
    proxy: {
    '/api': {
      target: 'http://10.240.193.220:8080',
      changeOrigin: true,
    },
  }
  }
})