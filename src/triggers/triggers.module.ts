import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma.module';
import { TriggersService } from './triggers.service';
import { TriggersController } from './triggers.controller';

@Module({
  imports: [PrismaModule],
  providers: [TriggersService],
  controllers: [TriggersController],
})
export class TriggersModule {}
