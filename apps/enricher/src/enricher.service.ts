import { EventPayload } from '@cook-me/ms-utils'
import { AIGeneratedEventNames } from '@cook-me/ms-utils/events'
import { RecipeEntity } from '@cook-me/schemas'
import { InjectQueue } from '@nestjs/bullmq'
import { Injectable } from '@nestjs/common'
import axios, { AxiosError } from 'axios'
import { Queue } from 'bullmq'

type RecipeImageGeneratedPayloadCallback = { id: string }

type AIQueue<T extends AIGeneratedEventNames = AIGeneratedEventNames> = Queue<{
  prompt: string
  callbackEvent: { name: T; payload: RecipeImageGeneratedPayloadCallback }
}>

type RecipeImageGeneratedPayload = EventPayload<'RecipeImageGenerated'> & {
  callbackPayload: RecipeImageGeneratedPayloadCallback
}

@Injectable()
export class EnricherService {
  constructor(@InjectQueue('aiQueue') private aiQueue: AIQueue) {}

  async enrichWithGeneratedImage(recipe: RecipeEntity) {
    await this.aiQueue.add(recipe._id, {
      prompt: recipe.name,
      callbackEvent: {
        name: 'RecipeImageGenerated',
        payload: { id: recipe._id },
      },
    })
  }
}
