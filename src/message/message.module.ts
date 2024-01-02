import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedModule } from 'src/shared/shared.module';
import { Message,  MessageSchema } from './models';
import { MessageService, WhatsappAnnouncementService } from './services';
import { MessageController } from './controllers';
import { UserModule } from 'src/user/user.module';
import { ContactModule } from 'src/contact/contact.module';
import { GroupModule } from 'src/group';
import { HandleConnexionGatewayWS, MessageGateWayWS } from './ws-gateway';

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
    
    MessageService,
    MessageGateWayWS,
    HandleConnexionGatewayWS,
    // WhatsappAnnouncementService
  ],
  exports: [],
})
export class MessageModule {}
