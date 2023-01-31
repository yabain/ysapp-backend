import { Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose"
import mongoose, { Model } from "mongoose";
import { UserDocument } from "../models";
import { DataBaseService } from "src/shared/services/database";

@Injectable()
export class UsersService extends DataBaseService<UserDocument>
{
    constructor(@InjectModel('User') private userModel:Model<UserDocument>,
    @InjectConnection() connection:mongoose.Connection,){
        super(userModel,connection);
    }

    async findAll(): Promise<UserDocument[]>
    {
        return this.entityModel.find<UserDocument>().sort({createdAt:1}).populate("contacts").exec();
    }

 
    async findByField(entityObj:Record<string,any>):Promise<UserDocument[]>
    {
        return this.entityModel.find<UserDocument>({where:entityObj}).sort({createdAt:1}).populate("contacts").exec();
    }

    async findOneByField(entityObj:Record<string,any>):Promise<UserDocument>
    {
        return this.entityModel.findOne<UserDocument>(entityObj).populate("contacts").exec();
    }
    
}