import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class MessageBody {

    @Prop({default:""})
    text:string;

    @Prop({default:""})
    fileUrl:string
}

export const MessageBodySchema = SchemaFactory.createForClass(MessageBody)
