import { Injectable } from '@nestjs/common'; 
import { ConfigService } from '@nestjs/config';
import { Message, MessageType } from '../models';
import { MessageProcessing } from '../utils';
import { UserDocument } from 'src/user/models';
import { Client, LegacySessionAuth, LocalAuth, MessageMedia, RemoteAuth } from 'whatsapp-web.js';
import { UsersService } from 'src/user/services';
import qr  from "qr-image"
import { MongoStore } from 'wwebjs-mongo';
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
    console.log(this.clientsWhatsApp)
    if(this.clientsWhatsApp.has(userFound.id)) return this.clientsWhatsApp.get(userFound.id);
    let newWhatsappClient = new Client({
      // authStrategy: new LegacySessionAuth()
      authStrategy:new LocalAuth({
        // store:new MongoStore({mongoose:{
        //   connection:this.connection,
        //   mongo:mongoose.mongo
        // }}),
        clientId:userFound.id,
        // backupSyncIntervalMs: 300000
      })
    });
    this.clientsWhatsApp.set(userFound.id,newWhatsappClient);
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
              this.clientsWhatsApp.delete(userFound.id)
            })

            newWhatsappClient.initialize();
        })
    }

  sendMessage(message:Message):Promise<boolean>
  {
    return new Promise<boolean>((resolve,reject)=>{
      let newWhatsappClient = this.getWhatsAppSession(message.sender);
    let body={file:null,text:""}, params = null;
    Promise.all(message.contacts.map(async (contact)=> {
      body.text=  MessageProcessing.getPersonalizedMessage(message,contact);
      if(message.body.fileUrl) body.file = await MessageMedia.fromUrl(message.body.fileUrl);
      
      let state=await newWhatsappClient.getState()
      // console.log(contact.phoneNumber,body.text,body.file,state)
      if(!body.file) return newWhatsappClient.sendMessage(`${contact.phoneNumber}@c.us`,body.text);
      return newWhatsappClient.sendMessage(`${contact.phoneNumber}@c.us`,body.file,{
        caption:body.text
      });
    }))
    .then((result)=>{
    console.log("Voila ca ",result)
    resolve(true)
    })
    .catch((error)=>{
    console.log("Error ",error);
    reject(false)
    })


    })  
  }


}