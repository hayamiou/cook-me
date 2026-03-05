import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockPush = vi.fn()

vi.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}))

import { useLoginScreen } from '../hooks/useLoginScreen'

describe('useLoginScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initialise les champs à vide et showPwd à false', () => {
    const { result } = renderHook(() => useLoginScreen())

    expect(result.current.email).toBe('')
    expect(result.current.password).toBe('')
    expect(result.current.showPwd).toBe(false)
  })

  it('isFormValid est false si les champs sont vides', () => {
    const { result } = renderHook(() => useLoginScreen())

    expect(result.current.isFormValid).toBe(false)
  })

  it('isFormValid est true si email ET password sont remplis', () => {
    const { result } = renderHook(() => useLoginScreen())

    act(() => {
      result.current.setEmail('test@cook-me.fr')
      result.current.setPassword('password123')
    })

    expect(result.current.isFormValid).toBe(true)
  })

  it('isFormValid est false si seulement email est rempli', () => {
    const { result } = renderHook(() => useLoginScreen())

    act(() => {
      result.current.setEmail('test@cook-me.fr')
    })

    expect(result.current.isFormValid).toBe(false)
  })

  it('toggleShowPwd bascule la visibilité du mot de passe', () => {
    const { result } = renderHook(() => useLoginScreen())

    act(() => result.current.toggleShowPwd())
    expect(result.current.showPwd).toBe(true)

    act(() => result.current.toggleShowPwd())
    expect(result.current.showPwd).toBe(false)
  })

  it('onLogin navigue vers /accueil', () => {
    const { result } = renderHook(() => useLoginScreen())

    act(() => result.current.onLogin())

    expect(mockPush).toHaveBeenCalledWith('/accueil')
  })

  it('onSkip navigue vers /accueil sans connexion', () => {
    const { result } = renderHook(() => useLoginScreen())

    act(() => result.current.onSkip())

    expect(mockPush).toHaveBeenCalledWith('/accueil')
  })
})
