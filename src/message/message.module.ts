import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedModule } from 'src/shared/shared.module';
import { Message,  MessageSchema } from './models';
import { MessageService, WhatsappAnnouncementService } from './services';

@Module({
  controllers: [],
  imports: [
    SharedModule,
    MongooseModule.forFeature([
      {name:Message.name,schema:MessageSchema}
  ]),
  ],
  providers: [
    WhatsappAnnouncementService,
    MessageService
  ],
  exports: [],
})
export class MessageModule {}
