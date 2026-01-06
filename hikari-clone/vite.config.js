import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // === 👇👇👇 必须加上这一段 👇👇👇 ===
  server: {
    host: '0.0.0.0', // 允许局域网访问
    port: 5173,      // 前端端口
    proxy: {
      '/a': {        // 碰到以 /a 开头的请求...
        target: 'http://127.0.0.1:8000', // ...就转发给 8000 端口的 Django
        changeOrigin: true,
      }
    }
  }
  // ====================================
})