import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
// import { JwtModule } from "@nestjs/jwt";
import { UserController, UserProfilController } from "./controllers";
import { User, UserDocument, UserSchema } from "./models";
import { UsersService } from "./services";

import { PasswordUtil } from "./utils";
// import { JWT_CONSTANT } from "src/shared/config";
import { SharedModule } from "src/shared/shared.module";
import { MongoServerError } from "mongodb";
// import { MongooseError } from "mongoose";


@Module({
    imports:[
        // MongooseModule.forFeature([{name:User.name,schema:UserSchema}]),
        MongooseModule.forFeatureAsync([
            {
                name:User.name,
                useFactory: ()=>{
                    const schema = UserSchema
                    schema.pre("save",function (next){
                        let groupsMap = new Map();

                        this.groups.forEach((group)=>{
                            if(groupsMap.has(group.name)) return next(new MongoServerError({message:"Duplication de nom de groupe"}));
                            groupsMap.set(group.name,true);
                        })

                        let contactsMap = new Map();
                        this.contacts.forEach((contact)=>{
                            if(contactsMap.has(contact.phoneNumber)) return next(new MongoServerError({message:"Duplication de téléphone de contact"}));
                            contactsMap.set(contact.phoneNumber,1);
                        })
                        next();
                    })
                   
                    return schema;
                }
            }]),
        // JwtModule.register({
        //     secret:JWT_CONSTANT.secret,
        //     signOptions: { expiresIn: JWT_CONSTANT.expiresIn }
        // }),
        SharedModule
    ],
    controllers:[UserProfilController,UserController],
    providers:[UsersService,],
    exports:[UsersService,]
})
export class UserModule{}