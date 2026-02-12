import { type ClientNats, EventPattern as EventPatternBase } from '@nestjs/microservices'
import type { Observable } from 'rxjs'
import type z from 'zod'
import type { events } from './events'

export type EventNames = keyof typeof events

export type EventPayload<T extends EventNames> = z.infer<(typeof events)[T]['payload']>

export const EventPattern: {
  (metadata?: EventNames): MethodDecorator
  (metadata?: EventNames, extras?: Record<string, any>): MethodDecorator
} = EventPatternBase

export type ClientProxy = Omit<typeof ClientNats, 'send' | 'emit'> & {
  send<TName extends EventNames, TResult = any>(
    pattern: TName,
    data: EventPayload<TName>,
  ): Observable<TResult>

  emit<TName extends EventNames, TResult = any>(
    pattern: TName,
    data: EventPayload<TName>,
  ): Observable<TResult>
}
