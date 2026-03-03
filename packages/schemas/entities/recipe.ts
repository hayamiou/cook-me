import { ObjectId } from 'mongodb'
import z from 'zod'

export const recipeSchema = z.object({
  name: z.string(),
  _id: z.union([z.string(), z.instanceof(ObjectId)]),
  idCreator: z.string(),
  steps: z.string().optional(),
})

export type RecipeEntity = z.infer<typeof recipeSchema>
