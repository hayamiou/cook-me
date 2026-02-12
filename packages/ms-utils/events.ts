import { recipeSchema } from '@cook-me/schemas'
import type { ZodSchema } from 'zod'

type EventConfig = {
  payload: ZodSchema
}

export const events = {
  RecipeCreated: { payload: recipeSchema } satisfies EventConfig,
  // ... autres events
} as const
