import { ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Test, TestingModule } from '@nestjs/testing'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'
import { JwtAuthGuard } from './jwt-auth.guard'

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard
  let reflector: Reflector

  const mockContext = {
    getHandler: vi.fn().mockReturnValue({}),
    getClass: vi.fn().mockReturnValue({}),
  } as unknown as ExecutionContext

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: vi.fn(),
          },
        },
      ],
    }).compile()

    guard = module.get<JwtAuthGuard>(JwtAuthGuard)
    reflector = module.get<Reflector>(Reflector)
  })

  it('should be defined', () => {
    expect(guard).toBeDefined()
  })

  it('should return true for public routes without triggering Passport', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true)

    const result = guard.canActivate(mockContext)

    expect(result).toBe(true)
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
      mockContext.getHandler(),
      mockContext.getClass(),
    ])
  })

  it('should delegate to Passport canActivate for non-public routes', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false)

    const parentPrototype = Object.getPrototypeOf(Object.getPrototypeOf(guard))
    const superCanActivateSpy = vi.spyOn(parentPrototype, 'canActivate').mockReturnValue(true)

    guard.canActivate(mockContext)

    expect(superCanActivateSpy).toHaveBeenCalledWith(mockContext)
  })
})
