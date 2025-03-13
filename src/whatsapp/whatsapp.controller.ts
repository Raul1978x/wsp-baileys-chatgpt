/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Post, Param, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WhatsAppService } from './whatsapp.service';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../database/entities/user.entity';

@Controller('whatsapp')
@UseGuards(AuthGuard('jwt'))
export class WhatsAppController {
  constructor(private readonly whatsAppService: WhatsAppService) {}

  @Post(':sessionName/start')
  async startSession(
    @Param('sessionName') sessionName: string,
    @GetUser() user: User,
  ) {
    return this.whatsAppService.startSession(sessionName, user.id);
  }

  @Post(':sessionName/send')
  async sendMessage(
    @Param('sessionName') sessionName: string,
    @Body('chatId') chatId: string,
    @Body('message') message: string,
    @GetUser() user: User,
  ) {
    return this.whatsAppService.sendMessage(
      sessionName,
      chatId,
      message,
      user.id,
    );
  }
}
