import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }

  override canActivate(context: ExecutionContext) {
    // DISABLE_AUTH=true → bypass JWT (dev only, never set in production)
    if (process.env['DISABLE_AUTH'] === 'true') {
      const request = context.switchToHttp().getRequest()
      request.user = { userId: 'dev-user', username: 'dev', email: 'dev@local', roles: [] }
      return true
    }

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    return super.canActivate(context)
  }
}
