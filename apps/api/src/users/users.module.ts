import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Recipe, RecipeSchema } from '../recipes/schemas/recipe.schema'
import { User, UserSchema } from './schemas/user.schema'

import { UserController } from './users.controller'
import { UserRepository } from './users.repository'
import { UserService } from './users.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Recipe.name, schema: RecipeSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UsersModule {}
