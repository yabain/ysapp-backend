import { Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose"
import mongoose, { Model } from "mongoose";
import { PartialType } from "@nestjs/mapped-types";
import { CreateContactDTO } from "../dtos";
import { Contact, ContactDocument } from "../models";
import { DataBaseService } from "src/shared/services/database";
import { UsersService } from "src/user/services";

@Injectable()
export class ContactsService extends DataBaseService<ContactDocument>
{
    constructor(@InjectModel(Contact.name) private contactModel:Model<ContactDocument>,
        @InjectConnection() connection:mongoose.Connection,
        private usersService:UsersService,
        ){
        super(contactModel,connection);
    }

    async createNewContact(createContactDTO: CreateContactDTO,userId:string):Promise<ContactDocument>
    {
        let user= await this.usersService.findOneByField({"_id":userId});
        let contact = new this.contactModel(createContactDTO);
        user.contacts.push(contact);
        await user.save()
        return contact.save();
    }
    
}