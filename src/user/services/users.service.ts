import { Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose"
import mongoose, { Model } from "mongoose";
import { User, UserDocument } from "../models";
import { DataBaseService } from "src/shared/services/database";

@Injectable()
export class UsersService extends DataBaseService<UserDocument>
{
    constructor(@InjectModel(User.name) private userModel:Model<UserDocument>,
    @InjectConnection() connection:mongoose.Connection,){
        super(userModel,connection);
        console.log("User ",User.name)
    }

    async findAll(): Promise<UserDocument[]>
    {
        return this.entityModel.find<UserDocument>().sort({createdAt:1}).populate(["contacts","groups"]).exec();
    }

 
    async findByField(entityObj:Record<string,any>):Promise<UserDocument[]>
    {
        return this.entityModel.find<UserDocument>({where:entityObj}).sort({createdAt:1}).populate(["contacts","groups"]).exec();
    }

    async findOneByField(entityObj:Record<string,any>):Promise<UserDocument>
    {
        return this.entityModel.findOne<UserDocument>(entityObj).populate(["contacts","groups"]).exec();
    }
    
}