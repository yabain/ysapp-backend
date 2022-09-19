import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Application } from "src/application/models";
import { User } from "src/user/models";

export type WalletDocument =  Wallet & Document;


@Schema({
    toObject: {
        transform: function (doc, ret) {
            ret.owner=ret.owner._id;
            ret.app=ret.app._id
            delete ret.__v;
        }
    },
    toJSON: {
        transform: function (doc, ret) {
            ret.owner=ret.owner._id;
            ret.app=ret.app._id
            delete ret.__v;

        }
    }
})
export class Wallet
{
    @Prop({required:true,default:0})
    amount:number;

    @Prop({required:true,type:mongoose.Schema.Types.ObjectId,ref:"User"})
    owner:User;

    @Prop({type:mongoose.Schema.Types.ObjectId,ref:"Application",required:true})
    app:Application;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet)
