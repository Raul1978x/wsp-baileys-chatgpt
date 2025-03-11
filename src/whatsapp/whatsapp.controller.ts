import { Controller, Post, Body } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';
import { StartSessionDto } from './dto/start-session.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('whatsapp')
export class WhatsAppController {
  constructor(private readonly whatsappService: WhatsAppService) {}

  @Post('start')
  startSession(@Body() startSessionDto: StartSessionDto) {
    return this.whatsappService.startSession(startSessionDto);
  }

  @Post('send')
  sendMessage(@Body() sendMessageDto: SendMessageDto) {
    return this.whatsappService.sendMessage(sendMessageDto);
  }
}
