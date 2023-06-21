import { Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose"
import mongoose, { Model } from "mongoose";
import { PartialType } from "@nestjs/mapped-types";
import { CreateContactDTO } from "../dtos";
import { Contact, ContactDocument } from "../models";
import { DataBaseService } from "src/shared/services/database";
import { UsersService } from "src/user/services";
import { GroupService } from "src/group/services/group.service";

@Injectable()
export class ContactsService extends DataBaseService<ContactDocument>
{
    constructor(@InjectModel(Contact.name) private contactModel:Model<ContactDocument>,
        @InjectConnection() connection:mongoose.Connection,
        private usersService:UsersService,
        private groupService:GroupService
        ){
        super(contactModel,connection);
    }

    async createNewContact(createContactDTO: CreateContactDTO,email:string):Promise<ContactDocument>
    {
        let user= await this.usersService.findOneByField({email});
        let contact = new this.contactModel(createContactDTO);
        user.contacts.push(contact);
        await user.save()
        return contact.save();
    }
    
}