import { Injectable, NotFoundException, OnApplicationBootstrap } from "@nestjs/common";
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
import { ModuleRef } from "@nestjs/core";


@Injectable()
export class PlanificationService extends DataBaseService<PlanificationDocument> implements OnApplicationBootstrap
{
    constructor(
        @InjectModel(Planification.name)  planificationModel: Model<PlanificationDocument>,
        @InjectConnection() connection: mongoose.Connection,
        private cronJobTaskService:CronJobTaskService,
        private moduleRef:ModuleRef
    ){
        super(planificationModel, connection,["message"]);
    }

    //Planification au démarrage de l'application
    async onApplicationBootstrap():Promise<any> {
        //TODO
        // await this.planifMonth()
    }


    //Planification des messages du mois
    @Cron('0 0 1 */1 *')
    async planifMonth()
    {
        let allPlanification = await this.findByField({isActive:true,"owner.hasSyncWhatsApp":true});
        allPlanification.map((plan)=>{
            SendMessageInDynamicJobUtil.createJobToSendMessage(this.moduleRef,plan)
        })
    }

    
    newPlanification(createPlanificationDTO:CreatePlanificationDTO[],message:Message,title:string)
    {
        return this.create({owner:message.sender,message,planning:createPlanificationDTO,title})
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
                // SendMessageInDynamicJobUtil.createJobToSendMessage(this,planification,this.whatsAppAnnoucementService,this.cronJobTaskService)
                SendMessageInDynamicJobUtil.createJobToSendMessage(this.moduleRef,planification)
            }
            else planification.planning.forEach((plan)=>this.cronJobTaskService.removeJobTask(plan.subJobId)) 
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
        planification.planning.forEach((plan)=>{
            this.cronJobTaskService.removeJobTask(plan.subJobId)
        })
        return this.executeWithTransaction(async (session)=>{
            await planification.message.delete({session})
            await this.delete({_id:planificationID},{session});
            
        })
    }

    applyOnCronJob(planificationModel:PlanificationDocument,functionCallback:(params:void)=>void,params=null)
    {
        this.transformPlanificationToCronJobArray(planificationModel.planning)
        .filter((plan)=>plan.plan!=null)
        .map((plan)=>{
            this.cronJobTaskService.newJobTask(functionCallback,params,plan.plan,plan.planObj.subJobId)
        })
    }

    transformPlanificationToCronJobArray(planning:PlanificationType[]):{planObj:PlanificationType,plan:string}[]
    {
        return planning.map((plan)=>{
            let planString=null;
            if(plan.type==CRON_JOB_TYPE.IS_ALL_DAY) planString=this.transformAllDatePlanificationToCronJobString(plan)
            if(plan.type==CRON_JOB_TYPE.IS_RECCURENT) planString=this.transformReccurentPlanificationToCronJobString(plan)
            if(plan.type==CRON_JOB_TYPE.IS_RANDOM) planString=this.transformRandomPlanificationToCronJobString(plan)
            return {planObj:plan,plan:planString}
        })
    }

    transformAllDatePlanificationToCronJobString(planning:PlanificationType)
    {
        let cronString = this.transformTimeToCronJobString(planning.time);
        let dateNow = new Date(), 
        startDate = new Date(planning.startDate),
        endDate = new Date(planning.endDate),
        lastDayOfStartDateMonth = new Date(startDate.getFullYear(),startDate.getMonth()+1,0),
        firstDayOfEndDateMonth = new Date(endDate.getFullYear(),endDate.getMonth(),1),
        lastDayOfEndDateMonth = new Date(endDate.getFullYear(),endDate.getMonth(),1);

        if(startDate.getMonth()==endDate.getMonth() && startDate.getFullYear()==endDate.getFullYear())
        {
            if(startDate.getMonth()==dateNow.getMonth()) cronString+=` ${startDate.getDate()-endDate.getDate()} ${startDate.getMonth()} *`
            return null;
        }
        else if(dateNow>=startDate && dateNow<=lastDayOfStartDateMonth) cronString+=` ${startDate.getDate()}-${lastDayOfStartDateMonth.getDate()} ${startDate.getMonth()} *`
        else if(dateNow>=firstDayOfEndDateMonth && dateNow<=lastDayOfEndDateMonth && endDate<=lastDayOfEndDateMonth) cronString += `  ${firstDayOfEndDateMonth.getDate()}-${endDate.getDate()} ${startDate.getMonth()} *`
        else cronString+=` * ${firstDayOfEndDateMonth.getMonth()} *`;
        return cronString;
    }


    transformReccurentPlanificationToCronJobString(planning:PlanificationType)
    {
        let cronString = this.transformTimeToCronJobString(planning.time);
        switch (planning.recurency) {
            case CRON_JOB_RECCURENT_TYPE.DAY:
                cronString+=` */${planning.every} ${new Date().getMonth()} *`
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
                cronString+=` ${datesString} ${newCurrentDateWeek.getMonth()} *`

                break;
            case CRON_JOB_RECCURENT_TYPE.MONTH:
                let begingMonthDate = new Date(planning.date), newCurrentDateMonth = new Date();
                
                if(newCurrentDateMonth.getFullYear()==begingMonthDate.getFullYear() && newCurrentDateMonth.getMonth()==begingMonthDate.getMonth())
                {
                    cronString+=` ${begingMonthDate.getDate()} ${begingMonthDate.getMonth()} *`
                }
                else return null;
                break;
            case CRON_JOB_RECCURENT_TYPE.YEAR:
                let begingYearDate = new Date(planning.date), newCurrentDateYear = new Date();
                newCurrentDateYear.setFullYear(newCurrentDateYear.getFullYear()+planning.every);
                
                if((newCurrentDateYear.getFullYear()-begingYearDate.getFullYear()%planning.every==0) && newCurrentDateYear.getMonth()==begingYearDate.getMonth())
                {
                    cronString+=` ${begingYearDate.getDate()} ${begingYearDate.getMonth()} *`
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
            let oldDate = new Date(date);
            console.log(newDate,oldDate)
            if(newDate.getMonth()==oldDate.getMonth()) dayString+=`${oldDate.getDate()},`
        });
        if(dayString.length>0) {
            return `${this.transformTimeToCronJobString(planning.time)} ${dayString.slice(0,dayString.lastIndexOf(","))} ${newDate.getMonth()} *`
            // return `${this.transformTimeToCronJobString(planning.time)} ${dayString.slice(0,dayString.lastIndexOf(","))} ${newDate.getMonth()+1} *`
        }
        return null;
    }

    transformTimeToCronJobString(timeDef:string)
    {
        let [time,timeZone] = timeDef.split(" ");
        let [heure,minute] = time.split(":");

        if(timeZone=="PM") return `0 ${parseInt(minute)} ${parseInt(heure)+12}`
        return `0 ${parseInt(minute)} ${parseInt(heure)}`
    }
}
