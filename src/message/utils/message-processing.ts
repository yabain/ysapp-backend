import { Contact } from "src/contact/models";
import { Message } from "../models";

export class MessageProcessing
{
    static replaceVar(text:string,varArray:Record<string,any>):string
    {
      Object.keys(varArray).forEach((key)=>text = text.replace(`%${key}%`, varArray.hasOwnProperty(key)?varArray[key]:`%${key}%`));
      return text;
    }

    static getVarList(text:string):string[]
    {
        return Array.from(text.matchAll(/%([a-zA-Z]+)%/g)).map((varFound)=>varFound[1])
    }
  
    static extractPhoneID(phoneNumber:string)
    {
      return phoneNumber.replace("+","").replace(" ","")
    }

    static getVarListWithValues(message:Message,contact:Contact):Record<string,any>
    {
        return {
            // email:message.sender.email,
            // senderName:`${message.sender.firstName} ${message.sender.lastName}`,
            receiverName:`${contact.firstName} ${contact.lastName}`,
            receiverEmail:contact.email
        }
    }

    static getPersonalizedMessage(message:Message,contact:Contact)
    {
        let text = message.body.text;
        let varsValues = MessageProcessing.getVarListWithValues(message,contact);
        let varsList = MessageProcessing.getVarList(text);
        let values = {};
        varsList.forEach((varItem)=>{
            if(varsValues.hasOwnProperty(varItem)) values[varItem]=varsValues[varItem];
        })
        return MessageProcessing.replaceVar(text,values)
    }
}