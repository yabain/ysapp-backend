import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Application, ApplicationSchema } from "./models";

@Module({
    imports:[MongooseModule.forFeature([{name:Application.name,schema:ApplicationSchema}])],
    controllers:[],
    providers:[]
})
export class ApplicationModule{}