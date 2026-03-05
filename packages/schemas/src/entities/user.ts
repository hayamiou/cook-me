import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'
import { objectIdSchema } from '../utils'

/* =========================
   USER
========================= */

export const userSchema = z.object({
  // Accepte string OU ObjectId sérialisé
  _id: objectIdSchema,

  // ID venant du provider SSO (Auth0, Keycloak, etc.)
  ssoId: z.string().trim().min(1, 'ssoId is required'),

  // Tableau des recettes likées (références)
  likedRecipes: z.array(objectIdSchema).default([]),
})

export type UserEntity = z.infer<typeof userSchema>

export class UserEntityDto extends createZodDto(userSchema) {}
