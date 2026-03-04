import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export interface CurrentUserData {
  userId: string
  email?: string
  username?: string
  roles: string[]
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentUserData => {
    const request = ctx.switchToHttp().getRequest()
    return request.user
  },
)
