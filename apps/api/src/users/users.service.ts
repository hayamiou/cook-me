import { Injectable, NotFoundException } from '@nestjs/common'
import { UserRepository } from './users.repository'

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getLikedRecipes(userId: string) {
    const recipes = await this.userRepository.findLikedRecipesByUserId(userId)

    if (recipes === null) {
      throw new NotFoundException('User not found')
    }

    return recipes
  }
}
