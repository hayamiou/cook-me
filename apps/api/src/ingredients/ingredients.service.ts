import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Ingredient, IngredientDocument } from './schemas/ingredient.schema'

@Injectable()
export class IngredientsService {
  constructor(
    @InjectModel(Ingredient.name)
    private readonly ingredientModel: Model<IngredientDocument>,
  ) {}

  findAll() {
    return this.ingredientModel.find().exec()
  }
}
