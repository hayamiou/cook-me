import { ClientProxy, EventPattern, EventPayload } from '@cook-me/ms-utils'
import { Controller, Inject } from '@nestjs/common'
import { Ctx, NatsContext, Payload } from '@nestjs/microservices'
import { EnricherService } from './enricher.service'

@Controller()
export class EnricherController {
  constructor(
    @Inject('BROKER_SERVICE') private brokerClient: ClientProxy,
    private readonly appService: EnricherService,
  ) {}

  //Réception d'un message du broker : recette créée. envoi de la requête en queue redis
  @EventPattern('RecipeCreated')
  //réception des messages (notifications) du broker
  async onRecipeCreated(
    @Payload() data: EventPayload<'RecipeCreated'>,
    @Ctx() context: NatsContext,
  ) {
    console.log(`Subject: ${context.getSubject()}`, data)
    await this.appService.enrichWithGeneratedImage(data)
  }

  //Réception d'un message du broker : image générée.
  @EventPattern('RecipeImageGenerated')
  //réception des messages (notifications) du broker
  async onImageGenerated(
    @Payload() data: EventPayload<'RecipeImageGenerated'>,
    @Ctx() context: NatsContext,
  ) {
    console.log(`Subject: ${context.getSubject()}`, data)
    //await this.appService.patchRecipeWithGeneratedImage(data)
    //On image generated, envoi de l'info au broker
    this.brokerClient.emit('PatchDocument', data).subscribe({
      complete: () => console.log('Event published: PatchDocument'),
      error: err => console.error('Error publishing event:', err),
    })
  }
}
