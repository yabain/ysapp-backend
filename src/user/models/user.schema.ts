import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { PERMISSIONS } from "../enum";
import { Document } from "mongoose";

export type UserDocument = User & Document

@Schema()
export class User
{
    @Prop({required:true})
    firstName:string;

    @Prop({required:true})
    lastName:string;

    @Prop({required:true})
    password:string;

    @Prop({
        required:true,
        unique:true,
        match:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    })
    email:string;

    @Prop({required:true,default:false})
    emailConfirmed:boolean;

    @Prop({default:""})
    profilePicture:string;

    @Prop({default:""})
    country:string;

    @Prop({default:""})
    location:string;

    @Prop({require:true,enum:PERMISSIONS,default:PERMISSIONS.USER})
    permissions:string;
}

export const UserSchema = SchemaFactory.createForClass(User)