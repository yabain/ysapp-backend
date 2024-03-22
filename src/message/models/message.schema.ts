import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, HydratedDocument } from "mongoose";
import { Contact } from "src/contact/models";
import { Group } from "src/group/models";
import { User } from "src/user/models";

export enum MessageType {
  TEXT="text",
  IMAGE = "image",
  DOCUMENT = "document",
  CONTACT = "contact",
}


export type MessageDocument = HydratedDocument<Message>;

@Schema({
    toObject: {
        transform: function (doc, ret) {
          delete ret.__v;
        }
      },
      toJSON: {
        transform: function (doc, ret) {
          delete ret.__v;

        }
      }
})
export class Message extends Document
{
    @Prop({type:mongoose.Schema.Types.ObjectId,ref:User.name,default:null})
    sender:User;

    @Prop({required:true,default:MessageType.TEXT,enum:MessageType})
    type:MessageType;

    @Prop({type:[{type:mongoose.Schema.Types.ObjectId,ref:Contact.name}]})
    contacts:Contact[];

    @Prop({type:[{type:mongoose.Schema.Types.ObjectId,ref:Group.name}]})
    groups:Group[];

    @Prop({default:false})
    isDeleted:boolean;

    @Prop({default:true})
    isSentToNow:boolean;

    @Prop({default:null,type:Date})
    dateToSend:Date;
    
    @Prop({default:{},type:{text:String,fileUrl:String}})
    body:{text:string,fileUrl?:string,file?:Express.Multer.File} ;

    @Prop({default:Date.now(),required:true})
    createdAt:Date;
    
    @Prop({default:""})
    title:string
}

export const MessageSchema = SchemaFactory.createForClass(Message);