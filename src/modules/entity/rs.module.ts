import { Module } from '@nestjs/common';
import { DatabaseService } from '@riversidefm/database';
import { RsService } from './rs.service';
import { RsResolver } from './rs.resolver';

@Module({
  providers: [RsService, RsResolver, DatabaseService],
  exports: [RsService, RsResolver],
})
export class RsModule {}
