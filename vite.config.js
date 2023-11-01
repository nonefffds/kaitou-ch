import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    fallback: false, // Disable fallback behavior
    proxy: {
      '/api': {
        target: 'https://qezrh5rdak.execute-api.ap-northeast-1.amazonaws.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/default/phantom-vote'),
        headers: {
          'Access-Control-Allow-Origin': 'https://kaitou-ch.site',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, POST',
          'Access-Control-Allow-Credentials': 'true'
        }
      }
    }
  }
})
