import { CronJob } from "cron";

export class CronJobTask
{
    static newJobTask(task:(params)=>void,params,toDate:Date)
    {
        let job = new CronJob(
            toDate,
            ()=>task(params),
            null,
            true,
        );
        job.start();
    }
}
