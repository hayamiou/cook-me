import { ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Test } from '@nestjs/testing'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { JwtAuthGuard } from './jwt-auth.guard'

const mockReflector = {
  getAllAndOverride: vi.fn(),
}

// Simule AuthGuard('jwt') sans appel réseau
vi.mock('@nestjs/passport', () => ({
  AuthGuard: () => {
    return class {
      canActivate() {
        return true
      }
    }
  },
}))

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [JwtAuthGuard, { provide: Reflector, useValue: mockReflector }],
    }).compile()

    guard = module.get(JwtAuthGuard)
    vi.clearAllMocks()
  })

  const mockRequest = () => ({})

  const mockContext = (handler = {}, cls = {}, request = mockRequest()) =>
    ({
      getHandler: () => handler,
      getClass: () => cls,
      switchToHttp: () => ({ getRequest: () => request }),
    }) as unknown as ExecutionContext

  it('bypass le JWT quand DISABLE_AUTH=true', () => {
    process.env['DISABLE_AUTH'] = 'true'
    const request = mockRequest()

    const result = guard.canActivate(mockContext({}, {}, request))

    expect(result).toBe(true)
    expect((request as Record<string, unknown>).user).toMatchObject({ userId: 'dev-user' })

    delete process.env['DISABLE_AUTH']
  })

  it('autorise une route publique sans vérifier le JWT', () => {
    mockReflector.getAllAndOverride.mockReturnValue(true)

    const result = guard.canActivate(mockContext())

    expect(result).toBe(true)
    expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith('isPublic', expect.any(Array))
  })

  it('délègue à AuthGuard pour une route protégée', () => {
    mockReflector.getAllAndOverride.mockReturnValue(false)

    const result = guard.canActivate(mockContext())

    expect(result).toBe(true)
  })
})
