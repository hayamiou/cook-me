import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RecipeDocument = Recipe & Document;

/**
 * Enum pour les unités
 */
export enum UnitEnum {
  GRAMMES = 'grammes',
  LITRES = 'litres',
  UNITES = 'unités',
}

/**
 * Sous-schema Ingredient
 */
@Schema({ _id: true })
export class Ingredient {
  @Prop({ required: true })
  title: string;

  @Prop({
    required: true,
    min: 0,
  })
  quantity: number;

  @Prop({
    required: true,
    enum: UnitEnum,
  })
  unit: UnitEnum;
}

/**
 * Schema principal Recipe
 */
@Schema({ timestamps: true })
export class Recipe {
  @Prop({
    type: [Ingredient],
    required: true,
    default: [],
  })
  ingredients: Ingredient[];
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
