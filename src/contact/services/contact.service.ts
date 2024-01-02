import { HttpStatus, Injectable, UnprocessableEntityException } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose"
import mongoose, { Model } from "mongoose";
import { PartialType } from "@nestjs/mapped-types";
import { CreateContactDTO } from "../dtos";
import { Contact, ContactDocument, ContactSchema } from "../models";
import { DataBaseService } from "src/shared/services/database";
import { UsersService } from "src/user/services";

@Injectable()
export class ContactsService extends DataBaseService<ContactDocument>
{
    
    constructor(@InjectModel(Contact.name) private contactModel:Model<ContactDocument>,
        @InjectConnection() connection:mongoose.Connection,
        private usersService:UsersService
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

    async createBulkContact(
        data: {
            fullName:String,
            emails:{email:string,label:string}[],
            avatar:String,
            phoneNumbers:{phoneNumber:string,label:string,country:string}[],
            websiteLink:string,
            address:String,
            birthday:String,
            about:String,
            jobTitle:string,
            organization:string,
            company:string
        }[],
        userEmail:String
    ) {
        let user= await this.usersService.findOneByField({email:userEmail});
        return this.executeWithTransaction(async (session)=>{
            await Promise.all(data.map((contact)=>{
                if(user.contacts.findIndex((fcountact)=>fcountact.fullName==contact.fullName)>-1) return true;
                let newContactModel= this.createInstance({
                    fullName:contact.fullName,
                    emails:contact.emails,
                    avatar:contact.avatar,
                    phoneNumbers:contact.phoneNumbers,
                    address:contact.address,
                    birthday:contact.birthday,
                    about:contact.about,
                    websiteLink:contact.websiteLink,
                    jobTitle:contact.jobTitle,
                    organization:contact.organization,
                    company:contact.company
                });
                user.contacts.push(newContactModel);
                return newContactModel.save({session})
            }));
            await user.save({session});
            return true;            
        })
    }
    
}