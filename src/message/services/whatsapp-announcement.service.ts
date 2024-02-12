import { Injectable } from '@nestjs/common'; 
import { UsersService } from 'src/user/services';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { WhatsappClientServiceWS } from './whatsapp-client-ws.service';
import { Message } from '../models';
const mongoose = require('mongoose');

@Injectable()
export class WhatsappAnnouncementService {
    clientsWhatsApp: Map<string,WhatsappClientServiceWS> = new Map()
  constructor(
    private userService:UsersService,
    @InjectConnection() private connection: Connection
    ) {  
  }

  async getNewClientWhatsAppSession(userEmail)
  {
    let userFound = await this.userService.findOneByField({email:userEmail});
    // console.log("userFound ",userFound.email,this.clientsWhatsApp.has(userFound._id.toString()))
    if(this.clientsWhatsApp.has(userFound._id.toString())) this.removeClient(userEmail);

    let newWhatsappClient = new WhatsappClientServiceWS(this.userService,userFound);
    await newWhatsappClient.getWhatsAppSession()
    this.clientsWhatsApp.set(userFound._id.toString(),newWhatsappClient);
    return newWhatsappClient;
  }

  async sendMessage(message:Message,sender):Promise<boolean>
  {
    let client =await this.getNewClientWhatsAppSession(sender.email);
    return client.sendMessage(message,sender)
  }

  async logoutClient(userEmail)
  {
    let userFound = await this.userService.findOneByField({email:userEmail}), client = null;
    if(this.clientsWhatsApp.has(userFound._id.toString())) client=this.clientsWhatsApp.get(userFound._id.toString());
    if(client) client.disconnexion()
  }

  async removeClient(email)
  {
    let userFound = await this.userService.findOneByField({email:email});
    this.clientsWhatsApp.get(userFound._id.toString()).closeClient();
    this.clientsWhatsApp.delete(userFound._id.toString());
  }
}