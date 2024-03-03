import { HttpStatus, Injectable, MethodNotAllowedException, NotFoundException } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { ContactsService } from "src/contact/services";
import { GroupService } from "src/group/services/group.service";
import { DataBaseService } from "src/shared/services/database";
import { UsersService } from "src/user/services";
import { PostNewMessageDTO } from "../dtos";
import { Message, MessageDocument } from "../models";
import { WhatsappAnnouncementService } from "./whatsapp-announcement.service";
import { MessageTemplatesService } from "src/message-template/services";
import { WhatsappClientServiceWS } from "./whatsapp-client-ws.service";
import { PlanificationService } from "src/planification/services";
import { Cron } from "@nestjs/schedule";
import { CronJobTaskService } from "src/planification/services/cron-job-task.service";
import { SendMessageInDynamicJobUtil } from "src/planification/utils";

@Injectable()
export class MessageService extends DataBaseService<MessageDocument>
{
    constructor(
        @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
        @InjectConnection() connection: mongoose.Connection,
        private whatsappAnnoucementService:WhatsappAnnouncementService,
        private userService:UsersService,
        private contactService:ContactsService,
        private groupService:GroupService,
        private planificationService:PlanificationService,
        private messageTemplateService:MessageTemplatesService,
        private cronJobTaskService:CronJobTaskService
        ){
        super(messageModel, connection);

        }
    
    //Planification des messages du mois
    @Cron('0 0 1 */1 *')
    async planifMonth()
    {
        let allPlanification = await this.planificationService.findByField({isActive:true,"owner.hasSyncWhatsApp":true});
        allPlanification.map((plan)=>{
            SendMessageInDynamicJobUtil.createJobToSendMessage(this.planificationService,plan,this.whatsappAnnoucementService,this.cronJobTaskService)
        })
    }
        
    async postNewMessage(postNewMessage:PostNewMessageDTO,user)
    {
        let message = await this.getMessageToSend(postNewMessage,await this.userService.findOneByField({"email":user.email}))

        let userWhatsappSync:WhatsappClientServiceWS = this.whatsappAnnoucementService.clientsWhatsApp.get(message.sender.email);
        if(!(await userWhatsappSync.isConnected())) throw new MethodNotAllowedException({
            statusCode: HttpStatus.METHOD_NOT_ALLOWED,
            error:"PostMessage/UserSender-NotFound",
            message:["User send not found"]
        })

        if(message.isSentToNow) await userWhatsappSync.sendMessage(message,user)
        else {
            await message.save();

            this.planificationService.applyOnCronJob(
                await this.planificationService.newPlanification(postNewMessage.planification,message),
                ()=>{
                    userWhatsappSync.sendMessage(message,user);
                },
                this.cronJobTaskService.generateNewJobName(user)
            );
        }
        return message;
    }

    async getMessageToSend(postNewMessage:PostNewMessageDTO,sender)
    {
        let message = this.createInstance({});
        message.sender = sender;
        // console.log("message.sender ",message.sender,await this.userService.findOneByField({"email":email}),email)
        message.type = postNewMessage.type;
        message.isSentToNow = postNewMessage.isSentToNow;
        // console.log("postNewMessage.body",postNewMessage.body)
        
        if(postNewMessage.messageTemplateId)
        {
            let messageTemplateService = await this.messageTemplateService.findOneByField({"_id":postNewMessage.messageTemplateId})
            if(!messageTemplateService) throw new NotFoundException({
                statusCode: 404,
                error:"MessageTemplate/NotFound",
                message:["Message Template not found"]
            })
            message.body.text=messageTemplateService.content
        }
        else 
        {
            if(postNewMessage.bodyFiles) message.body.file =postNewMessage.bodyFiles[0];
            if(postNewMessage.bodyText) message.body.text =postNewMessage.bodyText;
        }

        message.contacts = [];
        if(postNewMessage.contactsID)message.contacts = await Promise.all(postNewMessage.contactsID.map((contactId)=> this.contactService.findOneByField({"_id":contactId})));
        
        message.groups =[]; 
        if(postNewMessage.groupsID) message.groups = await Promise.all(postNewMessage.groupsID.map((groupId)=>this.groupService.findOneByField({"_id":groupId})));
        message.groups.forEach((group)=>message.contacts=[...message.contacts,...group.contacts])
        if(postNewMessage.dateToSend) message.dateToSend = postNewMessage.dateToSend;       
        
        return message;
        
    }
}