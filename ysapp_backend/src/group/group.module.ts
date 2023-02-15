import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "src/user/user.module";
import { GroupController } from "./controllers";
import { Group, GroupSchema } from "./models";
import { GroupService } from "./services/group.service";

@Module({
    controllers:[
        GroupController
    ],
    imports:[
        MongooseModule.forFeature([
            {name:Group.name,schema:GroupSchema}
        ]),
        UserModule
    ],
    exports:[],
    providers:[GroupService]
})
export class GroupModule{}