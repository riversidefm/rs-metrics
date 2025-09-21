import { Module } from '@nestjs/common';
import { BootstrapFactory, HealthService } from '@riversidefm/bootstrap';
import {
  createAuthenticatedContext,
  getUserFromRequestFn,
  GraphQLModuleFactory,
} from '@riversidefm/graphql';
import { LoggerModule } from '@riversidefm/logger';
import { RsModule } from './modules/entity/rs.module';
import { EventsHandlerService } from './modules/events/events.handler.service';

@Module({
  imports: [
    RsModule,
    LoggerModule,
    GraphQLModuleFactory.create('rs', {
      schemas: {
        patterns: ['src/**/*.graphql'],
      },
      context: createAuthenticatedContext(getUserFromRequestFn),
      debug: true,
      playground: {
        enabled: false,
      },
    }),
  ],
  providers: [EventsHandlerService],
})
class RsServiceModule {}

async function bootstrap() {
  const appContext = await BootstrapFactory.create({
    modules: [RsServiceModule],
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  });

  // Set healthy and readiness for probes
  const readinessService = appContext.get(HealthService);
  readinessService.ready = true;
  readinessService.healthy = true;
}

void bootstrap();
