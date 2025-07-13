import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    open: '/.quux_hidden_app.html',
  },
  build: {
    rollupOptions: {
      input: {
        app: './quux_hidden_app.html',
      },
    },
  },
})
