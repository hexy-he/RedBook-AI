import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { complianceApiPlugin } from './server/complianceApi.js'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  Object.assign(process.env, {
    DEEPSEEK_API_KEY: env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY,
    DEEPSEEK_MODEL: env.DEEPSEEK_MODEL || process.env.DEEPSEEK_MODEL,
    DEEPSEEK_BASE_URL: env.DEEPSEEK_BASE_URL || process.env.DEEPSEEK_BASE_URL,
  })

  return {
    plugins: [react(), complianceApiPlugin()],
    resolve: {
      alias: { '@': path.resolve(process.cwd(), 'src') },
    },
    server: { host: true, port: 5173 },
  }
})
