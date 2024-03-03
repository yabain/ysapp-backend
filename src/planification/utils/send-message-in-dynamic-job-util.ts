import { WhatsappAnnouncementService, WhatsappClientServiceWS } from "src/message/services";
import { PlanificationDocument } from "../models";
import { PlanificationService } from "../services";
import { CronJobTaskService } from "../services/cron-job-task.service";

export class SendMessageInDynamicJobUtil
{
    static createJobToSendMessage(planificationService:PlanificationService,
        planificationObject:PlanificationDocument,whatsappAnnoucementService:WhatsappAnnouncementService,
        cronJobTaskService:CronJobTaskService)
    {
        planificationService.applyOnCronJob(planificationObject,async ()=>{
        let message = planificationObject.message;
        let userWhatsappSync:WhatsappClientServiceWS = whatsappAnnoucementService.clientsWhatsApp.get(message.sender.email);
        if(await userWhatsappSync.isConnected()) await userWhatsappSync.sendMessage(message,message.sender)
        else userWhatsappSync.onReady(()=>userWhatsappSync.sendMessage(message,message.sender))
    },cronJobTaskService.generateNewJobName(planificationObject.owner))
    }
}