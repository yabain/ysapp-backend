import { Injectable } from "@nestjs/common";
import { Cron,SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from "cron";
import { User } from "src/user/models";

@Injectable()
export class CronJobTaskService
{

    constructor(private schedulerRegistry: SchedulerRegistry){}
        
    newJobTask(task:(params)=>void,params,plan:string,planName:string)
    {
        let job = new CronJob(plan, ()=>task(params));
        this.schedulerRegistry.addCronJob(planName,job);
        job.start();        
    }

    removeJobTask(planName:string)
    {
        let job = this.schedulerRegistry.getCronJob(planName);
        if(job) job.stop();
        this.schedulerRegistry.deleteCronJob(planName);
    }

    generateNewJobName(userSender:User)
    {
        return `sending_message_to_${userSender.email}_${new Date().toISOString()}`
    }

    jobExist(jobName)
    {
        return this.schedulerRegistry.getCronJob(jobName)?true:false;
    }
}
