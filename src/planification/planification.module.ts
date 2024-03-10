import { Module } from "@nestjs/common";
import { SharedModule } from "src/shared/shared.module";
import { Planification, PlanificationSchema } from "./models";
import { MongooseModule } from "@nestjs/mongoose";
import { ObjectId } from "mongoose";
import { PlanificationService } from "./services";
import { ContactModule } from "src/contact/contact.module";
import { PlanificationController } from "./controllers";
import { CronJobTaskService } from "./services/cron-job-task.service";
import { SendMessageInDynamicJobUtil } from "./utils";

@Module({
    controllers:[
        PlanificationController
    ],
    imports:[
        SharedModule,
        MongooseModule.forFeatureAsync([
            {
                name:Planification.name,
                useFactory: ()=>{
                    const schema = PlanificationSchema
                    schema.pre("save",function (next){
                        this.planning=this.planning.map((plan)=>({...plan,subJobId:""})) //ObjectId.toString()
                        next();
                    })
                   
                    return schema;
                }
            } 
          ]),
        ContactModule
    ],
    providers:[
        PlanificationService,
        CronJobTaskService,
        SendMessageInDynamicJobUtil
    ],
    exports:[
        PlanificationService,
        CronJobTaskService
    ],
})
export class PlanificationModule{}
