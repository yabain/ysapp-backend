import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt";
import { UserController, UserProfilController } from "./controllers";
import { User, UserDocument, UserSchema } from "./models";
import { UsersService } from "./services";

import { PasswordUtil } from "./utils";
import { JWT_CONSTANT } from "src/shared/config";
import { SharedModule } from "src/shared/shared.module";


@Module({
    imports:[
        MongooseModule.forFeature([{name:User.name,schema:UserSchema}]),
        JwtModule.register({
            secret:JWT_CONSTANT.secret,
            signOptions: { expiresIn: JWT_CONSTANT.expiresIn }
        }),
        SharedModule
    ],
    controllers:[UserProfilController,UserController],
    providers:[UsersService,],
    exports:[UsersService,]
})
export class UserModule{}