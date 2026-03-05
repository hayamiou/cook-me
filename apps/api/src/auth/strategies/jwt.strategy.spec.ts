import { UnauthorizedException } from '@nestjs/common'
import { describe, expect, it } from 'vitest'
import { JwtStrategy } from './jwt.strategy'

// On instancie directement sans NestJS pour tester validate()
// La configuration JWKS est mockée via les variables d'environnement
vi.mock('jwks-rsa', () => ({
  passportJwtSecret: vi.fn().mockReturnValue(vi.fn()),
}))

describe('JwtStrategy', () => {
  let strategy: JwtStrategy

  beforeEach(() => {
    strategy = new JwtStrategy()
  })

  describe('validate', () => {
    it('retourne les données utilisateur depuis un payload valide', async () => {
      const payload = {
        sub: 'user-uuid-123',
        email: 'test@cook-me.fr',
        preferred_username: 'testuser',
        realm_access: { roles: ['user', 'admin'] },
      }

      const result = await strategy.validate(payload)

      expect(result).toEqual({
        userId: 'user-uuid-123',
        email: 'test@cook-me.fr',
        username: 'testuser',
        roles: ['user', 'admin'],
      })
    })

    it('retourne un tableau de rôles vide si realm_access est absent', async () => {
      const payload = {
        sub: 'user-uuid-123',
        email: 'test@cook-me.fr',
        preferred_username: 'testuser',
      }

      const result = await strategy.validate(payload)

      expect(result.roles).toEqual([])
    })

    it('lève UnauthorizedException si sub est absent', async () => {
      const payload = { email: 'test@cook-me.fr' } as any

      await expect(strategy.validate(payload)).rejects.toThrow(UnauthorizedException)
    })
  })
})
