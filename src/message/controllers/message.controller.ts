import { Controller, Post, UseGuards, Body, HttpStatus, Req,Get } from "@nestjs/common";
import { Request } from "express";
import { PostNewMessageDTO } from "../dtos";
import { MessageService, WhatsappAnnouncementService } from "../services";

@Controller("message")
export class MessageController
{
    constructor(
        private messageService:MessageService,
        private whatsAppAnnouncementService:WhatsappAnnouncementService
        ){}


    @Get("qr-code")
    async getQRCode(@Req() request:Request) 
    {
        return {
            statusCode:HttpStatus.OK,
            message:"Messsage send successfully",
            data:await this.whatsAppAnnouncementService.initWhatsAppSession(request["user"]["email"])
        }
    }

    @Post("post")
    async postNewMessage(@Req() request:Request, @Body() postNewMessageDTO:PostNewMessageDTO,)
    {
        return {
            statusCode:HttpStatus.OK,
            message:"Messsage send successfully",
            data:await this.messageService.postNewMessage(postNewMessageDTO,request["user"]["email"])
        }
    }

    
}