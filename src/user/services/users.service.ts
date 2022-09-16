import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose";
import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDTO, LoginUserDTO } from "../dtos";
import { User, UserDocument } from "../models";

@Injectable()
export class UsersService
{
    constructor(@InjectModel('User') private userModel:Model<UserDocument>){}

    async create(createUserDTO: CreateUserDTO):Promise<User>
    {
        return new this.userModel(createUserDTO).save();
    }

    async findAll(): Promise<User[]>
    {
        return this.userModel.find().exec();
    }

    async findByEmailAndPassword(userDTO:LoginUserDTO):Promise<User>
    {
        return this.userModel.findOne<User>(userDTO).exec();
    }

    async findByField(userObj:Record<string,any>):Promise<User[]>
    {
        return this.userModel.find<User>(userObj).exec()
    }

    async findOneByField(userObj:Record<string,any>):Promise<User>
    {
        return this.userModel.findOne<User>(userObj).exec()
    }
    
}