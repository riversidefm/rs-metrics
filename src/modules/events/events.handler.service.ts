import { Injectable } from '@nestjs/common';
import { RSCloudEventHandlerDecorator } from '@riversidefm/events';
import * as rsproto from '@riversidefm/protos';

@Injectable()
export class EventsHandlerService {
  @RSCloudEventHandlerDecorator({
    eventSource: rsproto.SourceType[rsproto.SourceType.WEB],
    eventType: rsproto.EventType[rsproto.EventType.STUDIO_OPENED],
  })
  async handleEvent(ce: rsproto.CloudEvent) {
    console.log(`Event received:`, ce);
    
    // Add your business logic here
  }
}
