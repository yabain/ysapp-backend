import { Body, Controller, HttpStatus, Post, Req, UseGuards } from "@nestjs/common"
import { Request } from "express";
import { UserJwtAuthGuard } from "src/user/guards";
import { CreateAppDTO } from "../dtos";
import { ApplicationService } from "../services";

@UseGuards(UserJwtAuthGuard)
@Controller("apps")
export class ApplicationController
{
    constructor(private appService:ApplicationService){}

    @Post('create')
    async createApp(@Req() request:Request, @Body() createAppDTO:CreateAppDTO)
    {
        
        return {
            statusCode:HttpStatus.CREATED,
            message:"The application was created successfully",
            data: await this.appService.create(createAppDTO,request.user)
        }
    }
}