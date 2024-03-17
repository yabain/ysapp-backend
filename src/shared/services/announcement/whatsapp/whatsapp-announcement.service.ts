import { Injectable } from '@nestjs/common'; 
import { UsersService } from 'src/user/services';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { WhatsappClientServiceWS } from './whatsapp-client-ws.service';
import { Message } from '../../../../message/models';
import { ModuleRef } from '@nestjs/core';
import { UserDocument } from 'src/user/models';

@Injectable()
export class WhatsappAnnouncementService {
    clientsWhatsApp: Map<string,WhatsappClientServiceWS> = new Map()
  constructor(
    ) { }

  async getNewClientWhatsAppSession(userDocument:UserDocument)
  {
    if(!userDocument) return null;
    if(this.clientsWhatsApp.has(userDocument.email)) this.removeClient(userDocument.email);

    let newWhatsappClient = new WhatsappClientServiceWS(userDocument);
    await newWhatsappClient.getWhatsAppSession()
    this.clientsWhatsApp.set(userDocument.email,newWhatsappClient);
    return newWhatsappClient;
  }

  async sendMessage(message:Message,sender):Promise<boolean>
  {
    let client =await this.getNewClientWhatsAppSession(sender);
    return client.sendMessage(message,sender)
  }

  async logoutClient(userEmail)
  {
    let client = null;
    if(this.clientsWhatsApp.has(userEmail)) client=this.clientsWhatsApp.get(userEmail);
    this.clientsWhatsApp.delete(userEmail)   
    if(client) await client.disconnexion()     
    
  }

  async removeClient(email)
  {   
    if(this.clientsWhatsApp.has(email))
    {
      let client = this.clientsWhatsApp.get(email);
      this.clientsWhatsApp.delete(email);
      
      client.closeClient();
    }
  }
}