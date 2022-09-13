import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { uid } from "rand-token";
import mongoose, { Document } from 'mongoose';
import { Wallet } from '../../wallet/models';
import { User } from '../../user/models';

export type ApplicationDocument =  Application & Document;

@Schema()
export class Application
{
    @Prop({required:true})
    name:string;

    @Prop({required:true})
    urlToCallBack:string;

    @Prop({type:mongoose.Schema.Types.ObjectId,ref:"Wallet"})
    owner:User;

    @Prop({type:mongoose.Schema.Types.ObjectId,ref:"User"})
    wallet:Wallet;

    @Prop({default:uid(256),required:true})
    token:string;

    @Prop({default:uid(256),required:true})
    privateKey:string;
    
    @Prop({default:Date.now(),required:true})
    createdAt:Date
}

export const ApplicationSchema = SchemaFactory.createForClass(Application)

