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

@Module({
  imports: [
    DatabaseModule, // Importa DatabaseModule para que PrismaService esté disponible
    AuthModule,
    UsersModule,
    WhatsAppModule,
    MessagesModule,
    SessionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
