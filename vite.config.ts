// https://ko.vite.dev/config/#using-environment-variables-in-config
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import path from 'node:path'
import fs from 'node:fs'
import type { ResolvedConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
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
        [env.VITE_API_URL]: {
          target: env.API_PROXY_TO,
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${env.VITE_API_URL}`), ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              // pass origin header to target server to avoid CORS error
              // 로컬에서 백엔드까지 구동하는 경우 대소문자 구분하는 경우가 있어서 Origin, Referer로 설정
              proxyReq.setHeader('Origin', 'http://localhost:5173')
              proxyReq.setHeader('Referer', 'http://localhost:5173')
            })
          },
        },
      },
    },
  }
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
