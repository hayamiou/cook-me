import { z } from 'zod'

export const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, 'Must be a valid MongoDB ObjectId')

export const RECIPE_UNITS = ['grammes', 'litres', 'sans'] as const
export const recipeUnitSchema = z.enum(RECIPE_UNITS)
export type RecipeUnit = z.infer<typeof recipeUnitSchema>

export const RECIPE_CATEGORIES = [
  'potages',
  'végés',
  'viandes',
  'poissons',
  'plats complets',
  'desserts',
] as const
export const recipeCategorySchema = z.enum(RECIPE_CATEGORIES)
export type RecipeCategory = z.infer<typeof recipeCategorySchema>

export const ingredientSchema = z
  .object({
    title: z.string().trim().min(1, 'title is required'),
    unit: recipeUnitSchema,
  })
  .strict()
export type IngredientEntity = z.infer<typeof ingredientSchema>

export const recipeIngredientSchema = z
  .object({
    ingredient: z.union([objectIdSchema, ingredientSchema, z.object({}).passthrough()]),
    quantity: z.number(),
  })
  .strict()
export type RecipeIngredientEntity = z.infer<typeof recipeIngredientSchema>

export const recipeSchema = z
  .object({
    _id: z.union([objectIdSchema, z.object({}).passthrough()]),
    name: z.string().trim().min(1, 'name is required'),
    idCreator: objectIdSchema,
    ingredients: z.array(recipeIngredientSchema).default([]),
    etapes: z.string().trim().optional(),
    isLiked: z.boolean().default(false),
    category: recipeCategorySchema,
    image: z.string().trim().min(1).optional(),
  })
  .strict()

export type RecipeEntity = z.infer<typeof recipeSchema>
