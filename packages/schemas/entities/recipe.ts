import z from 'zod'

export const recipeSchema = z.object({
  name: z.string(),
  _id: z.any(),
})

export type RecipeEntity = z.infer<typeof recipeSchema>
