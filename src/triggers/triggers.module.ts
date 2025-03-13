import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { TriggersService } from './triggers.service';
import { TriggersController } from './triggers.controller';

@Module({
  imports: [DatabaseModule],
  providers: [TriggersService],
  controllers: [TriggersController],
})
export class TriggersModule {}
