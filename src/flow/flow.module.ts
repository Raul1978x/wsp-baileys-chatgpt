/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { FlowsService } from './flow.service';
import { FlowsController } from './flow.controller';

@Module({
  controllers: [FlowsController],
  providers: [FlowsService],
})
export class FlowsModule {}