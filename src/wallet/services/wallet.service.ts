import { Injectable } from "@nestjs/common"
import mongoose,{ Model } from "mongoose"
import { InjectModel } from "@nestjs/mongoose";
import { WalletDocument } from "../models";
import { Application } from "src/application/models";


@Injectable()
export class WalletService
{
    constructor(@InjectModel('Wallet') private walletModel:Model<WalletDocument>){}

    create(user,application:Application,transaction: mongoose.ClientSession | null = null)
    {
        return new this.walletModel({
            amount:0,
            owner:user,
            app:application
        }).save({session:transaction})
    }
}