import { createZodDto } from 'nestjs-zod'
import type { z } from 'zod'
import { recipeSchema } from '../../entities'

export const createRecipeDtoSchema = recipeSchema
  .omit({
    _id: true,
    imageKey: true,
    isLiked: true,
  })
  .strict()

// Pour typer, ex: fetch POST cote front
export type CreateRecipeType = z.infer<typeof createRecipeDtoSchema>

// A utiliser cote Nest pour valider les body
export class CreateRecipeDto extends createZodDto(createRecipeDtoSchema) {}
