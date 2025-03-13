/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { Database } from '../database/database.module';
import { FlowsService } from './flows.service';
import { FlowsController } from './flows.controller';

@Module({
  imports: [Database],
providers: [FlowsService],
  controllers: [FlowsController],
})
export class FlowsModule {}
