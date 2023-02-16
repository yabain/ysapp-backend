import { Controller, Post, UseGuards, Body, HttpStatus, Req } from "@nestjs/common";
import { Request } from "express";
import { UserJwtAuthGuard } from "src/user/guards";
import { PostNewMessageDTO } from "../dtos";
import { MessageService } from "../services";

@UseGuards(UserJwtAuthGuard)
@Controller("message")
export class MessageController
{
    constructor(private messageService:MessageService){}

    @Post("post")
    async postNewMessage(@Req() request:Request, @Body() postNewMessageDTO:PostNewMessageDTO,)
    {
        return {
            statusCode:HttpStatus.OK,
            message:"Messsage send successfully",
            data:await this.messageService.postNewMessage(postNewMessageDTO,request.user["userId"])
        }
    }
}