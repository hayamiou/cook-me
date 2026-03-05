import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { HydratedDocument } from 'mongoose'
import { UnitEnum } from '../../recipes/schemas/recipe.schema'

export type IngredientDocument = HydratedDocument<Ingredient>

@Schema({ timestamps: true })
export class Ingredient {
  @Prop({ required: true })
  title!: string

  @Prop({ required: true, enum: UnitEnum })
  unit!: string
}

export const IngredientSchema = SchemaFactory.createForClass(Ingredient)
