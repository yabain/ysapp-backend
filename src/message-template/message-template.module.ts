import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose";
import { SharedModule } from "src/shared/shared.module";
import { MessageTemplate, MessageTemplateSchema } from "./models";
import { MessageTemplateController } from "./controllers";
import { MessageTemplatesService } from "./services";
import { UserModule } from "src/user/user.module";


@Module({
    imports:[
        MongooseModule.forFeature([
            {name:MessageTemplate.name,schema:MessageTemplateSchema}
        ]),
        UserModule,
        SharedModule
    ],
    controllers:[
        MessageTemplateController
    ],
    providers:[
        MessageTemplatesService
    ],
    exports:[MessageTemplatesService]
})
export class MessageTemplateModule{}