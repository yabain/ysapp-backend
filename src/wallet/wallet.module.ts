import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Wallet, WalletSchema } from "./models";


@Module({
    imports:[MongooseModule.forFeature([{name:Wallet.name,schema:WalletSchema}])],
    controllers:[],
    providers:[]
})
export class WalletModule {}