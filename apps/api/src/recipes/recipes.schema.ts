import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema()
export class Recipe extends Document {
  @Prop({ required: true })
  name!: string

  @Prop({ default: Date.now })
  createdAt!: Date
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe)
