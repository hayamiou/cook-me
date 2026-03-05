import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock expo-secure-store (module natif non disponible en jsdom)
vi.mock('expo-secure-store', () => ({
  getItemAsync: vi.fn(),
  setItemAsync: vi.fn(),
  deleteItemAsync: vi.fn(),
}))

import * as SecureStore from 'expo-secure-store'
import { apiClient } from '../lib/api-client'

const mockFetch = vi.fn()
global.fetch = mockFetch

function mockResponse(data: unknown, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  } as Response)
}

describe('ApiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('get', () => {
    it('ajoute le Bearer token quand un token est stocké', async () => {
      vi.mocked(SecureStore.getItemAsync).mockResolvedValue('mon-token-jwt')
      mockFetch.mockReturnValue(mockResponse({ recipes: [] }))

      await apiClient.get('/recipes')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/recipes'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer mon-token-jwt',
          }),
        }),
      )
    })

    it("n'ajoute pas d'Authorization si aucun token", async () => {
      vi.mocked(SecureStore.getItemAsync).mockResolvedValue(null)
      mockFetch.mockReturnValue(mockResponse({ recipes: [] }))

      await apiClient.get('/recipes')

      const callArgs = mockFetch.mock.calls[0][1]
      expect(callArgs.headers).not.toHaveProperty('Authorization')
    })

    it('retourne la réponse JSON parsée', async () => {
      vi.mocked(SecureStore.getItemAsync).mockResolvedValue(null)
      mockFetch.mockReturnValue(mockResponse({ name: 'Tarte' }))

      const result = await apiClient.get<{ name: string }>('/recipes/1')

      expect(result).toEqual({ name: 'Tarte' })
    })
  })

  describe('post', () => {
    it('envoie le body en JSON', async () => {
      vi.mocked(SecureStore.getItemAsync).mockResolvedValue('token')
      mockFetch.mockReturnValue(mockResponse({ _id: '1', name: 'Tarte' }))

      await apiClient.post('/recipes', { name: 'Tarte', category: 'dessert' })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/recipes'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'Tarte', category: 'dessert' }),
        }),
      )
    })
  })

  describe('gestion des erreurs', () => {
    it('lève UNAUTHORIZED sur une réponse 401', async () => {
      vi.mocked(SecureStore.getItemAsync).mockResolvedValue('token-expiré')
      mockFetch.mockReturnValue(mockResponse({ message: 'Unauthorized' }, 401))

      await expect(apiClient.get('/recipes')).rejects.toThrow('UNAUTHORIZED')
    })

    it('lève une erreur HTTP sur toute réponse non-ok', async () => {
      vi.mocked(SecureStore.getItemAsync).mockResolvedValue(null)
      mockFetch.mockReturnValue(mockResponse({ message: 'Not Found' }, 404))

      await expect(apiClient.get('/recipes/inexistant')).rejects.toThrow('HTTP 404')
    })

    it('bypass auth si requiresAuth est false', async () => {
      mockFetch.mockReturnValue(mockResponse({ status: 'ok' }))

      await apiClient.get('/health', { requiresAuth: false })

      expect(SecureStore.getItemAsync).not.toHaveBeenCalled()
    })
  })
})
