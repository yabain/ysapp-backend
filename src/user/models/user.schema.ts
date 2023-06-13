import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { PERMISSIONS } from "../enum";
import mongoose, { Document, HydratedDocument } from "mongoose";
import { Contact } from "src/contact/models";
import { Group } from "src/group/models/group.schema";

export type UserDocument = HydratedDocument<User>;

@Schema({
    toObject: {
        transform: function (doc, ret) {
          delete ret.password;
          delete ret.__v;
        }
      },
      toJSON: {
        transform: function (doc, ret) {
          delete ret.password;
          delete ret.__v;

        }
      }
})
export class User extends Document
{

    @Prop({required:true,unique:true})
    email:string;

    @Prop({default:""})
    profilePicture:string;

    @Prop({default:""})
    country:string;

    @Prop({default:""})
    location:string;

    @Prop({default:""})
    phoneNumber:string;

    @Prop({type:[{type:mongoose.Schema.Types.ObjectId,ref:Contact.name}]})
    contacts:Contact[];

    @Prop({default:false})
    hasSyncWhatsApp:boolean;

    @Prop({default:null,type:Object})
    whatsAppSessionData:Record<string,any>

    @Prop({type:[{type:mongoose.Schema.Types.ObjectId,ref:Group.name}]})
    groups:Group[];

    @Prop({default:false})
    isDeleted:boolean;

    @Prop({default:Date.now(),required:true})
    createdAt:Date;

}

export const UserSchema = SchemaFactory.createForClass(User)