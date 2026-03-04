import { RecipeEntity } from '@cook-me/schemas'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { string } from 'zod'

export type RecipeDocument = Recipe & Document

//Enum pour les unités
export enum UnitEnum {
  GRAMMES = 'grammes',
  LITRES = 'litres',
  CUILLERE_A_SOUPE = 'cuillere_a_soupe',
  CUILLERE_A_CAFE = 'cuillere_a_cafe',
  SANS = 'sans',
}

//Enum pour les catégories
export enum CategoryEnum {
  POTAGES = 'potages',
  VEGES = 'végés',
  VIANDES = 'viandes',
  POISSONS = 'poissons',
  PLATS_COMPLETS = 'plats complets',
  DESSERTS = 'desserts',
}

//Sous-schema Ingredient
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

//Schema principal Recipe
@Schema({ timestamps: true })
export class Recipe implements RecipeEntity {
  _id!: Types.ObjectId

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
          required: false,
        },
      },
    ],
    default: [],
  })
  ingredients!: {
    ingredient: Types.ObjectId
    quantity: number
  }[]

  @Prop({ required: true })
  name!: string

  @Prop({ required: true })
  idCreator!: string

  @Prop({ required: false })
  steps!: string

  @Prop({ required: false })
  imageKey?: string

  @Prop({
    type: Boolean,
    default: false,
  })
  isLiked!: boolean

  @Prop({
    type: String,
    enum: CategoryEnum,
    required: true,
  })
  category!: CategoryEnum
}

export const IngredientSchema = SchemaFactory.createForClass(Ingredient)
export const RecipeSchema = SchemaFactory.createForClass(Recipe)
