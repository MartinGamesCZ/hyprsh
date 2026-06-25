import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class EventsService {
  private readonly events$ = new Subject<MessageEvent>();

  emit(event: string, data: any) {
    this.events$.next({
      data: JSON.stringify(data),
      type: event,
    } as MessageEvent);
  }

  handleEvents() {
    return this.events$.asObservable();
  }
}
