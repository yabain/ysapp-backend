import mongoose, { Model } from "mongoose";
import { CreateContactDTO } from "../dtos";
import { ContactDocument } from "../models";
import { DataBaseService } from "src/shared/services/database";
import { UsersService } from "src/user/services";
export declare class ContactsService extends DataBaseService<ContactDocument> {
    private contactModel;
    private usersService;
    constructor(contactModel: Model<ContactDocument>, connection: mongoose.Connection, usersService: UsersService);
    createNewContact(createContactDTO: CreateContactDTO, userId: string): Promise<ContactDocument>;
}
