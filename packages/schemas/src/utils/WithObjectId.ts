import type { Types } from 'mongoose'
import z from 'zod'

export type WithObjectId<T, IdKey extends string = '_id'> = {
  [K in keyof T]: K extends IdKey ? Types.ObjectId : T[K]
}

export const objectIdSchema = z.union([
  z
    .string()
    .trim()
    .regex(/^[a-f\d]{24}$/i, 'Must be a valid MongoDB ObjectId'),
  z.object<Types.ObjectId>(),
])
