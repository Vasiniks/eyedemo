import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// EyeQ Vision Care cinematic homepage — Lane A scaffold.
// Static-host SPA fallback: `public/_redirects` + postbuild copy of
// index.html -> dist/404.html (see package.json `postbuild`).
export default defineConfig({
  plugins: [react()],
})
