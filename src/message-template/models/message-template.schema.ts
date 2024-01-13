import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, HydratedDocument } from "mongoose";
import { User } from "src/user/models";

export type MessageTemplateDocument = HydratedDocument<MessageTemplate>;

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
export class MessageTemplate extends Document
{

    @Prop({required:true})
    title:string;

    @Prop({default:""})
    description:string;

    @Prop({default:""})
    content:string;

    @Prop({type:mongoose.Schema.Types.ObjectId,ref:User.name})
    owner:User;


    @Prop({default:false})
    isDeleted:boolean;

    @Prop({default:Date.now(),required:true})
    createdAt:Date;

}

export const MessageTemplateSchema = SchemaFactory.createForClass(MessageTemplate)