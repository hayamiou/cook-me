import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { HydratedDocument } from 'mongoose'

export type IngredientDocument = HydratedDocument<Ingredient>

@Schema({ timestamps: true })
export class Ingredient {
  @Prop({ required: true })
  title: string

  @Prop({
    required: true,
    enum: ['grammes', 'litres', 'cuillere_a_soupe', 'cuillere_a_cafe', 'sans'],
  })
  unit: string
}

export const IngredientSchema = SchemaFactory.createForClass(Ingredient)
