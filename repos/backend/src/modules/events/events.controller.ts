import { Controller, Sse } from '@nestjs/common';
import { EventsService } from './events.service';
import { Observable } from 'rxjs';

@Controller('/events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Sse('/')
  async handleEvents(): Promise<Observable<MessageEvent>> {
    return await this.eventsService.handleEvents();
  }
}
