import { HttpStatus, Injectable, UnprocessableEntityException } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose"
import mongoose, { Model, Connection} from "mongoose";
import { PartialType } from "@nestjs/mapped-types";
import { CreateContactDTO } from "../dtos";
import { Contact, ContactDocument, ContactSchema } from "../models";
import { DataBaseService } from "src/shared/services/database";
import { UsersService } from "src/user/services";

@Injectable()
export class ContactsService extends DataBaseService<ContactDocument>
{
    
    constructor(@InjectModel(Contact.name) private contactModel:Model<ContactDocument>,
        @InjectConnection() connection:Connection,
        private usersService:UsersService,
        ){
        super(contactModel,connection);
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
            let toAddContacts = [], toUpdateContats = [];
            let ops=[]
            data.forEach(async (contact)=>{
                let contactIndex = user.contacts.findIndex((fcountact)=>fcountact.fullName.toLowerCase()==contact.fullName.toLowerCase() || fcountact.phoneNumbers[0].phoneNumber==contact.phoneNumbers[0].phoneNumber),
                newContactObject = {
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
                };          
                // console.log("Contact Index",contactIndex)
                if( contactIndex >-1) toUpdateContats.push({
                    "updateOne":{
                        "filter":{ 
                            "$or": [
                                { "phoneNumbers.phoneNumber": contact.phoneNumbers[0].phoneNumber},
                                { "fullName": contact.fullName }
                            ]
                        },
                        "update":{"$set": newContactObject},                    
                    }
                }) 
                else toAddContacts.push(newContactObject);                
            });
            // return user.save({session});    
            let listContact:[] = await this.createMany(toAddContacts,session);
            await this.usersService.bulkOperator(listContact.map((cont)=>({
                "updateOne":{
                    "filter":{ email:userEmail },
                    "update":{"$push":{contacts: cont}},                    
                }
            })),session)
            await this.bulkOperator(toUpdateContats,session);
            return true;
        })
    }
}