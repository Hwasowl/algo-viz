import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: './',
  // OneDrive 한글 경로 회피용 캐시 디렉토리는 로컬 Windows에서만 사용.
  // CI(Linux) 등 다른 환경에서는 Vite 기본값을 쓴다.
  cacheDir: process.platform === 'win32' ? 'C:/tmp/algo-viz-build' : undefined,
})
