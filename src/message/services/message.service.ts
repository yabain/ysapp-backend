import { Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { ContactsService } from "src/contact/services";
import { GroupService } from "src/group/services/group.service";
import { DataBaseService } from "src/shared/services/database";
import { UsersService } from "src/user/services";
import { PostNewMessageDTO } from "../dtos";
import { Message, MessageDocument } from "../models";
import { CronJobTask } from "../utils";
import { WhatsappAnnouncementService } from "./whatsapp-announcement.service";

@Injectable()
export class MessageService extends DataBaseService<MessageDocument>
{
    constructor(
        @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
        @InjectConnection() connection: mongoose.Connection,
        private whatsappAnnoucementService:WhatsappAnnouncementService,
        private userService:UsersService,
        private contactService:ContactsService,
        private groupService:GroupService
        ){
        super(messageModel, connection);

        }

    async postNewMessage(postNewMessage:PostNewMessageDTO,email:string)
    {
        let message:MessageDocument = new this.messageModel();
        message.sender = await this.userService.findOneByField({"email":email});
        message.type = postNewMessage.type;
        message.isSentToNow = postNewMessage.isSentToNow;
        if(postNewMessage.body.fileUrl) message.body.fileUrl =postNewMessage.body.fileUrl;
        if(postNewMessage.body.text) message.body.text =postNewMessage.body.text;

        message.contacts = [];
        if(postNewMessage.contactsID)message.contacts = await Promise.all(postNewMessage.contactsID.map((contactId)=> this.contactService.findOneByField({"_id":contactId})));
        
        message.groups =[]; 
        if(postNewMessage.groupsID) message.groups = await Promise.all(postNewMessage.groupsID.map((groupId)=>this.groupService.findOneByField({"_id":groupId})));
        message.groups.forEach((group)=>message.contacts=[...message.contacts,...group.contacts])
        if(postNewMessage.dateToSend) message.dateToSend = postNewMessage.dateToSend;

        if(message.isSentToNow) await this.whatsappAnnoucementService.sendMessage(message)
        else {
            CronJobTask.newJobTask((params)=>{
                this.whatsappAnnoucementService.sendMessage(message);
                message.save()
            },message,message.dateToSend);

        }
        return message;
    }
}