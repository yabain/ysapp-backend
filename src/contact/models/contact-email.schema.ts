import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose"



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
      },
      _id:false
})
export class ContactEmail extends Document {

    @Prop({default:""})
    email:string;

    @Prop({default:""})
    label:string;
}

export const ContactEmailSchema = SchemaFactory.createForClass(ContactEmail)
