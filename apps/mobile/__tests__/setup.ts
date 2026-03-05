import { vi } from 'vitest'

// react-native n'est pas disponible dans jsdom — on fournit un stub minimal
vi.mock('react-native', () => ({
  Platform: { OS: 'ios' },
  Alert: { alert: vi.fn() },
  StyleSheet: { create: (s: unknown) => s },
}))
