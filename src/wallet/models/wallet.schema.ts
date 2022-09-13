import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { User } from "src/user/models";

export type WalletDocument =  Wallet & Document;


@Schema()
export class Wallet
{
    @Prop({required:true,default:0})
    amount:number;

    @Prop({required:true,type:mongoose.Schema.Types.ObjectId,ref:"User"})
    owner:User;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet)
