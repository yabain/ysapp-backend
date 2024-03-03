import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel, InjectConnection } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { DataBaseService } from "src/shared/services/database";
import { Planification, PlanificationDocument, PlanificationType } from "../models";
import { CreatePlanificationDTO, UpdateStatePlanificationDTO } from "../dtos";
import { Message } from "src/message/models";
import { CRON_JOB_RECCURENT_TYPE, CRON_JOB_TYPE } from "../enums";
import { DateUtil, SendMessageInDynamicJobUtil } from "../utils";
import { CronJobTaskService } from "./cron-job-task.service";
import { Cron } from "@nestjs/schedule";
import { WhatsappAnnouncementService } from "src/message/services";


@Injectable()
export class PlanificationService extends DataBaseService<PlanificationDocument>
{
    constructor(
        @InjectModel(Planification.name)  planificationModel: Model<PlanificationDocument>,
        @InjectConnection() connection: mongoose.Connection,
        private cronJobTaskService:CronJobTaskService,
        private whatsAppAnnoucementService:WhatsappAnnouncementService
    ){
        super(planificationModel, connection);
    }

    
    
    newPlanification(createPlanificationDTO:CreatePlanificationDTO[],message:Message)
    {
        return this.create({owner:message.sender,message,planning:createPlanificationDTO})
    }

    async updatePlanfication(updatePlanficationDTO:UpdateStatePlanificationDTO)
    {
        let planification = await this.findOneByField({_id:updatePlanficationDTO.planificationID});
        if(!planification) throw new NotFoundException({
            statusCode: 404,
            error:"Planification/NotFound",
            message:["Planification not found"]
        })
        planification.isActive=updatePlanficationDTO.status;
        if(updatePlanficationDTO.status)
        {
            if(!this.cronJobTaskService.jobExist(this.cronJobTaskService.generateNewJobName(planification.owner)))
            {
                SendMessageInDynamicJobUtil.createJobToSendMessage(this,planification,this.whatsAppAnnoucementService,this.cronJobTaskService)
            }
            else this.cronJobTaskService.removeJobTask(this.cronJobTaskService.generateNewJobName(planification.owner))
        }
        return planification.save();
    }

    async removePlanification(planificationID:string)
    {
        let planification = await this.findOneByField({_id:planificationID});
        if(!planification) throw new NotFoundException({
            statusCode: 404,
            error:"Planification/NotFound",
            message:["Planification not found"]
        })
        this.cronJobTaskService.removeJobTask(this.cronJobTaskService.generateNewJobName(planification.owner))
        return this.executeWithTransaction(async (session)=>{
            await planification.message.delete({session})
            await this.delete({_id:planificationID},{session});
            
        })
    }

    applyOnCronJob(planificationModel:PlanificationDocument,functionCallback:(params:void)=>void,jobName:string,params=null)
    {
        this.transformPlanificationToCronJobArray(planificationModel.planning)
        .filter((plan)=>plan!=null)
        .map((plan)=>{
            this.cronJobTaskService.newJobTask(functionCallback,params,plan,jobName)
        })
    }

    transformPlanificationToCronJobArray(planning:PlanificationType[])
    {
        return planning.map((plan)=>{
            if(plan.type==CRON_JOB_TYPE.IS_ALL_DAY) return this.transformAllDatePlanificationToCronJobString(plan)
            if(plan.type==CRON_JOB_TYPE.IS_RECCURENT) return this.transformReccurentPlanificationToCronJobString(plan)
            if(plan.type==CRON_JOB_TYPE.IS_RANDOM) return this.transformReccurentPlanificationToCronJobString(plan)
        })
    }

