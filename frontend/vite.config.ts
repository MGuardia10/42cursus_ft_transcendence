import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true, // Permite que Vite detecte cambios en Docker
    },
    host: true, // Hace que Vite escuche en 0.0.0.0
    port: 5173, // Asegura que usa el puerto correcto
  },
})
