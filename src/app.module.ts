import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WhatsAppModule } from './whatsapp/whatsapp.module';
import { MessagesModule } from './messages/messages.module';
import { SessionsModule } from './sessions/sessions.module';
import { DatabaseModule } from './database/database.module';
import { PrismaService } from './database/prisma.service';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    WhatsAppModule,
    MessagesModule,
    SessionsModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
