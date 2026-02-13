import type z from 'zod'
import { recipeSchema } from '../entities'

export const enrichRecipeDtoSchema = recipeSchema
  .pick({
    _id: true,
    name: true,
  })
  .strict()

export type EnrichRecipeDto = z.infer<typeof enrichRecipeDtoSchema>
