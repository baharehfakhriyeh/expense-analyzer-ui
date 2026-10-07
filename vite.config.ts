import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = `http://${env.API_HOST || 'localhost'}:${env.API_PORT || '8087'}`

  return {
    plugins: [react(), tailwindcss()],
    define: { __API_ORIGIN__: JSON.stringify(apiTarget) },
    server: {
      host: env.UI_HOST || '127.0.0.1',
      port: Number(env.UI_PORT || 5173),
      strictPort: true,
      proxy: {
        '/api': { target: apiTarget, changeOrigin: true },
      },
    },
  }
})
