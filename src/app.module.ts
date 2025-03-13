// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WhatsAppModule } from './whatsapp/whatsapp.module';
import { MessagesModule } from './messages/messages.module';
import { SessionsModule } from './sessions/sessions.module';
import { DatabaseModule } from './database/database.module';
import { FlowsModule } from './flow/flow.module';
import { TriggersModule } from './triggers/triggers.module';
import { ResponsesModule } from './responses/responses.module';

@Module({
  imports: [
    DatabaseModule, // Importa DatabaseModule para que PrismaService esté disponible
    AuthModule,
    UsersModule,
    WhatsAppModule,
    MessagesModule,
    SessionsModule,
    FlowsModule,
    TriggersModule,
    ResponsesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
