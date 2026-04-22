import { fileURLToPath, URL } from 'node:url' // <--- AÑADE ESTO
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // ESTO ES LO QUE FALTA: mapea el '@' a la carpeta 'src'
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    middlewareMode: false
  },
  appType: 'spa'
})