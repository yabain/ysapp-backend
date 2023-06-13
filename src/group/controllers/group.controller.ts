import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AddContactToGroupDTO, CreateGroupDTO } from "../dtos";
import { Request } from "express";
import { GroupService } from "../services/group.service";

@Controller("groups")
export class GroupController
{
    constructor(private groupsService:GroupService){}

    @Post()    
    async addGroup(@Req() request:Request, @Body() createGroupDTO:CreateGroupDTO)
    {
        let data=await this.groupsService.createNewGroup(createGroupDTO,request["user"]["userId"])
        return {
            statusCode:HttpStatus.CREATED,
            message:"Group add successfully",
            data
        }        
    }

    @HttpCode(HttpStatus.OK)
    @Post("contact")
    async addContactToGroup(@Req() request:Request, @Body() addContactToGroupDTO:AddContactToGroupDTO)
    {
        await this.groupsService.addContactToGroup(request["user"]["userId"],addContactToGroupDTO.contactId,addContactToGroupDTO.groupId)
        return {
            statusCode:HttpStatus.OK,
            message:"Contact add to group successfully"
        }   
    }

    @Get(":id")    
    async getGroupById(@Req() request:Request, @Param("ref",new ParseUUIDPipe({version:"4"})) id:string)
    {
        let data=await this.groupsService.findOneByField({"groups.id":id})
        return {
            statusCode:HttpStatus.OK,
            message:"Group details",
            data
        }        
    }

    @Put(":id")
    async updateGroupById(@Req() request:Request, @Param("ref",new ParseUUIDPipe({version:"4"})) id:string)
    {
        let data=await this.groupsService.update({"_id":id},{})
    }

    
}