import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse, } from '@nestjs/websockets';
import { MessageService,  } from "../services";
import { Socket } from 'socket.io'
import { WhatsappAnnouncementService } from '../services/whatsapp-announcement.service';

@WebSocketGateway({
    cors: {
      origin: '*',
    },
  })
export class HandleConnexionGatewayWS implements OnGatewayConnection, OnGatewayDisconnect
{
    mapClient:Map<string,{email:string,connected:boolean}>=new Map();//@ip=>{email,connected:true}

    constructor(
        private whatsAppAnnouncementService:WhatsappAnnouncementService,
    ){}
    
    handleConnection(client: Socket, ...args: any[]) {
        if(this.mapClient.has(client.handshake.headers.origin)) {
            let clientInfos= this.mapClient.get(client.handshake.headers.origin)
            this.mapClient.set(client.handshake.headers.origin,{...clientInfos,connected:true})
        }
        client.emit("connexion")
    }

    handleDisconnect(client: Socket) {
        this.whatsAppAnnouncementService.removeClient(this.mapClient.get(client.handshake.headers.origin).email)
        this.mapClient.delete(client.handshake.headers.origin);


        // let clientInfos= this.mapClient.get(client.handshake.headers.origin)
        // this.mapClient.set(client.handshake.headers.origin,{...clientInfos,connected:false})
        // setTimeout(()=>{
        //     if(!this.mapClient.get(client.handshake.headers.origin).connected) this.whatsAppAnnouncementService.removeClient(this.mapClient.get(client.handshake.headers.origin).email)
        // },20000)
    }

    @SubscribeMessage('connexion')
    async handleNewClientConnexion(@MessageBody('email') email:string, @ConnectedSocket() client:Socket)
    {
        if(!this.mapClient.has(client.handshake.headers.origin)) this.mapClient.set(client.handshake.headers.origin,{email,connected:true});
        let newClient=await this.whatsAppAnnouncementService.getNewClientWhatsAppSession(email);
        newClient.onReady(async ()=>{
            client.emit('ready')
            client.emit("info",{contacts:await newClient.getContacts(),profil:await newClient.getProfil()})
        });
        newClient.onLoadingData((value)=>client.emit("info-loading-percent",value));
        newClient.onAuthenticated(()=>client.emit("connected"));
        newClient.onDisconnected(()=>client.emit("disconnected"));
        newClient.onQrCode((qrCode)=>client.emit("qrcode",qrCode))
    }    
    @SubscribeMessage('disconnexion')
    async handleLogoutClientConnexion(@MessageBody('email') email:string, @ConnectedSocket() client:Socket)
    {
      await this.whatsAppAnnouncementService.logoutClient(email)
    }
}