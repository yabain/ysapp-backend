import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "src/user/user.module";
import { ContactController } from "./controllers";
import { Contact, ContactSchema } from "./models";
import { ContactsService } from "./services";
import { GroupModule } from "src/group";

@Module({
    controllers:[ContactController],
    imports:[
        MongooseModule.forFeature([
        {name:Contact.name,schema:ContactSchema}
    ]),
        UserModule,
        GroupModule
    ],
    providers:[ContactsService],
    exports:[ContactsService]
})
export class ContactModule{}