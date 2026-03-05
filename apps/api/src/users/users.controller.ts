import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { UserService } from './users.service'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me/liked-recipes')
  async getMyLikedRecipes(@Req() req: Request & { user: { userId: string } }) {
    return this.userService.getLikedRecipes(req.user.userId)
  }
}
