import { ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { vi } from 'vitest'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'
import { JwtAuthGuard } from './jwt-auth.guard'

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard
  let reflector: Reflector

  beforeEach(() => {
    reflector = new Reflector()
    guard = new JwtAuthGuard(reflector)
  })

  function makeContext(type: string): ExecutionContext {
    return {
      getType: () => type,
      getHandler: () => ({}),
      getClass: () => ({}),
      getArgByIndex: vi.fn(),
      getArgs: vi.fn(),
      switchToHttp: vi.fn(),
      switchToRpc: vi.fn(),
      switchToWs: vi.fn(),
    } as unknown as ExecutionContext
  }

  it('should bypass auth for non-HTTP (NATS/RPC) contexts', () => {
    const context = makeContext('rpc')
    expect(guard.canActivate(context)).toBe(true)
  })

  it('should bypass auth for routes decorated with @Public()', () => {
    const context = makeContext('http')
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true)
    expect(guard.canActivate(context)).toBe(true)
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
  })

  it('should call super.canActivate for non-public HTTP routes', () => {
    const context = makeContext('http')
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false)
    // super.canActivate calls passport — spy on parent prototype to assert it is called
    const parentCanActivate = vi
      .spyOn(Object.getPrototypeOf(JwtAuthGuard.prototype), 'canActivate')
      .mockReturnValue(true)
    expect(guard.canActivate(context)).toBe(true)
    expect(parentCanActivate).toHaveBeenCalledWith(context)
    parentCanActivate.mockRestore()
  })
})
