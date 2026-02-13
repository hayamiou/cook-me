import z from 'zod'

export const recipeSchema = z.object({
  name: z.string(),
  _id: z.any(),
  idCreator: z.string(),
  steps: z.string().optional(),
})

export type RecipeEntity = z.infer<typeof recipeSchema>
