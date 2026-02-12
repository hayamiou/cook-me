export type RecipeIngredientEntity = {
  ingredient: string
  quantity: number
}

export class RecipeEntity {
  id!: string
  name!: string
  idCreator!: string
  ingredients!: RecipeIngredientEntity[]
  etapes?: string
  createdAt?: Date
  updatedAt?: Date
}
