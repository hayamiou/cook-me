// ─── Palettes de couleurs pour le thème clair et sombre ──────────────────────
export const LIGHT = {
  primary: '#F4A623',
  primaryLight: '#FDEABF',
  background: '#FAFAF7',
  surface: '#FFFFFF',
  text: '#1A1A1A',
  textMuted: '#8A8A8A',
  border: '#EFEFEF',
  heart: '#E05555',
  danger: '#E05555',
  searchBg: '#FFFFFF',
  cardBg: '#FFFFFF',
  checked: '#F4A62318',
  overlay: 'rgba(0,0,0,0.45)',
  statusBar: 'dark-content' as const,
}

export const DARK = {
  primary: '#F4A623',
  primaryLight: '#3D2E10',
  background: '#111111',
  surface: '#1E1E1E',
  text: '#F0F0F0',
  textMuted: '#888888',
  border: '#2C2C2C',
  heart: '#E05555',
  danger: '#E05555',
  searchBg: '#1E1E1E',
  cardBg: '#1E1E1E',
  checked: '#3D2E10',
  overlay: 'rgba(0,0,0,0.65)',
  statusBar: 'light-content' as const,
}

// Type helper pour TypeScript
export type Theme = typeof LIGHT
