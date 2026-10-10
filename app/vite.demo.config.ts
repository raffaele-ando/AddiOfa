// Build "demo": un unico file HTML con tutto incorporato (JS, CSS, font, immagini), per la pagina online (Artifact).
// Non tocca vite.config.ts (che resta quello dell'app normale). Uso: npm run build:demo → dist-demo/index.html
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Toglie dall'HTML ciò che la pagina online non può usare (font da Google, manifest, icone esterne).
function htmlPerArtifact(): Plugin {
  return {
    name: 'html-per-artifact',
    enforce: 'post',
    transformIndexHtml(html) {
      return html
        .replace(/<link[^>]+(fonts\.googleapis|fonts\.gstatic)[^>]*>\s*/g, '')
        .replace(/<link rel="(manifest|apple-touch-icon|icon)"[^>]*>\s*/g, '')
        .replace(/<meta name="viewport"[^>]*>\s*/g, '');
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), viteSingleFile(), htmlPerArtifact()],
  resolve: {
    dedupe: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'react-dom/client'],
    alias: { '@': path.resolve(__dirname, '.') },
  },
  build: {
    outDir: 'dist-demo',
    emptyOutDir: true,
    assetsInlineLimit: 100_000_000,
    cssCodeSplit: false,
    chunkSizeWarningLimit: 4000,
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
});
