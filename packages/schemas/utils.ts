import type { Types } from 'mongoose'

export type WithObjectId<T> = {
  [K in keyof T]: K extends '_id' ? Types.ObjectId : T[K]
}
