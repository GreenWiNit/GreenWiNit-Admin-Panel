import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import path from 'node:path'
import fs from 'node:fs'
import type { ResolvedConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    // https://community.cloudflare.com/t/cloudflare-pages-truncates-urls-by-removing-the-html-extension/609238
    renameIndexHtmlPlugin('quux_hidden_app.html.html'),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://api.greenwinit.store',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            // pass origin header to target server to avoid CORS error
            proxyReq.setHeader('origin', 'https://www.greenwinit.store')
          })
        },
      },
    },
  },
})

function renameIndexHtmlPlugin(newName: string) {
  let outDir = 'dist'
  return {
    name: 'rename-index-html',
    configResolved(resolvedConfig: ResolvedConfig) {
      outDir = resolvedConfig.build.outDir || 'dist'
    },
    closeBundle() {
      // 빌드 모드에서만 동작
      if (process.env.NODE_ENV !== 'production') return
      const oldPath = path.join(outDir, 'index.html')
      const newPath = path.join(outDir, newName)
      if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath)
      }
    },
  }
}
