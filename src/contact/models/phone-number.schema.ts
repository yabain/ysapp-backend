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
export class PhoneNumber extends Document {

    @Prop({default:""})
    phoneNumber:string;

    @Prop({default:""})
    country:string;

    @Prop({default:""})
    label:string;
}

export const PhoneNumberSchema = SchemaFactory.createForClass(PhoneNumber)
