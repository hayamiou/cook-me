import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Recipe, RecipeDocument } from '../recipes/schemas/recipe.schema'
import { User, UserDocument } from './schemas/user.schema'

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    @InjectModel(Recipe.name)
    private readonly recipeModel: Model<RecipeDocument>,
  ) {}

  async findLikedRecipesByUserId(userId: string) {
    const user = await this.userModel.findOne({ userId }).lean()

    if (!user) return null
    if (!user.likedRecipes.length) return []

    return this.recipeModel
      .find({
        _id: { $in: user.likedRecipes },
      })
      .lean()
  }
}
