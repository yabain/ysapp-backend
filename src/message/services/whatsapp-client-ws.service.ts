import { Injectable } from '@nestjs/common'; 
import { ConfigService } from '@nestjs/config';
import { Message, MessageType } from '../models';
import { MessageProcessing } from '../utils';
import { User, UserDocument } from 'src/user/models';
import { Client,  LocalAuth, MessageMedia, RemoteAuth } from 'whatsapp-web.js';
import { UsersService } from 'src/user/services';

export class WhatsappClientServiceWS {
  clientWhatsApp: any = null;  

  constructor(
    private userService:UsersService,
    private user:UserDocument=null
    ) {  
  }

  getWhatsAppSession()
  {
    this.clientWhatsApp = new Client({
      puppeteer: {
        args: ['--no-sandbox','--disable-setuid-sandbox'],
        headless: true
      },
      authStrategy:new LocalAuth({
        clientId:this.user._id.toString()
      })
    });
    this.clientWhatsApp.initialize();

    return this.clientWhatsApp;
  }

  onReady(handlerFunction:(bool:boolean)=>void)
  {
    this.clientWhatsApp.on('ready',()=>{
      handlerFunction(true);
    })
  }
    
  onQrCode(handlerFunction:(qrCode:string)=>void)
  {
    this.clientWhatsApp.on('qr',(qrCode)=>{
      // console.log("get qr")
      if(!this.user.hasSyncWhatsApp) handlerFunction(qrCode);
    });
  }

  onDisconnected(handlerFunction:(user:Record<string,any>)=>void)
  {
    //Bug: utilsé le mot 'on' pour gérer le cas d'une connexion, déconnexion et reconnexion
    this.clientWhatsApp.once('disconnected',async (session)=>{
      // console.log("disconnected")
      this.user.hasSyncWhatsApp=false;
      await this.user.save();
      return handlerFunction(this.user);
    })
  }

  onAuthenticated(handlerFunction:(user:Record<string,any>)=>void)
  {
    //Bug: utilsé le mot 'on' pour gérer le cas d'une connexion, déconnexion et reconnexion
    this.clientWhatsApp.on('authenticated',async (session)=>{
      // console.log("Auth")
      if(!this.user.hasSyncWhatsApp)
      {
        this.user.hasSyncWhatsApp=true;
        await this.user.save()
      }
        
        return handlerFunction(this.user);
    })
  }

  sendMessage(message:Message,sender):Promise<boolean>
  {
    return new Promise<boolean>((resolve,reject)=>{
      let body={file:null,text:""}, params = null;
      // console.log("send message ");
      this.clientWhatsApp.on('ready',()=>{
        // console.log("Ready")
        Promise.all(message.contacts.map(async (contact)=> {
          body.text=  MessageProcessing.getPersonalizedMessage(message,contact,sender);
          if(message.body.fileUrl) body.file = await MessageMedia.fromUrl(message.body.fileUrl);
     
          if(!body.file) return this.clientWhatsApp.sendMessage(MessageProcessing.extractPhoneID(`${contact.phoneNumber}@c.us`),body.text);
          return this.clientWhatsApp.sendMessage(MessageProcessing.extractPhoneID(`${contact.phoneNumber}@c.us`),body.file,{
            caption:body.text
          });
        }))
        .then((result)=>{
          // console.log("Ok",result)
          resolve(true)
        })
        .catch((error)=>{
          // console.log("Error ",error);
          reject(false)
        })
      })
    })  
  }
}