    transformAllDatePlanificationToCronJobString(planning:PlanificationType)
    {
        let cronString = this.transformTimeToCronJobString(planning.time);
        let dateNow = new Date(), lastDayOfStartDateMonth = new Date(planning.startDate.getFullYear(),planning.startDate.getMonth()+1,0),
        firstDayOfEndDateMonth = new Date(planning.endDate.getFullYear(),planning.endDate.getMonth(),1),
        lastDayOfEndDateMonth = new Date(planning.endDate.getFullYear(),planning.endDate.getMonth(),1);

        if(planning.startDate.getMonth()==planning.endDate.getMonth() && planning.startDate.getFullYear()==planning.endDate.getFullYear())
        {
            if(planning.startDate.getMonth()==dateNow.getMonth()) cronString+=` ${planning.startDate.getDate()-planning.endDate.getDate()} ${planning.startDate.getMonth()+1} *`
            return null;
        }
        else if(dateNow>=planning.startDate && dateNow<=lastDayOfStartDateMonth) cronString+=` ${planning.startDate.getDate()}-${lastDayOfStartDateMonth.getDate()} ${planning.startDate.getMonth()+1} *`
        else if(dateNow>=firstDayOfEndDateMonth && dateNow<=lastDayOfEndDateMonth && planning.endDate<=lastDayOfEndDateMonth) cronString += `  ${firstDayOfEndDateMonth.getDate()}-${planning.endDate.getDate()} ${planning.startDate.getMonth()+1} *`
        else cronString+=` * ${firstDayOfEndDateMonth.getMonth()+1} *`;
        return cronString;
    }


    transformReccurentPlanificationToCronJobString(planning:PlanificationType)
    {
        let cronString = this.transformTimeToCronJobString(planning.time);
        switch (planning.recurency) {
            case CRON_JOB_RECCURENT_TYPE.DAY:
                cronString+=` */${planning.every} ${new Date().getMonth()+1} *`
                break;
            case CRON_JOB_RECCURENT_TYPE.WEEK:
                let newCurrentDateWeek=new Date();
                newCurrentDateWeek.setDate(1);
                DateUtil.setFirstDayOfWeek(newCurrentDateWeek,planning.dayOfWeek+1);
                let datesString= `${newCurrentDateWeek.getDate()}`;
                for(let i=0;i<=4; i++)
                {
                    newCurrentDateWeek.setDate(newCurrentDateWeek.getDate()+7*planning.every);
                    if(newCurrentDateWeek.getMonth()+1<=(new Date().getMonth()+1)) datesString+= `,${newCurrentDateWeek.getDate()}`;
                }
                
                cronString+=` ${datesString} ${newCurrentDateWeek.getMonth()+1}`
                break;
            case CRON_JOB_RECCURENT_TYPE.MONTH:
                let begingMonthDate = new Date(planning.date), newCurrentDateMonth = new Date();
                
                if(newCurrentDateMonth.getFullYear()==begingMonthDate.getFullYear() && newCurrentDateMonth.getMonth()==begingMonthDate.getMonth())
                {
                    cronString+=` ${begingMonthDate.getDate()} ${begingMonthDate.getMonth()+1} *`
                }
                else return null;
                break;
            case CRON_JOB_RECCURENT_TYPE.YEAR:
                let begingYearDate = new Date(planning.date), newCurrentDateYear = new Date();
                newCurrentDateYear.setFullYear(newCurrentDateYear.getFullYear()+planning.every);
                
                if((newCurrentDateYear.getFullYear()-begingYearDate.getFullYear()%planning.every==0) && newCurrentDateYear.getMonth()==begingYearDate.getMonth())
                {
                    cronString+=` ${begingYearDate.getDate()} ${begingYearDate.getMonth()+1} *`
                }
                else return null;
                break;
        }
        return cronString;
    }

    transformRandomPlanificationToCronJobString(planning:PlanificationType)
    {
        let dayString="";
        let newDate = new Date();
        planning.dates.forEach((date)=>{
            if(newDate.getMonth()==date.getMonth()) dayString+=`${date.getDate()},`
        });
        if(dayString.length>0) {
            return `${this.transformTimeToCronJobString(planning.time)}  ${dayString.slice(0,dayString.lastIndexOf(","))} ${newDate.getMonth()+1} *`
        }
        return null;
    }

    transformTimeToCronJobString(timeDef)
    {
        let [time,timeZone] = timeDef.splite(" ");
        let [heure,minute] = time.splite(":");
        heure = parseInt(heure);
        minute = parseInt(minute);
        if(timeZone=="PM") 
        {
            heure+=12;
            minute+=12;
        }
        return `${minute} ${heure}`
    }
}
