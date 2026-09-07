import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

/**
 * 아티팩트 배포용 빌드.
 *
 * 아티팩트는 외부 호스트 요청이 전부 CSP로 막히므로, 청크를 나누면
 * 로드되지 않습니다. 코드 스플리팅을 끄고 JS 하나로 뽑은 뒤
 * scripts/build-artifact.mjs 가 HTML에 인라인합니다.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    outDir: 'dist-artifact',
    assetsInlineLimit: 100_000_000,
    cssCodeSplit: false,
    modulePreload: { polyfill: false },
    rollupOptions: {
      output: { inlineDynamicImports: true, manualChunks: undefined },
    },
  },
})
