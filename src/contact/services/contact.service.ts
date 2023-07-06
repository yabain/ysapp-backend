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

    async createBulkContact(data: {
        firstname:String,lastname:String,email:String,profilepicture:String,phonenumber:String,gender:String
        country:String,whatsappcontact:string,websitelink:string,address:String,birthday:String,about:String,
        organization:String,city:String}[],
        userEmail:String
    ) {
        let user= await this.usersService.findOneByField({email:userEmail});
        return this.executeWithTransaction(async (session)=>{
            await Promise.all(data.map((contact)=>{
                if(contact.firstname.trim()=="" ||  contact.lastname.trim()=="") return Promise.resolve();
                let newContactModel= this.createInstance({
                    firstName:contact.firstname,
                    lastName:contact.lastname,
                    email:contact.email,
                    profilePicture:contact.profilepicture,
                    phoneNumber:contact.phonenumber,
                    country:contact.country,
                    whatsappContact:contact.whatsappcontact,
                    websiteLink:contact.websitelink,
                    address:contact.address,
                    birthday:contact.birthday,
                    about:contact.about

                });
                user.contacts.push(newContactModel);
                return newContactModel.save({session})
            }));
            await user.save({session});
            return true;            
        })
    }
    
}