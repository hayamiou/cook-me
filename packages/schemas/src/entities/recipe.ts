import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'
import { objectIdSchema } from '../utils'

/* =========================
   ENUMS
========================= */

export const unitEnumSchema = z.enum(['grammes', 'litres', 'sans'])
export const categoryEnumSchema = z.enum([
  'potages',
  'végés',
  'viandes',
  'poissons',
  'plats complets',
  'desserts',
])

/* =========================
   INGREDIENT
========================= */

export const ingredientSchema = z.object({
  _id: objectIdSchema,
  title: z.string(),
  unit: unitEnumSchema,
})

export type IngredientEntity = z.infer<typeof ingredientSchema>

/* =========================
   INGREDIENT DANS RECETTE
========================= */

export const recipeIngredientSchema = z
  .object({
    ingredient: objectIdSchema,
    quantity: z.number().positive('quantity must be greater than 0'),
  })
  .strict()

export type RecipeIngredientEntity = z.infer<typeof recipeIngredientSchema>

/* =========================
   RECIPE
========================= */

export const recipeSchema = z.object({
  // Accepte string OU objet (côté Mongoose c'est Types.ObjectId, sérialisé en string via API)
  _id: objectIdSchema,

  name: z.string().trim().min(1, 'name is required'),
  idCreator: z.string(),
  steps: z.string().optional(),
  category: categoryEnumSchema,
  imageKey: z.string().trim().optional(),

  // Pas de .default() ici non plus → ingredients: RecipeIngredientEntity[]
  ingredients: z.array(recipeIngredientSchema).min(1, 'at least one ingredient is required'),
})

export type RecipeEntity = z.infer<typeof recipeSchema>
export class RecipeEntityDto extends createZodDto(recipeSchema) {}
