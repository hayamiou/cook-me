import { recipeSchema } from '@cook-me/schemas'
import z, { type ZodSchema } from 'zod'

type EventConfig = {
  payload: ZodSchema
}

const aiWorkerImagePayloadSchema = z.object({ callbackPayload: z.any(), imageKey: z.string() })

export type AIGeneratedEventNames = 'RecipeImageGenerated'

export const events = {
  RecipeCreated: { payload: recipeSchema } satisfies EventConfig,
  RecipeImageGenerated: { payload: aiWorkerImagePayloadSchema } satisfies EventConfig,
} as const
