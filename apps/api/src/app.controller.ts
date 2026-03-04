import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { Public } from './auth/decorators/public.decorator'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('state')
  state() {
    return this.appService.getState()
  }

  @Public()
  @Get('health')
  health() {
    return this.appService.healthcheck()
  }
}
