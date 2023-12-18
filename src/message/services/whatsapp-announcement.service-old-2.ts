import { Injectable } from '@nestjs/common'; 
import { ConfigService } from '@nestjs/config';
import { Message, MessageType } from '../models';
import { MessageProcessing } from '../utils';
import { UserDocument } from 'src/user/models';
import { Client, LegacySessionAuth, LocalAuth, MessageMedia, RemoteAuth } from 'whatsapp-web.js';
import { UsersService } from 'src/user/services';

import { InjectConnection } from '@nestjs/mongoose';
import { Connection, mongo } from 'mongoose';
const mongoose = require('mongoose');

@Injectable()
export class WhatsappAnnouncementService {
    clientsWhatsApp: Map<string,any> = new Map()
  constructor(private configService: ConfigService,
    private userService:UsersService,
    @InjectConnection() private connection: Connection
    ) {  
  }

  getWhatsAppSession(userFound)
  {
    // if(this.clientsWhatsApp.has(userFound._id)) return this.clientsWhatsApp.get(userFound._id);
    let newWhatsappClient = new Client({
      puppeteer: {
        args: ['--no-sandbox','--disable-setuid-sandbox'],
        headless: true
      },
      authStrategy:new LocalAuth({
        clientId:userFound._id.toString()
      })
    });
    newWhatsappClient.initialize();

    // this.clientsWhatsApp.set(userFound._id.toString(),newWhatsappClient);
    return newWhatsappClient;
  }

  async initWhatsAppSession(userEmail)
    {
      let userFound = await this.userService.findOneByField({email:userEmail});
    
        return new Promise<string>((resolve,reject)=>{
            
          let newWhatsappClient = this.getWhatsAppSession(userFound);
            newWhatsappClient.once('qr',(qrCode)=>{
                resolve(qrCode)
            });

            newWhatsappClient.once('authenticated',async (session)=>{
              console.log("Auth")
                userFound.hasSyncWhatsApp=true;
                await userFound.save()
            })

            newWhatsappClient.once('disconnected',async (session)=>{
              console.log("Disconeect")
              userFound.hasSyncWhatsApp=false;
              await userFound.save()
              // this.clientsWhatsApp.removeuserFound._id)
            })
        })
    }

  sendMessage(message:Message,sender):Promise<boolean>
  {
    return new Promise<boolean>((resolve,reject)=>{
      let newWhatsappClient = this.getWhatsAppSession(message.sender);
      let body={file:null,text:""}, params = null;
      newWhatsappClient.on('ready',()=>{
        Promise.all(message.contacts.map(async (contact)=> {
          body.text=  MessageProcessing.getPersonalizedMessage(message,contact,sender);
          if(message.body.fileUrl) body.file = await MessageMedia.fromUrl(message.body.fileUrl);
        
          // console.log("body ",body);
          if(!body.file) return newWhatsappClient.sendMessage(MessageProcessing.extractPhoneID(`${contact.phoneNumbers[0]}@c.us`),body.text);
          return newWhatsappClient.sendMessage(MessageProcessing.extractPhoneID(`${contact.phoneNumbers[0]}@c.us`),body.file,{
            caption:body.text
          });
        }))
        .then((result)=>{
          // console.log("Voila ca ",result)
          resolve(true)
        })
        .catch((error)=>{
          console.log("Error ",error);
          reject(false)
        })
      })
    })  
  }


}