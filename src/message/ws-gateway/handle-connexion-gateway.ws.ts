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

    constructor(
        private whatsAppAnnouncementService:WhatsappAnnouncementService,
    ){}
    
    handleConnection(client: Socket, ...args: any[]) {
        console.log("New")
        
        client.emit("connexion")
    }

    handleDisconnect(client: Socket) {
        try{
            if(client.data.email)  this.whatsAppAnnouncementService.removeClient(client.data.email)
            console.log("Deconnexion")
        }
        catch(e)
        {
            console.log("Error Custom",e)
        }
    }

    @SubscribeMessage('connexion')
    async handleNewClientConnexion(@MessageBody('email') email:string, @ConnectedSocket() client:Socket)
    {
        try{
            client.data={email};
            console.log("New Client")
            let newClient=await this.whatsAppAnnouncementService.getNewClientWhatsAppSession(email);
            newClient.onReady(async ()=>{
                client.emit('ready')
                client.emit("info",{contacts:await newClient.getContacts(),profil:await newClient.getProfil()})
            });
            newClient.onLoadingData((value)=>client.emit("info-loading-percent",value));
            newClient.onAuthenticated(()=>client.emit("sync-connected"));
            newClient.onDisconnected(()=>client.emit("disconnected"));
            newClient.onQrCode((qrCode)=> {            
                console.log("Client ",client.handshake.time)
                client.emit("qrcode",qrCode)
            })
        } catch(e)
        {
            console.log("Error Custom",e)
        }
    }    

    @SubscribeMessage('disconnexion')
    async handleLogoutClientConnexion(@MessageBody('email') email:string, @ConnectedSocket() client:Socket)
    {
        try{
            await this.whatsAppAnnouncementService.logoutClient(email)
        }catch(e)
        {
            console.log("Error Custom",e)
        }      
    }
}
