import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse, } from '@nestjs/websockets';
// import { MessageService, } from "../../../message/services";
import { Socket } from 'socket.io'
import { PostNewMessageDTO } from '../dtos';
import { WhatsappAnnouncementService } from '../../shared/services/announcement/whatsapp/whatsapp-announcement.service';

@WebSocketGateway({
    cors: {
      origin: '*',
    },
  })
export class MessageGateWayWS 
{
    constructor(
        private whatsAppAnnouncementService:WhatsappAnnouncementService, 
        // private messageService:MessageService
    ){}
  

    @SubscribeMessage('send-message')
    async handleQrCode(@MessageBody() data:PostNewMessageDTO, @ConnectedSocket() client:Socket)
    {
      // console.log("data",data);
      // this.messageService.postNewMessage(data,{email:data.email})
      // .then((result)=> client.emit("send-message",true))
      // .catch((error)=>client.emit("send-message",false))
    }  
   
    
}