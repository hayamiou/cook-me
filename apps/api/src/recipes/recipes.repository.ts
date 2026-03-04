import { type CreateRecipeDto } from '@cook-me/schemas'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Recipe, RecipeDocument } from './schemas/recipe.schema'

@Injectable()
export class RecipesRepository {
  constructor(
    @InjectModel(Recipe.name)
    private readonly recipeModel: Model<RecipeDocument>,
  ) {}

  create(data: CreateRecipeDto) {
    return this.recipeModel.create(data)
  }

  findAll() {
    return this.recipeModel.find().exec()
  }

  findAllWithIngredients() {
    return this.recipeModel.find().populate('ingredients.ingredient').exec()
  }
}
