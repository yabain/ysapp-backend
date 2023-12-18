import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, HydratedDocument } from "mongoose";
import { PhoneNumber } from "./phone-number.schema";
import { ContactEmail } from "./contact-email.schema";


export type ContactDocument = HydratedDocument<Contact>;

@Schema({})
export class Contact extends Document
{

    @Prop({required:true,default:""})
    fullName:string;

    // ,
    @Prop({type: Array<ContactEmail>,default:[]})
    emails:ContactEmail[];

    @Prop({type: Array<PhoneNumber>,default:[]})
    phoneNumbers:PhoneNumber[];    

    @Prop({default:""})
    skype:string;

    @Prop({default:""})
    websiteLink:string;

    @Prop({default:""})
    profilePicture:string;

    @Prop({default:""})
    address:string;

    @Prop({default:""})
    about:string;

    @Prop({default:""})
    jobTitle:string;

    @Prop({default:""})
    organization:string;

    @Prop({default:""})
    company:string;

    @Prop({default:Date.now()})
    birthday:Date;

    @Prop({type:[{type:mongoose.Schema.Types.ObjectId,ref:'Group'}]})
    groups:any[]

    @Prop({default:Date.now(),required:true})
    createdAt:Date;

}

export const ContactSchema = SchemaFactory.createForClass(Contact)