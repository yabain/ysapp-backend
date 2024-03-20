import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, HydratedDocument } from "mongoose";

export type GroupDocument = HydratedDocument<Group>;

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
export class Group extends Document
{
    @Prop({required:true,default:""})
    name:string;
    
    @Prop({default:""})
    icon:string;

    @Prop({required:true,default:""})
    description:string;

    @Prop({default:""})
    profilePicture:string;

    @Prop({type:[{type:mongoose.Schema.Types.ObjectId,ref:'Contact'}]})
    contacts:any[];

    @Prop({default:false})
    isDeleted:boolean;

    @Prop({default:Date.now(),required:true})
    createdAt:Date
}


export const GroupSchema = SchemaFactory.createForClass(Group)