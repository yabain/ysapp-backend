import { HttpException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { UsersService } from "src/user/services";
import { Wallet } from "src/wallet/models";
import { WalletService } from "src/wallet/services";
import { CreateAppDTO } from "../dtos";
import { Application, ApplicationDocument } from "../models";

@Injectable()
export class ApplicationService
{
    constructor(
        @InjectModel(Application.name) private appModel:Model<ApplicationDocument>, 
        private walletService:WalletService,
        private usersService:UsersService,
        @InjectConnection() private readonly connection:mongoose.Connection
    ){}

    async create(createappDTO: CreateAppDTO,user):Promise<{app:Application,wallet:Wallet}>
    {
        const transaction= await this.connection.startSession();
        transaction.startTransaction();
        try
        {
            let app= new Application()
            app.name=createappDTO.name;
            if(createappDTO.urlToCallBack) app.urlToCallBack=createappDTO.urlToCallBack;
            app.owner=await this.usersService.findOneByField({email:user.email});
            if(!app.owner) throw new NotFoundException();

            let wallet=await this.walletService.create(app.owner,await new this.appModel(app).save({session:transaction}),transaction);
            transaction.commitTransaction();
            return {app,wallet}
        }
        catch(err)
        {
            console.log("Err ",err)
            await transaction.abortTransaction();
            throw err
        }
        finally
        {
            transaction.endSession();
        }
    }

    async findAll(): Promise<ApplicationDocument[]>
    {
        return this.appModel.find().exec();
    }

    async findByField(appObj:Record<string,any>):Promise<ApplicationDocument[]>
    {
        return this.appModel.find<ApplicationDocument>(appObj).exec()
    }

    async findOneByField(appObj:Record<string,any>):Promise<ApplicationDocument>
    {
        return this.appModel.findOne<ApplicationDocument>(appObj).exec()
    }
}