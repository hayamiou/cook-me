import { EventPattern, EventPayload } from '@cook-me/ms-utils'
import { Controller } from '@nestjs/common'
import { Ctx, NatsContext, Payload } from '@nestjs/microservices'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('RecipeCreated')
  //réception des messages (notifications) du broker
  async getNotifications(
    @Payload() data: EventPayload<'RecipeCreated'>,
    @Ctx() context: NatsContext,
  ) {
    console.log(`Subject: ${context.getSubject()}`, data)
    await this.appService.sendToAiQueue(data)
  }
}
