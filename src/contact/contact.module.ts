import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "src/user/user.module";
import { ContactController } from "./controllers";
import { Contact, ContactEmail, ContactEmailSchema, ContactSchema, PhoneNumber, PhoneNumberSchema } from "./models";
import { ContactsService } from "./services";
import { GroupModule } from "src/group";
import { WhatsappAnnouncementService } from "src/message/services";

@Module({
    controllers:[ContactController],
    imports:[
            MongooseModule.forFeature([
            {name:Contact.name,schema:ContactSchema},
            // {name:ContactEmail.name,schema:ContactEmailSchema},
            // {name:PhoneNumber.name,schema:PhoneNumberSchema},
        ]),
        UserModule,
        GroupModule
    ],
    providers:[
        ContactsService,
    ],
    exports:[
        ContactsService
    ]
})
export class ContactModule{}