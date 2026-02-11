import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./test/vitest.setup.ts'],
    include: [
      'test/**/*.test.ts',
      'src/**/*.test.ts',
      'test/**/*.spec.ts',
      'src/**/*.spec.ts',
      'test/**/*.e2e-spec.ts',
    ],
  },
  plugins: [
    // esbuild does not support emitting metadata, nest needs that
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
  resolve: {
    alias: {
      src: resolve(__dirname, './src'),
    },
  },
})
