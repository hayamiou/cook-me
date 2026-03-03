import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

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
  _id: z.any(),
  title: z.string(),
  unit: unitEnumSchema,
})

export type IngredientEntity = z.infer<typeof ingredientSchema>

/* =========================
   INGREDIENT DANS RECETTE
========================= */

export const recipeIngredientSchema = z.object({
  // Accepte string (ObjectId sérialisé) OU objet peuplé
  ingredient: z.any(),
  quantity: z.number(),
})

export type RecipeIngredientEntity = z.infer<typeof recipeIngredientSchema>

/* =========================
   RECIPE
========================= */

export const recipeSchema = z.object({
  // Accepte string OU objet (côté Mongoose c'est Types.ObjectId, sérialisé en string via API)
  _id: z.any(),

  name: z.string(),
  idCreator: z.string(),
  etapes: z.string().optional(),

  // Pas de .default() ici → isLiked: boolean (requis), compatible avec la classe Mongoose
  isLiked: z.boolean(),

  category: categoryEnumSchema,
  image: z.string().trim().optional(),

  // Pas de .default() ici non plus → ingredients: RecipeIngredientEntity[]
  ingredients: z.array(recipeIngredientSchema),
})

export type RecipeEntity = z.infer<typeof recipeSchema>
export class RecipeEntityDto extends createZodDto(recipeSchema) {}
