import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Set base to your GitHub repo name, e.g. '/dna-keycards-editor/'
// If using a custom domain or user/org page, set base to '/'
export default defineConfig({
  plugins: [react()],
  base: '/meccmax-dna-keycard-editor/',
})
