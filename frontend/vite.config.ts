import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  envDir: '/etc', // Cambia la ruta del directorio de variables de entorno
  server: {
    watch: {
      usePolling: true, // Permite que Vite detecte cambios en Docker
    },
    host: true, // Hace que Vite escuche en 0.0.0.0
    port: 5173, // Asegura que usa el puerto correcto
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
