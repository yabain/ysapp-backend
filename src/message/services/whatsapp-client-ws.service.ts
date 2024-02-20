import { Injectable } from '@nestjs/common'; 
import { ConfigService } from '@nestjs/config';
import { Message, MessageType } from '../models';
import { CountryInfo, MessageProcessing } from '../utils';
import { User, UserDocument } from 'src/user/models';
import { Client,  Contact,  LocalAuth, MessageMedia, RemoteAuth } from 'whatsapp-web.js';
import { UsersService } from 'src/user/services';
import { ContactExtractData } from '../utils/contact-extract-data';

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
        args: ['--no-sandbox','--disable-setuid-sandbox','--unhandled-rejections=strict'], //
        headless: true
      },
      authStrategy:new LocalAuth({
        clientId:this.user._id.toString()
      }),
      webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2326.8.html',
        }
    });    
    this.clientWhatsApp.initialize();
    return this.clientWhatsApp;
  }


  onReady(handlerFunction:(bool:boolean)=>void)
  {
    this.clientWhatsApp.on('ready',()=>{
      console.log("Ready to ok")
      handlerFunction(true);
    })
  }
    
  onQrCode(handlerFunction:(qrCode:string)=>void)
  {
    this.clientWhatsApp.on('qr',(qrCode)=>{
      console.log("get qr")
      // if(!this.user.hasSyncWhatsApp) 
      handlerFunction(qrCode);
    });
  }

  onDisconnected(handlerFunction:(user:Record<string,any>)=>void)
  {
    //Bug: utilsé le mot 'on' pour gérer le cas d'une connexion, déconnexion et reconnexion
    this.clientWhatsApp.on('disconnected',async (session)=>{
      this.user.hasSyncWhatsApp=false;
      await this.user.save();
      return handlerFunction(this.user);
    })
  }

  onAuthenticated(handlerFunction:(user:Record<string,any>)=>void)
  {
    console.log("En attente de l'authentification")
      //Bug: utilisé le mot 'on' pour gérer le cas d'une connexion, déconnexion et reconnexion
    this.clientWhatsApp.on('authenticated',async (session)=>{
      console.log("Auth")      

      if(!this.user.hasSyncWhatsApp)
      {
        this.user.hasSyncWhatsApp=true;
        await this.user.save()
      }        
        return handlerFunction(this.user);
    })  
    this.clientWhatsApp.on('auth_failure', msg => {
      // Fired if session restore was unsuccessful
      console.error('AUTHENTICATION FAILURE', msg);
    })    
  }  
  onLoadingData(handlerFunction:(user:Record<string,any>)=>void)
  {
    this.clientWhatsApp.on('loading_screen', (percent, message) => {
      console.log("Percent ",percent)
      return handlerFunction({percent});
    });
  }
  sendMessage(message:Message,sender):Promise<boolean>
  {
    return new Promise<boolean>(async (resolve,reject)=>{
      let body={file:null,text:""}, params = null;
        Promise.all(message.contacts.map(async (contact)=> {
          body.text= MessageProcessing.parseHTMLToWhatappFormat(MessageProcessing.getPersonalizedMessage(message,contact,sender));
          if(message.body.fileUrl) body.file = await MessageMedia.fromUrl(message.body.fileUrl);
          else if(message.body.file) body.file = new MessageMedia(message.body.file.mimetype,message.body.file.buffer.toString("base64"),message.body.file.fieldname)
          let contactUSer = `${ContactExtractData.getWhatsappPhone(contact).phoneNumber}@c.us`;  
          if(!body.file) return this.clientWhatsApp.sendMessage(contactUSer,body.text);
          return this.clientWhatsApp.sendMessage(contactUSer,body.file,{
            caption:body.text
          });
        }))
        .then((result)=>{
          resolve(true)
        })
        .catch((error)=>{
          console.log("Error ",error);
          reject(false)
        })
    })  
  }

  getContacts():Promise<Contact[]>
  {
    return new Promise(async (resolve,reject)=>{
      let contacts = await this.clientWhatsApp.getContacts();
      contacts = contacts.filter((contact:Contact)=> contact.id.server=='c.us' && !contact.isBlocked && !contact.isGroup && !contact.isMe && contact.isMyContact && contact.isWAContact && contact.isUser);

      let foundContacts = [];
      await Promise.all(contacts.map(async (cont)=>{
        return new Promise(async (resolve,reject)=>{
          let countryInfo =CountryInfo.getCountryByPhoneCode(await cont.getCountryCode());
          if(countryInfo) {          
            cont.avatar = await cont.getProfilePicUrl()
            cont.countryCode = countryInfo.iso2
            foundContacts.push(cont)
          }
          resolve(true)
        })
      }))

      resolve(contacts)
    })    
  }

  getProfil()
  {
    return this.clientWhatsApp.info
  }
  async disconnexion()
  {

    return this.clientWhatsApp.logout()
  }

  async closeClient()
  {
    try
    {
      await this.clientWhatsApp.destroy()
      
    }
    catch(e){}
    return true
  }

  async isConnected()
  {
    console.log("State ",await this.clientWhatsApp.getState())
    return (await this.clientWhatsApp.getState()) == "CONNECTED"
  }
}