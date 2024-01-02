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
    this.clientWhatsApp.on('loading_screen', (percent, message) => {
      console.log('LOADING SCREEN', percent, message);
    });
  }

  sendMessage(message:Message,sender):Promise<boolean>
  {
    return new Promise<boolean>((resolve,reject)=>{
      let body={file:null,text:""}, params = null;
      // console.log("send message ");
      // this.clientWhatsApp.on('ready', ()=>{
        // console.log("Ready")
        Promise.all(message.contacts.map(async (contact)=> {
          body.text=  MessageProcessing.getPersonalizedMessage(message,contact,sender);
          if(message.body.fileUrl) body.file = await MessageMedia.fromUrl(message.body.fileUrl);
          // let contactUSer = await this.clientWhatsApp.getContactById(MessageProcessing.extractPhoneID(`${contact.phoneNumber}@c.us`))
          let contactUSer = await this.clientWhatsApp.getNumberId(MessageProcessing.extractPhoneID(`${ContactExtractData.getWhatsappPhone(contact)}@c.us`))
          if(!body.file) return this.clientWhatsApp.sendMessage(contactUSer,body.text);
          return this.clientWhatsApp.sendMessage(contactUSer,body.file,{
            caption:body.text
          });
        }))
        .then((result)=>{
          // console.log("Ok",result)
          resolve(true)
        })
        .catch((error)=>{
          console.log("Error ",error);
          reject(false)
        })
      // })
    })  
  }

  getContacts():Promise<Contact[]>
  {
    return new Promise(async (resolve,reject)=>{
      let contacts = await this.clientWhatsApp.getContacts();
      contacts = contacts.filter((contact:Contact)=> !contact.isBlocked && !contact.isGroup && !contact.isMe && contact.isMyContact && contact.isWAContact && contact.isUser);
      await Promise.all(contacts.map((contact)=>{
        return new Promise(async (res,rej)=>{
          contact.avatar = await contact.getProfilePicUrl()
          contact.countryCode = CountryInfo.getCountryByPhoneCode(await contact.getCountryCode()).iso2
          res(true);
        })
      }));
      resolve(contacts)
    })    
  }

  getProfil()
  {
    return this.clientWhatsApp.info
  }
  disconnexion()
  {
    return this.clientWhatsApp.logout()
  }

  async closeClient()
  {
    try
    {
      this.clientWhatsApp.destroy();
    }catch(error)
    {
      
    }
  }

  async isConnected()
  {

    console.log("State ",await this.clientWhatsApp.getState())
    return (await this.clientWhatsApp.getState()) == "CONNECTED"
  }
}