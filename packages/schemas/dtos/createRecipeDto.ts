import type z from 'zod'
import { recipeSchema } from '../entities'

export const createRecipeDtoSchema = recipeSchema
  .omit({
    _id: true,
  })
  .strict()

export type CreateRecipeDto = z.infer<typeof createRecipeDtoSchema>

export const patchRecipeDtoSchema = createRecipeDtoSchema.partial()
