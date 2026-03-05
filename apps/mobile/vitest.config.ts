import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./__tests__/setup.ts'],
    coverage: {
      exclude: [
        '**/*.config.*',
        '**/node_modules/**',
        'app/**',
        'assets/**',
        'constants/**',
        'components/**',
        'context/**',
        'contexts/**',
        'data/**',
        'lib/theme.ts',
        'lib/utils.ts',
        'hooks/useCreateRecipeScreen.ts',
        'hooks/useFavoritesScreen.ts',
        'hooks/useHomeScreen.ts',
        'hooks/usePanierScreen.ts',
        'hooks/useRecipeDetailsScreen.ts',
      ],
    },
  },
})
