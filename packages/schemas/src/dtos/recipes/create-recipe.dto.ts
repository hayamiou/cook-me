import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, 'Must be a valid MongoDB ObjectId')

export const createRecipeDtoSchema = z
  .object({
    name: z.string().trim().min(1, 'name is required'),
    idCreator: objectIdSchema,
    ingredients: z
      .array(
        z
          .object({
            ingredient: objectIdSchema,
            quantity: z.number().positive('quantity must be greater than 0'),
          })
          .strict(),
      )
      .min(1, 'at least one ingredient is required'),
    etapes: z.string().trim().optional(),
    category: z.string(),
  })
  .strict()

// Pour typer, ex: fetch POST cote front
export type CreateRecipeType = z.infer<typeof createRecipeDtoSchema>

// A utiliser cote Nest pour valider les body
export class CreateRecipeDto extends createZodDto(createRecipeDtoSchema) {}
