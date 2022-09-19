import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "src/user/user.module";
import { WalletModule } from "src/wallet/wallet.module";
import { ApplicationController } from "./controllers";
import { Application, ApplicationSchema } from "./models";
import { ApplicationService } from "./services";

@Module({
    imports:[
        MongooseModule.forFeature([{name:Application.name,schema:ApplicationSchema}]),
        UserModule,
        WalletModule
    ],
    controllers:[ApplicationController],
    providers:[ApplicationService],
    exports:[ApplicationService]
})
export class ApplicationModule{}