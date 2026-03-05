import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type UserDocument = User & Document

@Schema({ timestamps: true })
export class User {
  _id!: Types.ObjectId

  // ID SSO venant de ton provider (Auth0, Keycloak, etc.)
  @Prop({
    required: true,
    unique: true,
    index: true,
  })
  ssoId!: string

  //Tableau des recettes likées par l'utilisateur
  @Prop({
    type: [Types.ObjectId],
    ref: 'Recipe',
    default: [],
  })
  likedRecipes!: Types.ObjectId[]
}

export const UserSchema = SchemaFactory.createForClass(User)
