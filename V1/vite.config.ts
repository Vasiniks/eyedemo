import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// Source uses root-absolute URLs ('/v1film/…', href="/services"). When built
// with a sub-path base (GitHub Pages: --base=/eyedemo/), prefix them so the
// site works under that path. No-op for the default base '/'.
function prefixRootUrls(): Plugin {
  let base = '/'
  return {
    name: 'prefix-root-urls',
    enforce: 'pre',
    configResolved(config) {
      base = config.base
    },
    transform(code, id) {
      if (base === '/' || !/\/src\/.*\.(tsx?|json)$/.test(id)) return
      return code
        .replace(/(["'`(])\/(v1film|env|fonts|web)\//g, `$1${base}$2/`)
        .replace(/href=(["'])\/(?!\/)/g, `href=$1${base}`)
    },
  }
}

// EyeQ Vision Care cinematic homepage — Lane A scaffold.
// Static-host SPA fallback: `public/_redirects` + postbuild copy of
// index.html -> dist/404.html (see package.json `postbuild`).
export default defineConfig({
  plugins: [prefixRootUrls(), react()],
})
