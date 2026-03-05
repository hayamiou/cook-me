import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'
import { recipeIngredientSchema, recipeSchema } from '../../entities'

export const createRecipeDtoSchema = recipeSchema
  .omit({
    _id: true,
    imageKey: true,
    ingredients: true,
  })
  .extend({
    ingredients: z.array(recipeIngredientSchema).optional().default([]),
  })
  .strict()

// Pour typer, ex: fetch POST cote front
export type CreateRecipeType = z.infer<typeof createRecipeDtoSchema>

// A utiliser cote Nest pour valider les body
export class CreateRecipeDto extends createZodDto(createRecipeDtoSchema) {}
