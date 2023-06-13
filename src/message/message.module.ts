import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedModule } from 'src/shared/shared.module';
import { Message,  MessageSchema } from './models';
import { MessageService, WhatsappAnnouncementService } from './services';
import { MessageController } from './controllers';
import { UserModule } from 'src/user/user.module';
import { ContactModule } from 'src/contact/contact.module';
import { GroupModule } from 'src/group';

@Module({
  controllers: [
    MessageController
  ],
  imports: [
    SharedModule,
    UserModule,
    ContactModule,
    GroupModule,
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
