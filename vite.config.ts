import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      // routeFilePrefix: 'quux_hidden_app',
      // addExtensions: true,
    }),
    react(),
    tailwindcss(),
  ],
  server: {
    // open: './quux_hidden_app.html',
    // base: '/quux_hidden_app',
  },
  build: {
    rollupOptions: {
      input: {
        app: './quux_hidden_app.html',
      },
    },
  },
})
