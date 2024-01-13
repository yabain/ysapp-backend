import { HttpStatus, Injectable, UnprocessableEntityException } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose"
import mongoose, { Model } from "mongoose";
import { PartialType } from "@nestjs/mapped-types";
import { CreateMessageTemplateDTO } from "../dtos";
import { MessageTemplate, MessageTemplateDocument, MessageTemplateSchema } from "../models";
import { DataBaseService } from "src/shared/services/database";
import { UsersService } from "src/user/services";

@Injectable()
export class MessageTemplatesService extends DataBaseService<MessageTemplateDocument>
{
    
    constructor(@InjectModel(MessageTemplate.name) private messageTemplateModel:Model<MessageTemplateDocument>,
        @InjectConnection() connection:mongoose.Connection,
        private usersService:UsersService
        ){
        super(messageTemplateModel,connection);
    }

    async createNewMessageTemplate(createMessageTemplateDTO: CreateMessageTemplateDTO,email:string):Promise<MessageTemplateDocument>
    {
        let user= await this.usersService.findOneByField({email});
        let messageTemplate = new this.messageTemplateModel(createMessageTemplateDTO);
        messageTemplate.owner = user;
        return messageTemplate.save();
    }

}