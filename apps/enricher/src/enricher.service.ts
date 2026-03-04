import { AIGeneratedEventNames } from '@cook-me/ms-utils/events'
import { RecipeEntity } from '@cook-me/schemas'
import { InjectQueue } from '@nestjs/bullmq'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bullmq'

type RecipeImageGeneratedPayloadCallback = { id: string }

type AIQueue<T extends AIGeneratedEventNames = AIGeneratedEventNames> = Queue<{
  prompt: string
  callbackEvent: { name: T; payload: RecipeImageGeneratedPayloadCallback }
}>

@Injectable()
export class EnricherService {
  constructor(@InjectQueue('aiQueue') private aiQueue: AIQueue) {}

  async enrichWithGeneratedImage(recipe: RecipeEntity) {
    const id = `${recipe._id}`
    await this.aiQueue.add(id, {
      prompt: recipe.name,
      callbackEvent: {
        name: 'RecipeImageGenerated',
        payload: { id },
      },
    })
  }
}
