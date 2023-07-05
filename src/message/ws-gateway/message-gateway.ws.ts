import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse, } from '@nestjs/websockets';
import { MessageService, WhatsappAnnouncementService } from "../services";
import { Socket } from 'socket.io'
import { PostNewMessageDTO } from '../dtos';

@WebSocketGateway({
    cors: {
      origin: '*',
    },
  })
export class MessageGateWayWS
{
    constructor(
        private whatsAppAnnouncementService:WhatsappAnnouncementService, 
        private messageService:MessageService
    ){}

    @SubscribeMessage('send-message')
    async handleQrCode(@MessageBody() data:PostNewMessageDTO, @ConnectedSocket() client:Socket)
    {
      console.log("data",data);
      this.messageService.postNewMessage(data,{email:data.email})
      .then((result)=> client.emit("send-message",true))
      .catch((error)=>client.emit("send-message",false))
      
    }  

    

    @SubscribeMessage('connexion')
    async handleNewClientConnexion(@MessageBody('email') email:string, @ConnectedSocket() client:Socket)
    {
        let newClient=await this.whatsAppAnnouncementService.getNewClientWhatsAppSession(email);
        newClient.onAuthenticated(()=>client.emit("connected"));
        newClient.onDisconnected(()=>client.emit("disconnected"));
        newClient.onQrCode((qrCode)=>client.emit("qrcode",qrCode))
    }
}