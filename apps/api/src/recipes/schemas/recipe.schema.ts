import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type RecipeDocument = HydratedDocument<Recipe>

/**
 * Enum pour les unités
 */
export enum UnitEnum {
  GRAMMES = 'grammes',
  LITRES = 'litres',
  SANS = 'sans',
}

/**
 * Sous-schema Ingredient
 */
@Schema()
export class Ingredient {
  @Prop({ required: true })
  title!: string

  @Prop({
    required: true,
    enum: UnitEnum,
  })
  unit!: UnitEnum
}

/**
 * Schema principal Recipe
 */
@Schema({ timestamps: true })
export class Recipe {
  @Prop({
    type: [
      {
        ingredient: {
          type: Types.ObjectId,
          ref: Ingredient.name,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    default: [],
  })
  ingredients!: {
    ingredient: Types.ObjectId | (Ingredient & { _id: Types.ObjectId })
    quantity: number
  }[]

  @Prop({ required: true })
  name!: string

  @Prop({ required: true })
  idCreator!: string

  @Prop({ required: false })
  etapes!: string

  createdAt?: Date
  updatedAt?: Date
}

export const IngredientSchema = SchemaFactory.createForClass(Ingredient)
export const RecipeSchema = SchemaFactory.createForClass(Recipe)
