import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "src/user/user.module";
import { ContactController } from "./controllers";
import { Contact, ContactSchema } from "./models";
import { ContactsService } from "./services";

@Module({
    controllers:[ContactController],
    imports:[
        MongooseModule.forFeature([
        {name:Contact.name,schema:ContactSchema}
    ]),
    UserModule
    ],
    providers:[ContactsService],
    exports:[ContactsService]
})
export class ContactModule{}