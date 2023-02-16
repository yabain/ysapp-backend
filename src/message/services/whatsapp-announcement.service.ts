import { Injectable } from '@nestjs/common'; 
import { ConfigService } from '@nestjs/config';
import { WhatsAppAPI } from 'whatsapp-api-js';
import { Image, Document } from 'whatsapp-api-js/types/messages/media';
import Text from 'whatsapp-api-js/types/messages/text';
import { Message, MessageType } from '../models';
import { MessageProcessing } from '../utils';

@Injectable()
export class WhatsappAnnouncementService {
  private whatsappApi: WhatsAppAPI;
    
  constructor(private configService: ConfigService) {
    this.whatsappApi = new WhatsAppAPI(
      this.configService.get<string>('WHATSAPP_TOKEN')
    );
  }

  sendMessage(message:Message):Promise<boolean>
  {
    return new Promise<boolean>((resolve,reject)=>{
      let body=null, params = null;
    
     Promise.all(message.contacts.map((contact)=> {
      switch (message.type) {
        case MessageType.TEXT:
          body = new Text(MessageProcessing.getPersonalizedMessage(message,contact))
          break;
        case MessageType.IMAGE:
          body = new Image(message.body.file.id,true,MessageProcessing.getPersonalizedMessage(message,contact));
          break;
        case MessageType.DOCUMENT:
          body = new Document(message.body.file.id,true,undefined,MessageProcessing.getPersonalizedMessage(message,contact));
          break;
      }
      return this.whatsappApi.sendMessage(MessageProcessing.extractPhoneID(message.sender.phoneNumber),contact.phoneNumber,body);
     }))
     .then((result)=>resolve(true))
     .catch((error)=>{
      console.log("Error ",error);
      reject(false)
     })
    })
    

  }


}