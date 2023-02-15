import { Body, Controller, Post, UseGuards,Req, HttpStatus, Get, Param, ParseUUIDPipe, Put } from "@nestjs/common";
import { Request } from "express";import { UserJwtAuthGuard } from "src/user/guards";
import { CreateContactDTO } from "../dtos";
import { ContactsService } from "../services";

@UseGuards(UserJwtAuthGuard)
@Controller("contacts")
export class ContactController
{
    constructor(private contactsService:ContactsService){}

    @Post()    
    async addContact(@Req() request:Request, @Body() createContactDTO:CreateContactDTO)
    {
        let data=await this.contactsService.createNewContact(createContactDTO,request.user["userId"])
        return {
            statusCode:HttpStatus.CREATED,
            message:"Contact add successfully",
            data
        }        
    }
    @Get(":id")    
    async getContactById(@Req() request:Request, @Param("ref",new ParseUUIDPipe({version:"4"})) id:string)
    {
        let data=await this.contactsService.findOneByField({"contacts.id":id})
        return {
            statusCode:HttpStatus.OK,
            message:"Contact details",
            data
        }        
    }

    @Put(":id")
    async updateContactById(@Req() request:Request, @Param("ref",new ParseUUIDPipe({version:"4"})) id:string)
    {
        let data=await this.contactsService.update({"_id":id},{})
    }
}