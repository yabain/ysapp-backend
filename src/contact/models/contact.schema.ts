import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, HydratedDocument } from "mongoose";


export type ContactDocument = HydratedDocument<Contact>;

@Schema({})
export class Contact extends Document
{
    @Prop({required:true,default:""})
    firstName:string;

    @Prop({required:true,default:""})
    lastName:string;

    // ,
    @Prop({
        match:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        // unique:true
        default:""
    })
    email:string;

    @Prop({default:""})
    phoneNumber:string;

    @Prop({default:""})
    whatsappContact:string;

    @Prop({default:""})
    skype:string;

    @Prop({default:""})
    websiteLink:string;

    @Prop({default:""})
    profilePicture:string;

    @Prop({default:""})
    country:string;

    @Prop({default:""})
    address:string;

    @Prop({default:""})
    gender:string;

    @Prop({default:""})
    about:string;

    @Prop({default:""})
    organization:string;

    @Prop({default:""})
    city:string;

    @Prop({default:Date.now()})
    birthday:Date;

    @Prop({type:[{type:mongoose.Schema.Types.ObjectId,ref:'Group'}]})
    groups:any[]

    @Prop({default:Date.now(),required:true})
    createdAt:Date;

}

export const ContactSchema = SchemaFactory.createForClass(Contact)