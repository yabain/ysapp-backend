import { IsBoolean, IsDate, IsDefined, IsEnum, IsMongoId, IsNotEmptyObject, IsObject, IsOptional } from "class-validator";
import { ObjectId } from "mongoose";
import { Transform, Type } from "class-transformer";
import { MessageType } from "../models";
import { MessageBodyDTO } from "./message-body.dto";

export class PostNewMessageDTO
{
    @IsEnum(MessageType)
    type:MessageType;

    @IsMongoId({each:true})
    contactsID:ObjectId[];

    @IsMongoId({each:true})
    groupsID:ObjectId[];

    @IsBoolean()
    isSentToNow:boolean;

    @IsOptional()
    @Transform(({value})=> value && new Date(value))
    @IsDate()
    dateToSend:Date;

    @IsDefined()
    @IsNotEmptyObject()
    @Type(()=>MessageBodyDTO)
    body:MessageBodyDTO ;

}