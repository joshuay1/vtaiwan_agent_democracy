/* eslint-env node */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
const base = globalThis.process?.env?.BASE_PATH || '/'

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    fs: {
      // Allow serving files from the monorepo root for dev-time @fs fetches
      allow: [
        // project root
        '.',
        // workspace root to read outputs/* in dev via /@fs
        '/Users/joyang/Projects/ai_agents',
      ],
    },
  },
})
