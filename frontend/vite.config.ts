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
    port: 8080, // Asegura que usa el puerto correcto
    hmr: {
      protocol: 'wss',      // HTTPS → wss
      host: 'localhost',    // o tu dominio real
      port: 8080,
      clientPort: 8080,     // donde el cliente debe conectar
    },
    // Proxy para las llamadas a /api que pasan a Nginx en el puerto 8081
    proxy: {
      '/api': {
        target: 'http://nginx:8081', // el servicio Nginx interno
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
