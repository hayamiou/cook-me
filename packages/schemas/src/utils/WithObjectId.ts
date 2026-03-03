import type { Types } from 'mongoose'
import z from 'zod'

export type WithObjectId<T> = {
  [K in keyof T]: K extends '_id' ? Types.ObjectId : T[K]
}

export const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, 'Must be a valid MongoDB ObjectId')
