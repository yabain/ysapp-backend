import { Module } from "@nestjs/common";
import { SharedModule } from "src/shared/shared.module";
import { Planification, PlanificationSchema } from "./models";
import { MongooseModule } from "@nestjs/mongoose";
import { PlanificationService } from "./services";
import { ContactModule } from "src/contact/contact.module";
import { PlanificationController } from "./controllers";
import { CronJobTaskService } from "./services/cron-job-task.service";

@Module({
    controllers:[
        PlanificationController
    ],
    imports:[
        SharedModule,
        MongooseModule.forFeature([
            {name:Planification.name,schema:PlanificationSchema}
          ]),
        ContactModule
    ],
    providers:[
        PlanificationService,
        CronJobTaskService
    ],
    exports:[
        PlanificationService
    ],
})
export class PlanificationModule{}