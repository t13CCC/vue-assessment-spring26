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
    host: '0.0.0.0',                                                                                                                                                                
    port: 5176,
    proxy: {
    '/api': {
      target: 'http://10.119.11.220:8080',
      changeOrigin: true,
    },
  }
  }
})