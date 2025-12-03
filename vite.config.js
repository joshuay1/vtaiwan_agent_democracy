/* eslint-env node */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/vtaiwan_agent_democracy/' : '/',
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
}))
