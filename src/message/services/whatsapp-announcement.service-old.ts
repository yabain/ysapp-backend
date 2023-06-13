// import { Injectable } from '@nestjs/common'; 
// import { ConfigService } from '@nestjs/config';
// // import { Types, WhatsAppAPI } from 'whatsapp-api-js';
// // import { Image, Document } from 'whatsapp-api-js/types/messages/media';
// import { Message, MessageType } from '../models';
// import { MessageProcessing } from '../utils';

// const { Text, Media, Contacts } = Types;

// @Injectable()
// export class WhatsappAnnouncementService {
//   private whatsappApi: WhatsAppAPI;
    
//   constructor(private configService: ConfigService) {
//     this.whatsappApi = new WhatsAppAPI(
//       this.configService.get<string>('WHATSAPP_TOKEN')
//     );
//   }

//   sendMessage(message:Message):Promise<boolean>
//   {
//     return new Promise<boolean>((resolve,reject)=>{
//       let body=null, params = null;
//     console.log("le message ",message);
//      Promise.all(message.contacts.map((contact)=> {
//       switch (message.type) {
//         case MessageType.TEXT:
//           body = new Text(MessageProcessing.getPersonalizedMessage(message,contact))
//           break;
//         case MessageType.IMAGE:
//           body = new Media.Image(message.body.fileUrl,true,MessageProcessing.getPersonalizedMessage(message,contact));
//           break;
//         case MessageType.DOCUMENT:
//           body = new Media.Document(message.body.fileUrl,true,undefined,MessageProcessing.getPersonalizedMessage(message,contact));
//           break;
//       }
//       // message.sender.phoneNumber
//       return this.whatsappApi.sendMessage(MessageProcessing.extractPhoneID("+237698295368"),contact.phoneNumber,body);
//      }))
//      .then((result)=>{
//       console.log("Voila ca ",result)
//       resolve(true)
//      })
//      .catch((error)=>{
//       console.log("Error ",error);
//       reject(false)
//      })
//     })
    

//   }


// }