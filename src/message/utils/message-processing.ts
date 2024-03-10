import { Contact } from "src/contact/models";
import { Message } from "../models";
import { ContactExtractData } from "./contact-extract-data";
import  * as TurndownService from "turndown"
// var TurndownService = require('turndown')



export class MessageProcessing
{
    
    static replaceVar(text:string,varArray:Record<string,any>):string
    {
      Object.keys(varArray).forEach((key)=>text = text.replace(`{{${key}}}`, varArray.hasOwnProperty(key)?varArray[key]:`%${key}%`));
      return text;
    }

    static getVarList(text:string):string[]
    {
        return Array.from(text.matchAll(/{{([a-zA-Z]+)}}/g)).map((varFound)=>varFound[1])
    }
  
    static extractPhoneID(phoneNumber:string)
    {
      return phoneNumber.replace("+","").replace(" ","").replace("-","")
    }

    static getVarListWithValues(message:Message,contact:Contact,sender):Record<string,any>
    {
        return {
            senderEmail:message.sender.email,
            senderFullName:`${sender.firstName} ${sender.lastName}`,
            receiverFullName:`${contact.fullName}`,
            receiverEmail: ContactExtractData.getDefaultMail(contact),
            dateToSend:`${(message.dateToSend?new Date(message.dateToSend):new Date()).toLocaleDateString()}`,
            plateform: "Ysapp"
        }
    }    
        
    static getPersonalizedMessage(message:Message,contact:Contact,sender)
    {
        let text = message.body.text;
        let varsValues = MessageProcessing.getVarListWithValues(message,contact,sender);
        let varsList = MessageProcessing.getVarList(text);        
        let values = {};
        varsList.forEach((varItem)=>{
            if(varsValues.hasOwnProperty(varItem)) values[varItem]=varsValues[varItem];
        })
        console.log("VarList ",varsList,varsValues,values,MessageProcessing.replaceVar(text,values))
        return MessageProcessing.replaceVar(text,values)
    }

    static parseHTMLToWhatappFormat(bodyHtml)
    {
        let turndownService = new TurndownService();
        return turndownService.turndown(bodyHtml);
    }
}